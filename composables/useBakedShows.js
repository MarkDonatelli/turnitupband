import { isUpcomingCalendarShow } from '~/utils/calendar-shows.mjs';

// Shows read while the page is rendered (once per build on the static site),
// from server/api/shows.get.ts. Shared by the Shows masthead and the list,
// so both render the same count in the HTML. null when the calendar wasn't
// available: the browser then loads shows itself.
export default async function useBakedShows() {
  // Nuxt state must be created before the first await (Nuxt's context is
  // only guaranteed up to that point inside a composable).
  // One clock for the whole section, serialized so hydration matches the HTML.
  const now = useState('shows-now', () => Date.now());
  // "N upcoming dates": null while loading, -1 on error. Starts from the
  // build's data; the list keeps it current after load.
  const count = useState('shows-count', () => null);
  const request = useAsyncData('shows', () =>
    import.meta.server ? $fetch('/api/shows').catch(() => null) : Promise.resolve(null)
  );

  const { data } = await request;
  if (count.value === null && data.value) {
    count.value = data.value.shows.filter(s => isUpcomingCalendarShow(s, new Date(now.value))).length;
  }
  return { baked: data, now, count };
}
