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
  const allowed = ['id', 'title', 'venue', 'start', 'end', 'allDay', 'dateCheckString', 'dateString', 'location', 'link'];
  for (const show of data.shows) {
    assert.deepEqual(Object.keys(show).sort(), [...allowed].sort(), 'Public field allowlist must match');
  }
  const expectedTitle = process.argv[3] || "Bill's Bar & Lounge";
  const show = data.shows.find(show => show.title === expectedTitle);
  assert.ok(show, 'The expected venue event is missing. Check the title, marker, dates, sharing, and cache expiry.');
  assert.equal(show.venue, show.title, 'Venue must match the unchanged event title');
  assert.ok(show.location, 'The test event must have a city/state location');
  assert.ok(Number.isFinite(Date.parse(show.start)) && Number.isFinite(Date.parse(show.end)), 'Event dates must be valid');
  assert.ok(['http:', 'https:'].includes(new URL(show.link).protocol), 'Event must have a safe HTTP/HTTPS venue website');
  console.log('PASS: deployed venue event has dates, matching title/venue, location, safe website and only approved public fields.');
  console.log('Next: compare the rendered card with Google Calendar and verify unmarked events are absent.');
} catch (error) {
  console.error(`Verification failed: ${error.message}`);
  process.exitCode = 1;
}
