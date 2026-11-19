import test from 'node:test';
import assert from 'node:assert/strict';
import { isPrivateShow, showEvents } from '../utils/show-schema.mjs';
import { publicShow } from '../netlify/lib/calendar.mjs';
import { readMockShows } from '../netlify/lib/mock-calendar.mjs';
import { createRebuild } from '../netlify/functions/rebuild-shows.mjs';

const now = new Date('2026-11-19T15:00:00Z');
const event = overrides => ({
  id: 'evt1', status: 'confirmed', summary: 'The Press Room',
  location: 'The Press Room, 77 Daniel St, Portsmouth, NH 03801',
  description: 'https://www.pressroomnh.com/ #confirmedshow',
  start: { dateTime: '2026-11-21T21:00:00-05:00' }, end: { dateTime: '2026-11-22T00:30:00-05:00' },
  ...overrides
});
const band = { bandId: 'https://turnitupcoverband.com/#band' };

test('private by Google visibility: details are stripped on the server', () => {
  for (const visibility of ['private', 'confidential']) {
    const show = publicShow(event({ visibility, summary: 'Acme Corp holiday party' }), now);
    assert.equal(show.private, true);
    assert.deepEqual([show.title, show.venue, show.location, show.link], ['', '', '', '']);
    assert.ok(show.dateString, 'the date and time stay');
  }
});

test('private by title (no public link): details are stripped', () => {
  const show = publicShow(event({ summary: 'Private party - Smith wedding', description: '#confirmedshow', location: '12 Main St, Bedford, NH' }), now);
  assert.equal(show.private, true);
  assert.equal(JSON.stringify(show).includes('Smith'), false);
  assert.equal(JSON.stringify(show).includes('Bedford'), false);
});

test('a public show keeps venue, city and link', () => {
  const show = publicShow(event(), now);
  assert.equal(show.private, false);
  assert.equal(show.venue, 'The Press Room');
  assert.equal(show.location, 'Portsmouth, NH');
  assert.equal(show.link, 'https://www.pressroomnh.com/');
});

test('mock calendar: private bookings carry no names or places', () => {
  const shows = readMockShows(now);
  const priv = shows.filter(s => s.private);
  assert.equal(priv.length, 2);
  const text = JSON.stringify(priv);
  for (const leak of ['Mock family', 'Bedford', 'Mock Corp', 'Mock Hotel', 'mock-corp.example']) assert.equal(text.includes(leak), false, leak);
});

test('isPrivateShow: server flag, with the title rule as a backstop', () => {
  assert.equal(isPrivateShow({ private: true, venue: '' }), true);
  assert.equal(isPrivateShow({ venue: 'Private event', link: '' }), true);
  assert.equal(isPrivateShow({ venue: 'Private Lounge', link: 'https://venue.example/' }), false);
  assert.equal(isPrivateShow({ venue: 'The Press Room', link: '' }), false);
});

test('MusicEvent for a public show uses only verified calendar data', () => {
  const [e] = showEvents([publicShow(event(), now)], band);
  assert.equal(e['@type'], 'MusicEvent');
  assert.equal(e.name, 'Turn It Up! at The Press Room');
  assert.equal(e.startDate, '2026-11-21T21:00:00-05:00');
  assert.equal(e.endDate, '2026-11-22T00:30:00-05:00');
  assert.deepEqual(e.location, {
    '@type': 'Place', name: 'The Press Room',
    address: { '@type': 'PostalAddress', addressLocality: 'Portsmouth', addressRegion: 'NH', addressCountry: 'US' }
  });
  assert.equal(e.performer['@id'], band.bandId);
  assert.equal(e.url, 'https://www.pressroomnh.com/');
  assert.equal(e.eventStatus, 'https://schema.org/EventScheduled');
  // Nothing the calendar doesn't hold
  for (const key of ['offers', 'image', 'description', 'organizer']) assert.equal(key in e, false, key);
  assert.equal(JSON.stringify(e).includes('Daniel St'), false, 'no street address');
});

test('no MusicEvent for private shows or shows without a verified city', () => {
  const priv = publicShow(event({ visibility: 'private' }), now);
  const noCity = publicShow(event({ location: 'Somewhere fun' }), now);
  const noLink = publicShow(event({ description: '#confirmedshow' }), now);
  assert.deepEqual(showEvents([priv, noCity], band), []);
  const [e] = showEvents([noLink], band);
  assert.equal('url' in e, false, 'no url when the calendar has none');
});

test('all-day public shows use plain dates', () => {
  const show = publicShow(event({ start: { date: '2026-12-31' }, end: { date: '2027-01-01' } }), now);
  const [e] = showEvents([show], band);
  assert.equal(e.startDate, '2026-12-31');
});

test('daily rebuild: opt-in, posts to the hook, never logs it', async () => {
  const logs = [];
  await createRebuild({ hookUrl: '', log: e => logs.push(e) })();
  assert.equal(logs[0].reason, 'no_build_hook');

  const calls = [];
  await createRebuild({ hookUrl: 'https://api.netlify.com/build_hooks/secret123', fetchImpl: async (url, o) => (calls.push([url, o.method]), new Response(null, { status: 200 })), log: e => logs.push(e) })();
  assert.deepEqual(calls, [['https://api.netlify.com/build_hooks/secret123', 'POST']]);
  assert.equal(logs[1].event, 'shows_rebuild_requested');

  await createRebuild({ hookUrl: 'https://api.netlify.com/build_hooks/secret123', fetchImpl: async () => { throw new TypeError('fetch failed'); }, log: e => logs.push(e) })();
  assert.equal(JSON.stringify(logs).includes('secret123'), false);
});
