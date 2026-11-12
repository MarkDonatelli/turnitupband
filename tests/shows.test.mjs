import assert from 'node:assert/strict';
import { test } from 'node:test';
import { shows } from '../data/shows.mjs';
import { getShowDateString, selectShows } from '../utils/shows.mjs';

test('show dates and venues are unique', () => {
  assert.equal(new Set(shows.map(show => `${show.dateCheckString}:${show.venue}`)).size, shows.length);
});

test('shows move into the archive only after their date, in reverse order', () => {
  const sample = ['2026-11-12', '2026-11-13', '2026-11-14'].map(dateCheckString => ({ dateCheckString }));
  assert.deepEqual(selectShows(sample, '2026-11-13').map(show => show.dateCheckString), ['2026-11-13', '2026-11-14']);
  assert.deepEqual(selectShows(sample, '2026-11-14', true).map(show => show.dateCheckString), ['2026-11-13', '2026-11-12']);
  assert.equal(sample[0].dateCheckString, '2026-11-12');
  assert.deepEqual(selectShows(sample, '2030-01-01'), []);
});

test('date boundaries follow Boston time in winter and summer', () => {
  assert.equal(getShowDateString(new Date('2026-11-14T04:59:59Z')), '2026-11-13');
  assert.equal(getShowDateString(new Date('2026-11-14T05:00:00Z')), '2026-11-14');
  assert.equal(getShowDateString(new Date('2027-07-02T03:59:59Z')), '2027-07-01');
  assert.equal(getShowDateString(new Date('2027-07-02T04:00:00Z')), '2027-07-02');
});
