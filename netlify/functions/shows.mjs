import { loadShows } from '../lib/load-shows.mjs';
import { randomUUID } from 'node:crypto';
import { safeCalendarDiagnostic } from '../lib/calendar-errors.mjs';

export function createShowsHandler(readShows = loadShows, logFailure = entry => console.error(JSON.stringify(entry))) {
  return async request => {
    const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405, headers: { ...headers, Allow: 'GET' }
      });
    }
    try {
      const shows = await readShows();
      return new Response(JSON.stringify({ shows }), {
        headers: { ...headers, 'Cache-Control': 'public, max-age=0, must-revalidate', 'Netlify-CDN-Cache-Control': 'public, s-maxage=300' }
      });
    } catch (error) {
      const requestId = randomUUID();
      try {
        logFailure({ event: 'calendar_shows_failure', requestId, ...safeCalendarDiagnostic(error) });
      } catch { /* Diagnostics must never prevent the safe error response. */ }
      return new Response(JSON.stringify({ error: 'Shows are temporarily unavailable. Please try again shortly.' }), {
        status: 503, headers: { ...headers, 'X-Calendar-Request-ID': requestId }
      });
    }
  };
}

export default createShowsHandler();
