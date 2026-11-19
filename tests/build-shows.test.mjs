import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createBuildShowsReader, showsRequiredAtBuild, ShowsUnavailableAtBuild } from '../netlify/lib/build-shows.mjs';
import { CalendarFailure } from '../netlify/lib/calendar-errors.mjs';

const PRODUCTION = { CONTEXT: 'production' };

function reader(load, env, extra = {}) {
  const logs = [];
  const read = createBuildShowsReader({ load, env, log: event => logs.push(event), ...extra });
  return { read, logs };
}

test('only production builds require the calendar, with an explicit override', () => {
  assert.equal(showsRequiredAtBuild(PRODUCTION), true);
  assert.equal(showsRequiredAtBuild({ CONTEXT: 'production', SHOWS_ALLOW_EMPTY_BUILD: 'true' }), false);
  for (const CONTEXT of [undefined, 'deploy-preview', 'branch-deploy', 'dev']) {
    assert.equal(showsRequiredAtBuild({ CONTEXT }), false);
  }
});

test('zero upcoming shows is a successful read, even in production', async () => {
  const { read, logs } = reader(async () => [], PRODUCTION);
  const result = await read();
  assert.deepEqual(result.shows, []);
  assert.equal(logs.length, 0);
});

for (const [name, load] of [
  ['authentication error', async () => { throw new CalendarFailure('AUTHENTICATION_FAILED', 'authentication', { status: 401 }); }],
  ['API error', async () => { throw new CalendarFailure('GOOGLE_API_FAILURE', 'calendar_request', { status: 500 }); }],
  ['missing credentials', async () => { throw new CalendarFailure('MISSING_ENVIRONMENT', 'configuration', { missingVariables: ['GOOGLE_PRIVATE_KEY'] }); }],
  ['malformed response', async () => ({ items: 'nope' })],
  ['unexpected exception', async () => { throw new Error('secret-looking detail https://example.test/hook?token=abc'); }]
]) {
  test(`production build fails on ${name}`, async () => {
    const { read, logs } = reader(load, PRODUCTION);
    await assert.rejects(read(), ShowsUnavailableAtBuild);
    assert.equal(logs.length, 1);
    assert.equal(logs[0].event, 'calendar_build_failure');
    assert.equal(logs[0].action, 'failing_build_to_keep_last_deploy');
    assert.doesNotMatch(JSON.stringify(logs), /secret|https?:|token|BEGIN/);
  });

  test(`non-production build continues without baked shows on ${name}`, async () => {
    const { read, logs } = reader(load, { CONTEXT: 'branch-deploy' });
    assert.equal(await read(), null);
    assert.equal(logs[0].action, 'continuing_without_baked_shows');
  });
}

test('a slow calendar times out and fails a production build', async () => {
  const { read, logs } = reader(() => new Promise(() => {}), PRODUCTION, { timeoutMs: 20 });
  await assert.rejects(read(), ShowsUnavailableAtBuild);
  assert.equal(logs[0].code, 'REQUEST_TIMEOUT');
});

test('override lets a production build continue during an outage', async () => {
  const { read } = reader(async () => { throw new Error('down'); }, { CONTEXT: 'production', SHOWS_ALLOW_EMPTY_BUILD: 'true' });
  assert.equal(await read(), null);
});

test('concurrent page renders share one calendar read; failures are not cached', async () => {
  let calls = 0;
  let fail = true;
  const { read } = reader(async () => { calls++; if (fail) throw new Error('x'); return [{ id: 1 }]; }, {});
  assert.equal(await read(), null);
  fail = false;
  const [a, b] = await Promise.all([read(), read()]);
  assert.equal(calls, 2);
  assert.equal(a, b);
  await read();
  assert.equal(calls, 2);
});
