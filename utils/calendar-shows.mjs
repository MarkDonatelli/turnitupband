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


function shiftDay(day, amount) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function localClock(value) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date(value));
  const fields = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${fields.hour}:${fields.minute}:${fields.second}`;
}

// Resolve each local performance time independently to preserve it across DST.
function localInstant(day, clock) {
  const target = Date.parse(`${day}T${clock}Z`);
  let instant = target;
  for (let attempt = 0; attempt < 4; attempt++) {
    const local = Date.parse(`${getShowDateString(new Date(instant))}T${localClock(instant)}Z`);
    const correction = target - local;
    if (!correction) break;
    instant += correction;
  }
  return new Date(instant).toISOString();
}

export function expandCalendarShow(show, now = new Date()) {
  const firstDay = show.allDay ? show.start : getShowDateString(new Date(show.start));
  const endDay = show.allDay ? show.end : getShowDateString(new Date(show.end));
  const startClock = show.allDay ? '' : localClock(show.start);
  const endClock = show.allDay ? '' : localClock(show.end);
  const overnight = !show.allDay && endClock <= startClock;
  const lastDay = show.allDay || overnight ? shiftDay(endDay, -1) : endDay;
  if (lastDay <= firstDay) return isUpcomingCalendarShow(show, now) ? [show] : [];
  const rows = [];
  for (let day = firstDay; day <= lastDay; day = shiftDay(day, 1)) {
    const start = show.allDay ? day : localInstant(day, startClock);
    const end = show.allDay ? shiftDay(day, 1) : localInstant(overnight ? shiftDay(day, 1) : day, endClock);
    const row = {
      ...show, id: `${show.id}:${day}`, start, end, dateCheckString: day,
      dateString: formatCalendarShowDate(start, end, show.allDay)
    };
    if (isUpcomingCalendarShow(row, now)) rows.push(row);
  }
  return rows;
}
