// Upcoming shows for the page render (read once per build on the static site).
// Same source and filtering as the Netlify Function: Google Calendar via
// netlify/lib/load-shows.mjs. Private bookings are already stripped of details.
//
// Outside production a failure returns null, so the page still renders and the
// browser loads shows itself. In production builds it responds 503, which
// fails the build and keeps the last good deploy (netlify/lib/build-shows.mjs).
import { loadShows } from '~~/netlify/lib/load-shows.mjs';
import { createBuildShowsReader } from '~~/netlify/lib/build-shows.mjs';

const readBuildShows = createBuildShowsReader({ load: () => loadShows() });

export default defineEventHandler(async () => {
  try {
    return await readBuildShows();
  } catch {
    // No details: the reason is already logged as calendar_build_failure.
    throw createError({ statusCode: 503, statusMessage: 'Calendar unavailable' });
  }
});
