import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseDescription, publicShow, readPublicShows } from '../netlify/lib/calendar.mjs';
import { createShowsHandler } from '../netlify/functions/shows.mjs';
import { expandCalendarShow, isUpcomingCalendarShow } from '../utils/calendar-shows.mjs';

const now = new Date('2026-11-12T15:00:00Z');
const event = (overrides = {}) => ({
  id: 'test-show', summary: 'Test Show', status: 'confirmed',
  start: { dateTime: '2026-11-13T21:45:00-05:00' },
  end: { dateTime: '2026-11-14T01:00:00-05:00' },
  location: 'Test Venue, Boston, MA',
  description: 'https://venue.example/\n#confirmedshow\nInternal production notes',
  attendees: [{ email: 'private@example.com' }],
  organizer: { email: 'private@example.com' },
  ...overrides
});

test('only exact standalone description hashtag opts in', () => {
  for (const description of ['#confirmedshow', 'Notes: (#confirmedshow).', 'https://venue.example/\n#confirmedshow', '<p><b>#confirmedshow</b></p>']) {
    assert.equal(parseDescription(description).confirmed, true, description);
  }
  for (const description of ['', '#ConfirmedShow', '#confirmedshows', '#confirmedshow123', '#confirmedshow_extra', '#confirmedshow-extra', 'prefix#confirmedshow', 'é#confirmedshow', '#confirmedshowé', '##confirmedshow', '#confirmedshow\u0301', 'https://venue.example/#confirmedshow', '<a href="https://venue.example/#confirmedshow">Venue</a>', '<!-- #confirmedshow -->', '<div title="#confirmedshow">Days off</div>']) {
    assert.equal(parseDescription(description).confirmed, false, description);
  }
  assert.equal(publicShow(event({ summary: '[SHOW] Test', description: 'No publication marker' }), now), null);
  assert.equal(publicShow(event({ summary: '#confirmedshow', description: '' }), now), null);
});

test('first valid HTTP or HTTPS URL wins in plain text and Google rich text', () => {
  assert.equal(parseDescription('https://\nhttps://venue.example/\nhttps://second.example').link, 'https://venue.example/');
  assert.equal(parseDescription('<a href="https://venue.example/?a=1&amp;b=2">Venue site</a><br>#confirmedshow').link, 'https://venue.example/?a=1&b=2');
  assert.equal(parseDescription('https://venue.example/?a=1&amp;b=2<br>#confirmedshow').link, 'https://venue.example/?a=1&b=2');
  assert.equal(parseDescription('https://first.example/<br><a href="https://second.example/">site</a>').link, 'https://first.example/');
  assert.equal(parseDescription('javascript:alert(1)\ndata:text/html,private\n#confirmedshow').link, '');
  assert.equal(parseDescription('https://user:password@venue.example\nhttps://safe.example').link, 'https://safe.example/');
  assert.equal(parseDescription('HTTPS://venue.example/\n#confirmedshow').link, 'https://venue.example/');
});

test('public projection preserves titles and only returns approved fields', () => {
  const title = '  [SHOW] Test Show & Friends!  ';
  const show = publicShow(event({ summary: title }), now);
  assert.equal(show.title, title);
  assert.equal(show.venue, title);
  assert.equal(show.location, 'Boston, MA');
  assert.equal(show.start, '2026-11-13T21:45:00-05:00');
  assert.equal(show.end, '2026-11-14T01:00:00-05:00');
  assert.equal(show.dateString, 'Fri, Nov 13 2026 @ 9:45pm');
  assert.deepEqual(Object.keys(show).sort(), ['id', 'title', 'venue', 'start', 'end', 'allDay', 'dateCheckString', 'dateString', 'location', 'link', 'private'].sort());
  assert.equal(JSON.stringify(show).includes('Internal production notes'), false);
  assert.equal(JSON.stringify(show).includes('private@example.com'), false);
  assert.equal(JSON.stringify(show).includes('#confirmedshow'), false);
});

test('private events, rehearsals and days off without the marker are excluded', () => {
  for (const summary of ['Private Party', 'Rehearsal', 'Day off']) {
    assert.equal(publicShow(event({ summary, description: 'https://venue.example/' }), now), null);
  }
  assert.equal(publicShow(event({ status: 'cancelled' }), now), null);
  assert.equal(publicShow(event({ eventType: 'outOfOffice' }), now), null);
  assert.equal(publicShow(event({ summary: '' }), now), null);
  assert.equal(publicShow(event({ start: { dateTime: 'invalid' } }), now), null);
  assert.equal(publicShow(event(), new Date('2026-11-14T06:00:00Z')), null);
  assert.ok(publicShow(event(), new Date('2026-11-14T05:59:59Z')));
});

test('all-day ranges use exclusive Google end dates and Boston date boundaries', () => {
  const show = publicShow(event({
    start: { date: '2027-07-22' }, end: { date: '2027-07-25' }
  }), now);
  assert.equal(show.allDay, true);
  assert.equal(show.dateString, 'Thu, Jul 22 2027');
  assert.equal(isUpcomingCalendarShow(show, new Date('2027-07-25T03:59:59Z')), true);
  assert.equal(isUpcomingCalendarShow(show, new Date('2027-07-25T04:00:00Z')), false);
  assert.equal(publicShow(event({ start: { date: '2027-02-30' }, end: { date: '2027-03-03' } }), now), null);
});

test('every API page is filtered, recurrences expanded and no free-text search substitutes for filtering', async () => {
  const requests = [];
  const shows = await readPublicShows({
    env: { GOOGLE_CALENDAR_ID: 'private/calendar@example.com' }, now, accessToken: 'fake-token',
    fetchImpl: async (url, options) => {
      requests.push(new URL(url));
      assert.equal(options.headers.Authorization, 'Bearer fake-token');
      const page = requests.length === 1
        ? { items: [event({ id: 'unpublished', description: 'Private notes' })], nextPageToken: 'second' }
        : { items: [event(), event({ id: 'cancelled', status: 'cancelled' })] };
      return Response.json(page);
    }
  });
  assert.equal(shows.length, 1);
  assert.equal(shows[0].title, 'Test Show');
  assert.equal(requests.length, 2);
  assert.equal(requests[0].searchParams.get('singleEvents'), 'true');
  assert.equal(requests[0].searchParams.has('q'), false);
  assert.equal(requests[1].searchParams.get('pageToken'), 'second');
  assert.equal(requests[0].searchParams.get('timeMin'), now.toISOString());
});

test('function responses contain public shows only and failures leak no upstream data', async () => {
  const handler = createShowsHandler(() => readPublicShows({
    env: { GOOGLE_CALENDAR_ID: 'private' }, now, accessToken: 'fake',
    fetchImpl: async () => Response.json({ items: [event(), event({ id: 'private', description: 'Private notes' })] })
  }));
  const response = await handler(new Request('https://site.example/.netlify/functions/shows'));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.shows.length, 1);
  assert.equal(body.shows[0].title, 'Test Show');
  assert.equal(JSON.stringify(body).includes('description'), false);
  assert.equal(response.headers.get('Netlify-CDN-Cache-Control'), 'public, s-maxage=300');
  const failing = createShowsHandler(() => { throw new Error('secret-key private notes'); });
  const failure = await failing(new Request('https://site.example/'));
  assert.equal(failure.status, 503);
  assert.equal(failure.headers.get('Cache-Control'), 'no-store');
  assert.equal((await failure.text()).includes('secret'), false);
  assert.equal((await handler(new Request('https://site.example/', { method: 'POST' }))).status, 405);
});

test('missing credentials, upstream errors and looping pagination fail closed', async () => {
  await assert.rejects(readPublicShows({ env: {}, now }));
  await assert.rejects(readPublicShows({ env: { GOOGLE_CALENDAR_ID: 'private' }, now }));
  await assert.rejects(readPublicShows({ env: { GOOGLE_CALENDAR_ID: 'private' }, now, accessToken: 'fake', fetchImpl: async () => new Response('secret', { status: 403 }) }));
  await assert.rejects(readPublicShows({ env: { GOOGLE_CALENDAR_ID: 'private' }, now, accessToken: 'fake', fetchImpl: async () => Response.json({ items: [], nextPageToken: 'repeat' }) }));
});

test('one Thursday–Saturday calendar booking becomes three independently expiring rows', async () => {
  const booking = event({ start: { dateTime: '2026-11-19T21:00:00-05:00' }, end: { dateTime: '2026-11-22T01:00:00-05:00' } });
  const read = at => readPublicShows({
    env: { GOOGLE_CALENDAR_ID: 'private' }, now: new Date(at), accessToken: 'fake',
    fetchImpl: async () => Response.json({ items: [booking] })
  });
  const rows = await read('2026-11-18T15:00:00Z');
  assert.deepEqual(rows.map(row => row.dateString), [
    'Thu, Nov 19 2026 @ 9:00pm', 'Fri, Nov 20 2026 @ 9:00pm', 'Sat, Nov 21 2026 @ 9:00pm'
  ]);
  assert.equal(new Set(rows.map(row => row.id)).size, 3);
  for (const row of rows) {
    assert.equal(row.venue, booking.summary);
    assert.equal(row.link, 'https://venue.example/');
    assert.equal(Date.parse(row.end) - Date.parse(row.start), 4 * 3600000);
  }
  const remaining = await read('2026-11-20T06:00:00Z');
  assert.deepEqual(remaining.map(row => row.id), rows.slice(1).map(row => row.id));
  assert.deepEqual(await read('2026-11-22T06:00:00Z'), []);
});


test('expanded bookings preserve Boston nightly times through DST and year boundaries', () => {
  const show = publicShow(event({
    start: { dateTime: '2026-10-30T21:00:00-04:00' },
    end: { dateTime: '2026-11-02T02:00:00-05:00' }
  }), new Date('2026-10-29T00:00:00Z'));
  const rows = expandCalendarShow(show, new Date('2026-10-29T00:00:00Z'));
  assert.equal(rows.length, 3);
  assert.ok(rows.every(row => row.dateString.endsWith('@ 9:00pm')));
  assert.equal(rows[2].start, '2026-11-02T02:00:00.000Z');
  assert.equal(rows[2].end, '2026-11-02T07:00:00.000Z');
  const allDay = publicShow(event({ start: { date: '2026-12-31' }, end: { date: '2027-01-03' } }), now);
  assert.deepEqual(expandCalendarShow(allDay, now).map(row => row.dateCheckString),
    ['2026-12-31', '2027-01-01', '2027-01-02']);
  assert.equal(expandCalendarShow(publicShow(event(), now), now).length, 1);
});


test('calendar request includes November and December of the following year', async () => {
  const lateShows = ['2027-11-26', '2027-12-18'].map((day, index) => event({
    id: `late-show-${index}`,
    start: { dateTime: `${day}T20:00:00-05:00` },
    end: { dateTime: `${day}T23:00:00-05:00` }
  }));
  const rows = await readPublicShows({
    env: { GOOGLE_CALENDAR_ID: 'private' }, now, accessToken: 'fake',
    fetchImpl: async url => {
      const params = new URL(url).searchParams;
      assert.equal(params.get('timeMax'), '2028-11-12T15:00:00.000Z');
      return Response.json({ items: lateShows.filter(show =>
        Date.parse(show.start.dateTime) < Date.parse(params.get('timeMax'))) });
    }
  });
  assert.deepEqual(rows.map(row => row.dateCheckString), ['2027-11-26', '2027-12-18']);
});
