import { Parser } from 'htmlparser2';
import { JWT } from 'google-auth-library';
import { createPrivateKey } from 'node:crypto';
import { CalendarFailure, googleFailure } from './calendar-errors.mjs';
import { extractCityState } from './show-location.mjs';
import { getShowDateString } from '../../utils/shows.mjs';
import { expandCalendarShow, formatCalendarShowDate, isUpcomingCalendarShow } from '../../utils/calendar-shows.mjs';

const HASHTAG = /(?<![\p{L}\p{N}\p{M}_#-])#confirmedshow(?![\p{L}\p{N}\p{M}_#-])/u;
const BLOCK_TAGS = new Set(['br', 'div', 'p', 'li', 'ul', 'ol', 'section']);

function venueUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && url.hostname && !url.username && !url.password
      ? url.href : '';
  } catch {
    return '';
  }
}

export function parseDescription(description = '') {
  let text = '';
  let hidden = 0;
  let textChunk = '';
  const urls = [];
  const flush = () => {
    urls.push(...(textChunk.match(/https?:\/\/[^\s<>"']+/gi) || []));
    textChunk = '';
  };
  const parser = new Parser({
    onopentag(name, attributes) {
      flush();
      if (name === 'script' || name === 'style') hidden++;
      if (hidden) return;
      if (BLOCK_TAGS.has(name)) text += '\n';
      if (name === 'a' && attributes.href) urls.push(attributes.href);
    },
    ontext(value) {
      if (hidden) return;
      text += value;
      textChunk += value;
    },
    onclosetag(name) {
      flush();
      if (name === 'script' || name === 'style') hidden--;
      if (!hidden && BLOCK_TAGS.has(name)) text += '\n';
    }
  }, { decodeEntities: true });
  parser.end(typeof description === 'string' ? description : '');
  flush();
  // A fragment in a URL is not an opt-in hashtag. Attributes/comments are not text.
  const confirmed = HASHTAG.test(text.replace(/https?:\/\/\S+/gi, ''));
  return { confirmed, link: urls.map(venueUrl).find(Boolean) || '' };
}

function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().startsWith(value);
}

function validDateTime(value) {
  return typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value)
    && Number.isFinite(Date.parse(value));
}

export function publicShow(event, now = new Date()) {
  if (event.status === 'cancelled' || (event.eventType && event.eventType !== 'default')) return null;
  const { confirmed, link } = parseDescription(event.description);
  if (!confirmed || typeof event.id !== 'string' || !event.id || typeof event.summary !== 'string' || !event.summary.trim()) return null;
  const allDay = Boolean(event.start?.date);
  const start = allDay ? event.start.date : event.start?.dateTime;
  const end = allDay ? event.end?.date : event.end?.dateTime;
  const valid = allDay ? validDate : validDateTime;
  if (!valid(start) || !valid(end) || Date.parse(end) <= Date.parse(start)) return null;
  const location = extractCityState(event.location);
  // Explicit allowlist: no description, attendees, organizer, or Google event link.
  const show = {
    id: event.id,
    title: event.summary,
    venue: event.summary,
    start,
    end,
    allDay,
    dateCheckString: allDay ? start : getShowDateString(new Date(start)),
    dateString: formatCalendarShowDate(start, end, allDay),
    location,
    link
  };
  return isUpcomingCalendarShow(show, now) ? show : null;
}

export async function readPublicShows({ env = process.env, now = new Date(), fetchImpl = fetch, accessToken } = {}) {
  const calendarId = env.GOOGLE_CALENDAR_ID;
  const required = ['GOOGLE_CALENDAR_ID', ...(!accessToken ? ['GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY'] : [])];
  const missingVariables = required.filter(name => typeof env[name] !== 'string' || !env[name].trim());
  if (missingVariables.length) throw new CalendarFailure('MISSING_ENVIRONMENT', 'configuration', { missingVariables });
  if (!accessToken) {
    const key = env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    try {
      if (createPrivateKey(key).asymmetricKeyType !== 'rsa') throw new Error();
    } catch {
      throw new CalendarFailure('INVALID_CREDENTIAL_FORMAT', 'credentials', { reason: 'invalid_private_key' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.GOOGLE_CLIENT_EMAIL)) {
      throw new CalendarFailure('INVALID_CREDENTIAL_FORMAT', 'credentials', { reason: 'invalid_service_account_email' });
    }
    try {
      const client = new JWT({
        email: env.GOOGLE_CLIENT_EMAIL,
        key,
        scopes: ['https://www.googleapis.com/auth/calendar.events.readonly'],
        transporterOptions: { timeout: 10000, retry: false }
      });
      // Bound token and Calendar requests so failures do not hang the function.
      accessToken = (await client.getAccessToken()).token;
    } catch (error) {
      throw googleFailure('authentication', { status: error.response?.status, data: error.response?.data, name: error.name, networkCode: error.code || error.cause?.code });
    }
    if (!accessToken) throw new CalendarFailure('AUTHENTICATION_FAILED', 'authentication', { reason: 'missing_access_token' });
  }
  const timeMax = new Date(now);
  timeMax.setUTCFullYear(timeMax.getUTCFullYear() + 1);
  const params = new URLSearchParams({
    singleEvents: 'true', showDeleted: 'false', orderBy: 'startTime',
    timeMin: now.toISOString(), timeMax: timeMax.toISOString(),
    timeZone: 'America/New_York', maxResults: '2500',
    fields: 'nextPageToken,items(id,status,eventType,summary,description,location,start,end)'
  });
  const shows = [];
  const pages = new Set();
  do {
    let response;
    try {
      response = await fetchImpl(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` }, signal: AbortSignal.timeout(10000)
      });
    } catch (error) {
      throw googleFailure('calendar_request', { name: error.name, networkCode: error.code || error.cause?.code });
    }
    if (!response.ok) {
      // Read only known error reason codes; the raw body is never logged/returned.
      const data = await response.json().catch(() => null);
      throw googleFailure('calendar_request', { status: response.status, data });
    }
    let data;
    try { data = await response.json(); } catch {
      throw new CalendarFailure('INVALID_CALENDAR_RESPONSE', 'calendar_response');
    }
    if (!data || typeof data !== 'object' || (data.items !== undefined && !Array.isArray(data.items))) {
      throw new CalendarFailure('INVALID_CALENDAR_RESPONSE', 'calendar_response');
    }
    for (const event of data.items || []) {
      const show = publicShow(event, now);
      if (show) shows.push(...expandCalendarShow(show, now));
    }
    if (!data.nextPageToken) break;
    if (pages.has(data.nextPageToken)) throw new CalendarFailure('INVALID_CALENDAR_RESPONSE', 'calendar_response');
    pages.add(data.nextPageToken);
    params.set('pageToken', data.nextPageToken);
  } while (true);
  return shows.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}
