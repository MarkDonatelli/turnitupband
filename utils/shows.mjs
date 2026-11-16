export function getShowDateString(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

// Shows remain upcoming for their entire local calendar day.
export function selectShows(shows, today, past = false) {
  return shows
    .filter(show => past ? show.dateCheckString < today : show.dateCheckString >= today)
    .sort((a, b) => past
      ? b.dateCheckString.localeCompare(a.dateCheckString)
      : a.dateCheckString.localeCompare(b.dateCheckString));
}
