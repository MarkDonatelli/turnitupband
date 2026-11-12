import { getShowDateString } from './shows.mjs';

export function isUpcomingCalendarShow(show, now = new Date()) {
  // Google all-day end dates are exclusive; never parse them as UTC midnights.
  return show.allDay
    ? show.end > getShowDateString(now)
    : Date.parse(show.end) > now.getTime();
}

export function formatCalendarShowDate(start, end, allDay) {
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
  const time = allDay ? '' : `${values.hour}:${values.minute}${values.dayPeriod.toLowerCase()}`;
  const endDate = new Date(allDay ? `${end}T12:00:00Z` : end);
  if (end && Number.isFinite(endDate.getTime()) && endDate > date) {
    let lastDay = allDay ? end : getShowDateString(endDate);
    if (!allDay) {
      const clock = value => new Intl.DateTimeFormat('en-GB', {
        timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).format(value);
      // An end time before the nightly start belongs to the preceding show night.
      if (clock(endDate) <= clock(date)) {
        const previous = new Date(`${lastDay}T12:00:00Z`);
        previous.setUTCDate(previous.getUTCDate() - 1);
        lastDay = previous.toISOString().slice(0, 10);
      }
    } else {
      // All-day events use an exclusive end date.
      endDate.setUTCDate(endDate.getUTCDate() - 1);
      lastDay = endDate.toISOString().slice(0, 10);
    }
    const firstDay = allDay ? start : getShowDateString(date);
    if (lastDay > firstDay) {
      const lastLabel = formatCalendarShowDate(lastDay, null, true);
      return `${label} – ${lastLabel}${allDay ? '' : ` @ ${time} each night`}`;
    }
  }
  return allDay ? label : `${label} @ ${time}`;
}
