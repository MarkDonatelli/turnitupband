import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CalendarFailure, googleFailure, safeCalendarDiagnostic } from '../netlify/lib/calendar-errors.mjs';
import { readPublicShows } from '../netlify/lib/calendar.mjs';
import { createShowsHandler } from '../netlify/functions/shows.mjs';

test('missing expected variable names are diagnosed without values', async () => {
  await assert.rejects(readPublicShows({ env: {
    GOOGLE_CALENDAR_ID: 'DO_NOT_LOG_CALENDAR_ID'
  } }), error => {
    assert.deepEqual(safeCalendarDiagnostic(error), {
      code: 'MISSING_ENVIRONMENT', stage: 'configuration',
      missingVariables: ['GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY']
    });
    return true;
  });
});

test('malformed credentials fail before any Calendar request and do not log the key', async () => {
  let requested = false;
  await assert.rejects(readPublicShows({
    env: { GOOGLE_CALENDAR_ID: 'private', GOOGLE_CLIENT_EMAIL: 'test@example.com', GOOGLE_PRIVATE_KEY: 'DO_NOT_LOG_KEY' },
    fetchImpl: () => { requested = true; }
  }), error => {
    assert.deepEqual(safeCalendarDiagnostic(error), {
      code: 'INVALID_CREDENTIAL_FORMAT', stage: 'credentials', reason: 'invalid_private_key'
    });
    return true;
  });
  assert.equal(requested, false);
});

test('token rejection has a distinct stage and only allowlisted Google reason', () => {
  const diagnostic = safeCalendarDiagnostic(googleFailure('authentication', {
    status: 400, data: { error: 'invalid_grant', error_description: 'DO_NOT_LOG_KEY_OR_EMAIL' }
  }));
  assert.deepEqual(diagnostic, { code: 'AUTHENTICATION_FAILED', stage: 'authentication', upstreamStatus: 400, reason: 'invalid_grant' });
  assert.equal(safeCalendarDiagnostic(googleFailure('authentication', { networkCode: 'ETIMEDOUT' })).code, 'REQUEST_TIMEOUT');
  assert.equal(safeCalendarDiagnostic(googleFailure('authentication', { networkCode: 'ENOTFOUND' })).code, 'NETWORK_FAILURE');
});

test('Google HTTP failures distinguish access, missing calendar, disabled API, rate limits and server errors', async () => {
  for (const [status, reason, code] of [
    [401, 'authError', 'AUTHENTICATION_FAILED'],
    [403, 'insufficientPermissions', 'CALENDAR_PERMISSION_DENIED'],
    [404, 'notFound', 'CALENDAR_NOT_FOUND_OR_INACCESSIBLE'],
    [403, 'accessNotConfigured', 'CALENDAR_API_DISABLED'],
    [403, 'SERVICE_DISABLED', 'CALENDAR_API_DISABLED'],
    [403, 'rateLimitExceeded', 'GOOGLE_RATE_LIMITED'],
    [429, 'unknown', 'GOOGLE_RATE_LIMITED'],
    [500, 'backendError', 'GOOGLE_API_FAILURE']
  ]) {
    await assert.rejects(readPublicShows({
      env: { GOOGLE_CALENDAR_ID: 'DO_NOT_LOG_CALENDAR' }, accessToken: 'DO_NOT_LOG_TOKEN',
      fetchImpl: async () => Response.json({ error: {
        message: 'DO_NOT_LOG_DESCRIPTION', errors: [{ reason }], details: [{ reason }]
      } }, { status })
    }), error => {
      const diagnostic = safeCalendarDiagnostic(error);
      assert.equal(diagnostic.code, code);
      assert.equal(diagnostic.stage, 'calendar_request');
      assert.equal(diagnostic.upstreamStatus, status);
      assert.equal(JSON.stringify(diagnostic).includes('DO_NOT_LOG'), false);
      assert.equal(JSON.stringify(diagnostic).includes('unknown'), false);
      return true;
    });
  }
});

test('network, timeout, malformed response and unknown runtime failures have safe categories', async () => {
  for (const [fetchImpl, code] of [
    [async () => { throw new TypeError('DO_NOT_LOG_REQUEST_URL'); }, 'NETWORK_FAILURE'],
    [async () => { throw new DOMException('DO_NOT_LOG_REQUEST_URL', 'TimeoutError'); }, 'REQUEST_TIMEOUT'],
    [async () => new Response('DO_NOT_LOG_RESPONSE'), 'INVALID_CALENDAR_RESPONSE']
  ]) {
    await assert.rejects(readPublicShows({ env: { GOOGLE_CALENDAR_ID: 'private' }, accessToken: 'private', fetchImpl }), error => {
      assert.equal(safeCalendarDiagnostic(error).code, code);
      return true;
    });
  }
  assert.deepEqual(safeCalendarDiagnostic(new Error('DO_NOT_LOG_RAW_ERROR')), { code: 'RUNTIME_FAILURE', stage: 'runtime' });
});

test('server logs use an allowlist, public errors stay generic and correlation IDs match', async () => {
  const logs = [];
  const error = new CalendarFailure('CALENDAR_PERMISSION_DENIED', 'calendar_request', {
    status: 403, reason: 'DO_NOT_LOG_DESCRIPTION',
    access_token: 'DO_NOT_LOG_TOKEN', private_key: 'DO_NOT_LOG_KEY',
    missingVariables: ['GOOGLE_CALENDAR_ID', 'DO_NOT_LOG_VARIABLE']
  });
  error.stack = 'DO_NOT_LOG_STACK';
  const handler = createShowsHandler(() => { throw error; }, entry => logs.push(entry));
  const response = await handler(new Request('https://site.example/.netlify/functions/shows'));
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await response.json(), { error: 'Shows are temporarily unavailable. Please try again shortly.' });
  assert.equal(logs.length, 1);
  assert.equal(logs[0].event, 'calendar_shows_failure');
  assert.equal(logs[0].code, 'CALENDAR_PERMISSION_DENIED');
  assert.equal(logs[0].requestId, response.headers.get('X-Calendar-Request-ID'));
  assert.equal(JSON.stringify(logs).includes('DO_NOT_LOG'), false);
});

test('logging failures do not prevent a safe error response', async () => {
  const handler = createShowsHandler(() => { throw new Error('private'); }, () => { throw new Error('logger failed'); });
  assert.equal((await handler(new Request('https://site.example/'))).status, 503);
});
