import { publicShow } from './calendar.mjs';

// Synthetic fixtures only. The production handler never selects this source.
export function readMockShows(now = new Date()) {
  const start = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const end = new Date(now.getTime() + 27 * 60 * 60 * 1000).toISOString();
  const base = { start: { dateTime: start }, end: { dateTime: end } };
  const events = [
    { ...base, id: 'local-test-show', summary: 'Test Show',
      location: 'Mock Venue, Boston, MA',
      description: 'https://www.pressroomnh.com/\n#confirmedshow\nMock internal note — never public.' },
    { ...base, id: 'local-private', summary: 'Private event', description: 'Private mock notes' },
    // Confirmed private bookings: one by title, one by Google's visibility setting.
    { ...base, id: 'local-private-title', summary: 'Private party - Mock family',
      location: '12 Mock Lane, Bedford, NH', description: '#confirmedshow' },
    { ...base, id: 'local-private-visibility', summary: 'Mock Corp holiday party', visibility: 'private',
      location: 'Mock Hotel, Boston, MA', description: '#confirmedshow https://mock-corp.example/' },
    { ...base, id: 'local-day-off', summary: 'Day off', description: '' },
    { ...base, id: 'local-near-match', summary: 'Unconfirmed mock show', description: '#confirmedshows' }
  ];
  return events.map(event => publicShow(event, now)).filter(Boolean);
}
