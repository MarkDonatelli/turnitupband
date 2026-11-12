import { loadShows } from '../lib/load-shows.mjs';

export function createShowsHandler(readShows = loadShows) {
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
    } catch {
      // Do not return/log upstream response bodies, descriptions, calendar IDs, or credentials.
      return new Response(JSON.stringify({ error: 'Shows are temporarily unavailable. Please try again shortly.' }), {
        status: 503, headers
      });
    }
  };
}

export default createShowsHandler();
