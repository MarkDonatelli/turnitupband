import assert from 'node:assert/strict';
import { test } from 'node:test';
import { extractCityState } from '../netlify/lib/show-location.mjs';
import { formatCalendarShowDate } from '../utils/calendar-shows.mjs';
import { publicShow, parseDescription } from '../netlify/lib/calendar.mjs';

const now = new Date('2026-11-12T15:00:00Z');
const event = overrides => ({
  id: 'display-test', summary: "Bill's Bar & Lounge",
  start: { dateTime: '2026-11-18T23:00:00Z' },
  end: { dateTime: '2026-11-19T02:30:00Z' },
  location: "Bill's Bar & Lounge, 5 Lansdowne St, Boston, MA 02215, USA",
  description: 'https://www.lansdownepubboston.com/\n#confirmedshow',
  ...overrides
});

test('confirmed event maps to the exact original card labels and venue URL', () => {
  const show = publicShow(event(), now);
  assert.equal(show.title, "Bill's Bar & Lounge");
  assert.equal(show.dateString, 'Wed, Nov 18 2026 @ 6:00pm');
  assert.equal(show.venue, "Bill's Bar & Lounge");
  assert.equal(show.location, 'Boston, MA');
  assert.equal(show.link, 'https://www.lansdownepubboston.com/');
});

test('venue always comes from the unchanged event title, regardless of the address', () => {
  for (const location of ['Another Venue, 5 Lansdowne St, Boston, MA 02215', 'Boston, MA', undefined]) {
    const title = "  Bill's Bar & Lounge!  ";
    const show = publicShow(event({ summary: title, location }), now);
    assert.equal(show.venue, title);
    assert.equal(show.title, title);
  }
});

test('city/state supports comma-separated, multiline, combined and full state names', () => {
  for (const address of [
    "Bill's Bar & Lounge, 5 Lansdowne St, Boston, MA 02215, USA",
    "Bill's Bar & Lounge\n5 Lansdowne St\nBoston, MA 02215\nUnited States",
    '5 Lansdowne St, Boston MA 02215',
    '5 Lansdowne St, Boston, Massachusetts 02215-1234, US',
    'Boston, MA', 'Boston MA 02215', 'Boston, MA, 02215, USA',
    'Boston, ma 02215, United States of America'
  ]) assert.equal(extractCityState(address), 'Boston, MA', address);
  assert.equal(extractCityState('The Press Room, 77 Daniel St, Portsmouth, NH 03801, United States'), 'Portsmouth, NH');
  assert.equal(extractCityState('Music Hall, 10 Main St, New York, New York 10001, USA'), 'New York, NY');
  assert.equal(extractCityState('3S Artspace, 319 Vaughan St, Portsmouth, NH 03801'), 'Portsmouth, NH');
  assert.equal(extractCityState('Beach Bar, 1 Main St, Block Island, Rhode Island 02807, U.S.A.'), 'Block Island, RI');
});

test('missing and ambiguous locations do not invent city/state or expose street addresses', () => {
  for (const address of [undefined, null, '', '   ', 123, 'Somewhere', 'Boston', 'MA', 'USA', '5 Lansdowne St', '5 Lansdowne St, MA 02215, USA', "Bill's Bar & Lounge", 'Toronto, ON, Canada', 'Boston, ZZ 02215']) {
    assert.equal(extractCityState(address), '', String(address));
  }
});

test('dates match original formatting in Boston time, including UTC and DST boundaries', () => {
  assert.equal(formatCalendarShowDate('2026-11-18T18:00:00-05:00', '2026-11-19T00:00:00-05:00', false), 'Wed, Nov 18 2026 @ 6:00pm');
  assert.equal(formatCalendarShowDate('2026-11-19T02:45:00Z', '2026-11-19T06:00:00Z', false), 'Wed, Nov 18 2026 @ 9:45pm');
  assert.equal(formatCalendarShowDate('2027-07-23T02:30:00Z', '2027-07-23T06:00:00Z', false), 'Thu, Jul 22 2027 @ 10:30pm');
  assert.equal(formatCalendarShowDate('2026-11-18T05:00:00Z', null, false), 'Wed, Nov 18 2026 @ 12:00am');
  assert.equal(formatCalendarShowDate('2026-11-18T17:00:00Z', null, false), 'Wed, Nov 18 2026 @ 12:00pm');
  assert.equal(formatCalendarShowDate('2026-11-18', '2026-11-20', true), 'Wed, Nov 18 2026 – Thu, Nov 19 2026');
  assert.equal(formatCalendarShowDate(undefined, null, false), '');
  assert.equal(formatCalendarShowDate('invalid', null, false), '');
});

test('missing location and URL preserve the existing placeholder and disabled-button data', () => {
  const show = publicShow(event({ location: undefined, description: '#confirmedshow' }), now);
  assert.equal(show.venue, "Bill's Bar & Lounge");
  assert.equal(show.location, '');
  assert.equal(show.link, '');
});

test('incomplete events are excluded rather than rendered as broken cards', () => {
  for (const overrides of [{ summary: '' }, { summary: undefined }, { start: undefined }, { end: undefined }]) {
    assert.equal(publicShow(event(overrides), now), null);
  }
});

test('first safe HTTP/HTTPS link is extracted without the publication marker', () => {
  assert.equal(parseDescription('http://venue.example/\n#confirmedshow').link, 'http://venue.example/');
  assert.equal(parseDescription('HTTP://venue.example/\nhttps://second.example/\n#confirmedshow').link, 'http://venue.example/');
  assert.equal(parseDescription('<a href="http://venue.example/?a=1&amp;b=2">Website</a><br>#confirmedshow').link, 'http://venue.example/?a=1&b=2');
  for (const description of ['#confirmedshow', 'javascript:alert(1)\n#confirmedshow', 'data:text/html,private\n#confirmedshow', '//venue.example/\n#confirmedshow', 'https://\nhttp://\n#confirmedshow', 'https://user:pass@venue.example/\n#confirmedshow']) {
    assert.equal(parseDescription(description).link, '', description);
  }
});


test('weekend bookings show each performance night, including overnight endings', () => {
  for (const end of ['2026-11-22T23:00:00-05:00', '2026-11-23T01:00:00-05:00']) {
    assert.equal(formatCalendarShowDate('2026-11-20T21:00:00-05:00', end, false),
      'Fri, Nov 20 2026 – Sun, Nov 22 2026 @ 9:00pm each night');
  }
  assert.equal(formatCalendarShowDate('2026-11-20T21:00:00-05:00', '2026-11-22T01:00:00-05:00', false),
    'Fri, Nov 20 2026 – Sat, Nov 21 2026 @ 9:00pm each night');
  assert.equal(formatCalendarShowDate('2026-12-31T21:00:00-05:00', '2027-01-02T01:00:00-05:00', false),
    'Thu, Dec 31 2026 – Fri, Jan 1 2027 @ 9:00pm each night');
  assert.equal(formatCalendarShowDate('2026-11-20', '2026-11-21', true), 'Fri, Nov 20 2026');
});
