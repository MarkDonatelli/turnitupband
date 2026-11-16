<script setup>
  // Data comes from the Google Calendar Netlify Function (same logic as main);
  // only the template is restyled for the redesign.
  import { getShowDateString } from '~/utils/shows.mjs';
  import { isUpcomingCalendarShow } from '~/utils/calendar-shows.mjs';

  const shows = ref([]);
  const loading = ref(true);
  const loadError = ref(false);
  // Serialize the initial clock to avoid server/client hydration differences.
  const now = useState('shows-now', () => Date.now());
  const todayString = computed(() => getShowDateString(new Date(now.value)));
  let clockTimer;
  let refreshTimer;
  let controller;

  const refreshShows = async () => {
    controller?.abort();
    const request = new AbortController();
    controller = request;
    try {
      const response = await $fetch('/.netlify/functions/shows', {
        signal: request.signal, timeout: 30000, retry: 0
      });
      if (!Array.isArray(response.shows)) throw new Error('Invalid shows response');
      console.log(`[Google Calendar] ${response.shows.length} show(s) loaded:`, response);
      console.table(response.shows.map(({ dateString, venue, location, link }) => ({ dateString, venue, location, link })));
      shows.value = response.shows;
      loadError.value = false;
    } catch (error) {
      if (request.signal.aborted) return;
      // 503 = the Netlify function failed; its terminal log has the reason code.
      console.warn('[Google Calendar] Shows failed to load:', error?.statusCode ?? '', error?.data?.error ?? error?.message);
      shows.value = [];
      loadError.value = true;
    } finally {
      if (!request.signal.aborted) loading.value = false;
    }
  };
  const refreshOnFocus = () => {
    now.value = Date.now();
    refreshShows();
  };
  onMounted(() => {
    refreshOnFocus();
    clockTimer = window.setInterval(() => { now.value = Date.now(); }, 1000);
    refreshTimer = window.setInterval(refreshShows, 300000);
    window.addEventListener('focus', refreshOnFocus);
  });
  onUnmounted(() => {
    controller?.abort();
    window.clearInterval(clockTimer);
    window.clearInterval(refreshTimer);
    window.removeEventListener('focus', refreshOnFocus);
  });

  const upcoming = computed(() => shows.value
    .filter(show => isUpcomingCalendarShow(show, new Date(now.value)))
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start)));

  const PAGE = 5;
  const displayCount = ref(PAGE);
  const visibleShows = computed(() => upcoming.value.slice(0, displayCount.value));
  const loadMore = () => (displayCount.value += PAGE);

  const isToday = (s) => s.dateCheckString === todayString.value;
  const isNext = (s) => s.id === upcoming.value[0]?.id;

  const parse = (s) => {
    const d = new Date(s.dateCheckString + 'T12:00:00');
    const time = s.dateString.split('@')[1]?.trim().toUpperCase() || '';
    return {
      dow: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time
    };
  };
</script>

<template>
  <div class="flex flex-col">
    <!-- Skeleton rows mirror the show row layout so nothing shifts on load -->
    <div v-if="loading" role="status" aria-live="polite">
      <span class="sr-only">Loading shows…</span>
      <div
        v-for="n in PAGE"
        :key="n"
        aria-hidden="true"
        class="grid grid-cols-[84px_1fr] md:grid-cols-[120px_1fr_auto] gap-[18px] md:gap-8 items-center py-[18px] md:py-[26px] border-b border-ivory/15 motion-safe:animate-pulse"
        :style="{ animationDelay: `${(n - 1) * 120}ms` }"
      >
        <div class="flex flex-col gap-2">
          <span class="hidden md:block h-3 w-10 rounded bg-ivory/10"></span>
          <span class="h-[30px] md:h-[40px] w-[72px] md:w-[100px] rounded bg-ivory/15"></span>
        </div>
        <div class="flex flex-col gap-2 min-w-0">
          <span class="h-5 md:h-6 rounded bg-ivory/15" :style="{ width: `${[55, 40, 65, 48, 35][n - 1]}%` }"></span>
          <span class="h-3.5 w-32 md:w-44 rounded bg-ivory/10"></span>
        </div>
        <span class="hidden md:block h-[38px] w-[84px] rounded-full border border-ivory/10"></span>
      </div>
    </div>
    <div v-else-if="loadError" class="py-6 text-muted" role="status">
      <p>Shows are temporarily unavailable. Please try again shortly.</p>
      <button
        type="button"
        class="mt-3 text-sm font-semibold text-pink"
        @click="refreshShows"
      >
        Try again →
      </button>
    </div>
    <p v-else-if="!upcoming.length" class="py-6 text-muted" role="status">
      New dates coming soon. Follow us on Instagram for announcements.
    </p>

    <component
      :is="show.link ? 'a' : 'div'"
      v-for="show in visibleShows"
      :key="show.id"
      :href="show.link || undefined"
      :target="show.link ? '_blank' : undefined"
      :rel="show.link ? 'noopener noreferrer' : undefined"
      class="grid grid-cols-[84px_1fr] md:grid-cols-[120px_1fr_auto] gap-[18px] md:gap-8 items-center py-[18px] md:py-[26px] border-b border-ivory/15 transition-all"
      :class="show.link ? 'md:hover:pl-3.5 hover:text-pink' : ''"
    >
      <div class="flex flex-col gap-0.5">
        <span class="hidden md:block text-xs uppercase tracking-[0.18em] text-muted2">{{
          parse(show).dow
        }}</span>
        <span class="font-serif text-[30px] md:text-[40px] leading-none">{{
          parse(show).date
        }}</span>
      </div>
      <div class="flex flex-col gap-1 min-w-0">
        <span class="flex items-center gap-2.5 text-base font-bold md:text-xl md:font-semibold">
          {{ show.venue }}
          <span
            v-if="isToday(show) || isNext(show)"
            class="px-2 py-0.5 rounded-full bg-pink text-ink text-[10px] font-extrabold uppercase tracking-wide"
            >{{ isToday(show) ? 'Tonight' : 'Next' }}</span
          >
        </span>
        <span class="text-[13px] md:text-sm text-muted2"
          >{{ show.location || 'Location to be announced'
          }}<template v-if="parse(show).time"> · {{ parse(show).time }}</template></span
        >
      </div>
      <span
        class="hidden md:inline-flex px-[18px] py-2.5 text-[13px] font-semibold border rounded-full"
        :class="show.link ? 'border-ivory/25' : 'border-ivory/10 text-ivory/40'"
        >{{ show.link ? 'Venue information' : 'Private' }}</span
      >
    </component>

    <button
      v-if="displayCount < upcoming.length"
      @click="loadMore"
      class="self-start mt-6 text-sm font-semibold text-pink"
    >
      More dates →
    </button>
  </div>
</template>
