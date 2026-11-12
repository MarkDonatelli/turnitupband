import { Parser } from 'htmlparser2';
import { JWT } from 'google-auth-library';
import { getShowDateString } from '../../utils/shows.mjs';
import { formatCalendarShowDate, isUpcomingCalendarShow } from '../../utils/calendar-shows.mjs';

const HASHTAG = /(?<![\p{L}\p{N}\p{M}_#-])#confirmedshow(?![\p{L}\p{N}\p{M}_#-])/u;
const BLOCK_TAGS = new Set(['br', 'div', 'p', 'li', 'ul', 'ol', 'section']);

function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname && !url.username && !url.password
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
    urls.push(...(textChunk.match(/https:\/\/[^\s<>"']+/gi) || []));
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
  return { confirmed, link: urls.map(httpsUrl).find(Boolean) || '' };
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
  // Explicit allowlist: no description, attendees, organizer, or Google event link.
  const show = {
    id: event.id,
    title: event.summary,
    start,
    end,
    allDay,
    dateCheckString: allDay ? start : getShowDateString(new Date(start)),
    dateString: formatCalendarShowDate(start, end, allDay),
    location: typeof event.location === 'string' ? event.location : '',
    link
  };
  return isUpcomingCalendarShow(show, now) ? show : null;
}

export async function readPublicShows({ env = process.env, now = new Date(), fetchImpl = fetch, accessToken } = {}) {
  const calendarId = env.GOOGLE_CALENDAR_ID;
  if (!calendarId) throw new Error('Calendar configuration missing');
  if (!accessToken) {
    if (!env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      throw new Error('Calendar credentials missing');
    }
    const client = new JWT({
      email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar.events.readonly'],
      transporterOptions: { timeout: 10000, retry: false }
    });
    // Bound token and Calendar requests so failures do not hang the function.
    accessToken = (await client.getAccessToken()).token;
    if (!accessToken) throw new Error('Calendar authentication failed');
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
    const response = await fetchImpl(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` }, signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error('Calendar request failed');
    const data = await response.json();
    if (data.items !== undefined && !Array.isArray(data.items)) throw new Error('Invalid Calendar response');
    for (const event of data.items || []) {
      const show = publicShow(event, now);
      if (show) shows.push(show);
    }
    if (!data.nextPageToken) break;
    if (pages.has(data.nextPageToken)) throw new Error('Invalid Calendar pagination');
    pages.add(data.nextPageToken);
    params.set('pageToken', data.nextPageToken);
  } while (true);
  return shows.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}
