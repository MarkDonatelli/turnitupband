import { readPublicShows } from './calendar.mjs';
import { readMockShows } from './mock-calendar.mjs';

export function isLocalMock(env = process.env) {
  return env.NETLIFY_DEV === 'true' && env.CALENDAR_MOCK === 'true'
    && !['production', 'deploy-preview', 'branch-deploy'].includes(env.CONTEXT);
}

export async function loadShows({ env = process.env, now = new Date() } = {}) {
  return isLocalMock(env) ? readMockShows(now) : readPublicShows({ env, now });
}
