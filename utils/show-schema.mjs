// Public/private rules and schema.org Event data for confirmed shows.
// Used by the Shows section (components/ShowsList.vue); pure functions only.

// The server marks private bookings (`private: true`) and strips their
// details. The title rule is kept as a backstop for older cached responses.
export function isPrivateShow(show) {
  return show?.private === true || (!show?.link && /\bprivate\b/i.test(show?.venue || ''));
}

// "Portsmouth, NH" → { city, state }. Only the exact format the calendar
// integration produces; anything else means there's no verified location.
function parseLocation(location) {
  const m = /^(.+), ([A-Z]{2})$/.exec(typeof location === 'string' ? location.trim() : '');
  return m ? { city: m[1], state: m[2] } : null;
}

const validInstant = v => typeof v === 'string' && Number.isFinite(Date.parse(v));

// One MusicEvent per eligible show: public, with a venue name, a city and
// state from the calendar, and valid times. Nothing is guessed: no street
// address, ticket price or image is added because the calendar doesn't hold them.
export function showEvents(shows = [], { bandId, bandName = 'Turn It Up!' } = {}) {
  return shows.flatMap(show => {
    if (isPrivateShow(show)) return [];
    const venue = typeof show.venue === 'string' ? show.venue.trim() : '';
    const place = parseLocation(show.location);
    if (!venue || !place || !validInstant(show.start) || !validInstant(show.end)) return [];
    return [{
      '@context': 'https://schema.org',
      '@type': 'MusicEvent',
      name: `${bandName} at ${venue}`,
      startDate: show.start,
      endDate: show.end,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: venue,
        address: { '@type': 'PostalAddress', addressLocality: place.city, addressRegion: place.state, addressCountry: 'US' }
      },
      performer: { '@type': 'MusicGroup', name: bandName, ...(bandId && { '@id': bandId }) },
      ...(show.link && { url: show.link })
    }];
  });
}
