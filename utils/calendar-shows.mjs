import { getShowDateString } from './shows.mjs';

export function isUpcomingCalendarShow(show, now = new Date()) {
  // Google all-day end dates are exclusive; never parse them as UTC midnights.
  return show.allDay
    ? show.end > getShowDateString(now)
    : Date.parse(show.end) > now.getTime();
}

export function formatCalendarShowDate(start, end, allDay) {
  const date = value => new Intl.DateTimeFormat('en-US', {
    timeZone: allDay ? 'UTC' : 'America/New_York',
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(allDay ? `${value}T12:00:00Z` : value));
  if (allDay) {
    const lastDay = new Date(`${end}T12:00:00Z`);
    lastDay.setUTCDate(lastDay.getUTCDate() - 1);
    const last = lastDay.toISOString().slice(0, 10);
    return start === last ? date(start) : `${date(start)} – ${date(last)}`;
  }
  const time = value => new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit'
  }).format(new Date(value));
  return getShowDateString(new Date(start)) === getShowDateString(new Date(end))
    ? `${date(start)} @ ${time(start)} – ${time(end)}`
    : `${date(start)} @ ${time(start)} – ${date(end)} @ ${time(end)}`;
}
