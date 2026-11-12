import assert from 'node:assert/strict';

try {
  assert.ok(process.argv[2], 'Usage: node scripts/verify-calendar.mjs https://YOUR-PREVIEW.netlify.app');
  const site = new URL(process.argv[2]);
  assert.equal(site.protocol, 'https:', 'Use an HTTPS preview/deployment URL');
  const response = await fetch(new URL('/.netlify/functions/shows', site), {
    signal: AbortSignal.timeout(30000)
  });
  assert.equal(response.status, 200, `Function returned HTTP ${response.status}`);
  const data = await response.json();
  assert.ok(Array.isArray(data.shows), 'Function must return a shows array');
  const allowed = ['id', 'title', 'start', 'end', 'allDay', 'dateCheckString', 'dateString', 'location', 'link'];
  for (const show of data.shows) {
    assert.deepEqual(Object.keys(show).sort(), [...allowed].sort(), 'Public field allowlist must match');
  }
  const show = data.shows.find(show => show.title === 'Test Show');
  assert.ok(show, 'The existing Test Show event is missing. Check the marker, dates, sharing, and cache expiry.');
  assert.ok(show.location, 'Test Show must have a location');
  assert.ok(Number.isFinite(Date.parse(show.start)) && Number.isFinite(Date.parse(show.end)), 'Test Show dates must be valid');
  assert.equal(new URL(show.link).protocol, 'https:', 'Test Show must have an HTTPS venue website');
  console.log('PASS: deployed Test Show exists with dates, location, HTTPS website and only approved public fields.');
  console.log('Next: compare the rendered card with Google Calendar and verify unmarked events are absent.');
} catch (error) {
  console.error(`Verification failed: ${error.message}`);
  process.exitCode = 1;
}
