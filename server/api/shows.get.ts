// Upcoming shows for the page render (read once per build on the static site).
// Same source and filtering as the Netlify Function: Google Calendar via
// netlify/lib/load-shows.mjs. Private bookings are already stripped of details.
// Any failure (missing credentials, outage, slow response) returns null so the
// page still renders and the browser loads shows itself.
import { loadShows } from '~~/netlify/lib/load-shows.mjs';
import { safeCalendarDiagnostic } from '~~/netlify/lib/calendar-errors.mjs';

// The build renders more than one page at once (/, 200.html, 404.html). This
// keeps it to one Google Calendar read: callers share the request in flight
// and its result for 5 minutes. Memory only, so nothing carries over between
// builds; failures aren't kept.
const FRESH_MS = 5 * 60 * 1000;
let memo: { shows: unknown[]; fetchedAt: number } | undefined;
let inFlight: Promise<{ shows: unknown[]; fetchedAt: number }> | undefined;
const readShows = () => {
  if (memo && Date.now() - memo.fetchedAt < FRESH_MS) return Promise.resolve(memo);
  return (inFlight ??= loadShows()
    .then((shows: unknown[]) => (memo = { shows, fetchedAt: Date.now() }))
    .finally(() => (inFlight = undefined)));
};

export default defineEventHandler(async () => {
  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000));
    return await Promise.race([readShows(), timeout]);
  } catch (error) {
    console.warn(JSON.stringify({ event: 'calendar_build_failure', ...safeCalendarDiagnostic(error) }));
    return null;
  }
});
