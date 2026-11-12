import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isLocalMock, loadShows } from '../netlify/lib/load-shows.mjs';
import { createShowsHandler } from '../netlify/functions/shows.mjs';

test('local mock works without credentials and uses the same publication filter', async () => {
  const shows = await loadShows({ env: { NETLIFY_DEV: 'true', CALENDAR_MOCK: 'true' } });
  assert.equal(shows.length, 1);
  assert.equal(shows[0].title, 'Test Show');
  assert.ok(shows[0].location);
  assert.equal(JSON.stringify(shows).includes('Mock internal note'), false);
  assert.equal(JSON.stringify(shows).includes('description'), false);
});

test('mock flag cannot select fixtures in a deployed function', async () => {
  for (const env of [
    { CALENDAR_MOCK: 'true' },
    { CALENDAR_MOCK: 'true', CONTEXT: 'production' },
    { CALENDAR_MOCK: 'true', NETLIFY_DEV: 'true', CONTEXT: 'production' },
    { CALENDAR_MOCK: 'true', NETLIFY_DEV: 'true', CONTEXT: 'deploy-preview' },
    { CALENDAR_MOCK: 'true', NETLIFY_DEV: 'true', CONTEXT: 'branch-deploy' }
  ]) {
    assert.equal(isLocalMock(env), false);
    await assert.rejects(loadShows({ env }));
  }
});

test('missing real credentials return safe uncached HTTP 503', async () => {
  const handler = createShowsHandler(() => loadShows({ env: { NETLIFY_DEV: 'true', CALENDAR_MOCK: 'false' } }));
  const response = await handler(new Request('http://localhost:8888/.netlify/functions/shows'));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await response.json(), { error: 'Shows are temporarily unavailable. Please try again shortly.' });
});
