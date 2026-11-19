// Daily rebuild so the shows written into the static HTML stay current.
//
// The site is statically generated: upcoming shows are read from Google
// Calendar once per build. Visitors' browsers refresh the list on their own,
// but search engines see the HTML from the last build. One rebuild a day
// drops finished shows and adds new ones for them (one calendar read a day).
//
// Opt-in: does nothing until SHOWS_REBUILD_HOOK_URL (a Netlify build hook URL)
// is set. Scheduled functions only run on the published production deploy.
export function createRebuild({ hookUrl = process.env.SHOWS_REBUILD_HOOK_URL, fetchImpl = fetch, log = e => console.log(JSON.stringify(e)) } = {}) {
  return async () => {
    if (!hookUrl) {
      log({ event: 'shows_rebuild_skipped', reason: 'no_build_hook' });
      return;
    }
    try {
      const res = await fetchImpl(hookUrl, { method: 'POST', signal: AbortSignal.timeout(10000) });
      log({ event: res.ok ? 'shows_rebuild_requested' : 'shows_rebuild_failed', status: res.status });
    } catch (error) {
      // Never log the hook URL: anyone holding it can trigger builds.
      log({ event: 'shows_rebuild_failed', reason: error?.name || 'error' });
    }
  };
}

export default createRebuild();

// 09:00 UTC is 4 or 5am in Boston, after the night's shows have ended.
export const config = { schedule: '0 9 * * *' };
