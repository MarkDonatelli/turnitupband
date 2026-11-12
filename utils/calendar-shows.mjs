import { getShowDateString } from './shows.mjs';

export function isUpcomingCalendarShow(show, now = new Date()) {
  // Google all-day end dates are exclusive; never parse them as UTC midnights.
  return show.allDay
    ? show.end > getShowDateString(now)
    : Date.parse(show.end) > now.getTime();
}

export function formatCalendarShowDate(start, _end, allDay) {
  // Noon UTC preserves a date-only booking's day when formatted in Boston time.
  const date = new Date(allDay ? `${start}T12:00:00Z` : start);
  if (!start || !Number.isFinite(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', weekday: 'short', month: 'short',
    day: 'numeric', year: 'numeric',
    ...(!allDay && { hour: 'numeric', minute: '2-digit', hour12: true })
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const label = `${values.weekday}, ${values.month} ${values.day} ${values.year}`;
  return allDay ? label : `${label} @ ${values.hour}:${values.minute}${values.dayPeriod.toLowerCase()}`;
}
