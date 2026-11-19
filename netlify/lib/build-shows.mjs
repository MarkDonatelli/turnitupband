// Reading shows while the static site is generated.
//
// Production builds (Netlify CONTEXT=production, which includes the daily
// rebuild triggered by the build hook) must not publish HTML with the show
// schedule missing just because Google Calendar was unreachable. In that case
// the read throws, the page fails to prerender, `nuxt generate` exits with an
// error, and Netlify keeps the last successful deploy live.
//
// Zero upcoming public shows is a successful read, not a failure.
//
// Everywhere else (local dev, deploy previews, branch deploys) a failure
// returns null as before: the page still builds and the browser loads shows.
// SHOWS_ALLOW_EMPTY_BUILD=true turns the production check off for one build,
// to ship an unrelated fix during a calendar outage.
import { CalendarFailure, safeCalendarDiagnostic } from './calendar-errors.mjs';

export function showsRequiredAtBuild(env = process.env) {
  return env.CONTEXT === 'production' && env.SHOWS_ALLOW_EMPTY_BUILD !== 'true';
}

export class ShowsUnavailableAtBuild extends Error {
  constructor() {
    super('SHOWS_UNAVAILABLE_AT_BUILD');
  }
}

// The build renders more than one page at once (/, 200.html, 404.html). The
// reader keeps it to one Google Calendar read: callers share the request in
// flight and its result for 5 minutes. Memory only, so nothing carries over
// between builds; failures aren't kept.
export function createBuildShowsReader({
  load,
  env = process.env,
  timeoutMs = 8000,
  freshMs = 5 * 60 * 1000,
  log = event => console.warn(JSON.stringify(event))
}) {
  let memo;
  let inFlight;

  const readOnce = () => {
    if (memo && Date.now() - memo.fetchedAt < freshMs) return Promise.resolve(memo);
    return (inFlight ??= Promise.resolve()
      .then(load)
      .then(shows => {
        if (!Array.isArray(shows)) throw new CalendarFailure('INVALID_CALENDAR_RESPONSE', 'calendar_response');
        return (memo = { shows, fetchedAt: Date.now() });
      })
      .finally(() => (inFlight = undefined)));
  };

  return async function readBuildShows() {
    let timer;
    try {
      const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new CalendarFailure('REQUEST_TIMEOUT', 'calendar_request')), timeoutMs);
      });
      return await Promise.race([readOnce(), timeout]);
    } catch (error) {
      const required = showsRequiredAtBuild(env);
      // Only known codes and status numbers are logged, never credentials,
      // URLs, response bodies or stacks.
      log({
        event: 'calendar_build_failure',
        ...safeCalendarDiagnostic(error),
        action: required ? 'failing_build_to_keep_last_deploy' : 'continuing_without_baked_shows'
      });
      if (required) throw new ShowsUnavailableAtBuild();
      return null;
    } finally {
      clearTimeout(timer);
    }
  };
}
