<script setup>
  // Data comes from the Google Calendar Netlify Function (same logic as main);
  // only the presentation is art-directed for the redesign.
  import { getShowDateString } from '~/utils/shows.mjs';
  import { isUpcomingCalendarShow } from '~/utils/calendar-shows.mjs';
  import useScrollIntoView from '~/composables/useScrollIntoView';

  const { scrollToElement } = useScrollIntoView();

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
      if (import.meta.dev) {
        console.log(`[Google Calendar] ${response.shows.length} show(s) loaded:`, response);
      }
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
    // A minute is plenty to flip "Tonight" and expire finished shows.
    clockTimer = window.setInterval(() => { now.value = Date.now(); }, 60000);
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
  const remaining = computed(() => upcoming.value.length - displayCount.value);
  const loadMore = () => (displayCount.value += PAGE);

  // A confirmed show with no venue website is still public; only a title
  // that says "private" is treated as a booking people can't attend.
  const isPrivate = s => !s.link && /\bprivate\b/i.test(s.venue || '');
  const nextPublic = computed(() => upcoming.value.find(s => !isPrivate(s)));

  // Everything the template needs, computed once per change (not per render).
  const rows = computed(() => upcoming.value.slice(0, displayCount.value).map(s => {
    const d = new Date(s.dateCheckString + 'T12:00:00');
    const priv = isPrivate(s);
    const today = s.dateCheckString === todayString.value;
    return {
      ...s,
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      dow: d.toLocaleDateString('en-US', { weekday: 'short' }),
      longDate: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: s.dateString.split('@')[1]?.trim().toUpperCase() || '',
      priv,
      label: priv ? '' : today ? 'Tonight' : s.id === nextPublic.value?.id ? 'Next up' : ''
    };
  }));

  // Feeds the masthead's "N upcoming dates": null loading, -1 error.
  const count = useState('shows-count', () => null);
  watchEffect(() => {
    count.value = loading.value ? null : loadError.value ? -1 : upcoming.value.length;
  });
</script>

<template>
  <div class="flex flex-col">
    <!-- Skeleton rows mirror the show rows so nothing shifts on load -->
    <div v-if="loading" role="status" aria-live="polite" class="border-t border-ivory/15">
      <span class="sr-only">Loading shows…</span>
      <div
        v-for="n in PAGE"
        :key="n"
        aria-hidden="true"
        class="grid grid-cols-1 items-center gap-3.5 border-b border-ivory/15 py-6 motion-safe:animate-pulse md:grid-cols-[132px_1fr_auto] md:gap-7 md:py-8 xl:grid-cols-[150px_1fr_auto] xl:gap-8"
        :style="{ animationDelay: `${(n - 1) * 120}ms` }"
      >
        <span class="h-[42px] w-[78px] rounded bg-ivory/15 md:h-[56px] md:w-[120px]" />
        <div class="flex min-w-0 flex-col gap-2.5">
          <span class="h-6 rounded bg-ivory/15 md:h-8" :style="{ width: `${[55, 40, 65, 48, 35][n - 1]}%` }" />
          <span class="h-3 w-32 rounded bg-ivory/10 md:w-44" />
        </div>
        <span class="hidden h-3 w-14 rounded bg-ivory/10 md:block" />
      </div>
    </div>

    <div v-else-if="loadError" class="border-t border-ivory/15 py-8" role="status">
      <p class="font-serif text-[24px] leading-snug md:text-[28px]">The schedule is taking a breather.</p>
      <p class="mt-2 text-muted">Shows are temporarily unavailable. Please try again shortly.</p>
      <button
        type="button"
        class="mt-4 inline-flex min-h-[44px] items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
        @click="refreshShows"
      >
        Try again <span class="text-pink" aria-hidden="true">→</span>
      </button>
    </div>

    <div v-else-if="!upcoming.length" class="border-t border-ivory/15 py-8 md:py-10" role="status">
      <p class="font-serif text-[30px] leading-[1.08] md:text-[40px]">New dates coming soon.</p>
      <p class="mt-3 max-w-[46ch] text-muted">
        Follow us on
        <a
          href="https://www.instagram.com/turnitupband/"
          target="_blank"
          rel="noopener"
          class="text-ivory underline decoration-pink underline-offset-4 hover:text-pink"
          >Instagram</a
        >
        for announcements. Planning your own night?
      </p>
      <a
        href="#contact"
        class="mt-5 inline-flex min-h-[44px] items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
        @click.prevent="scrollToElement('#contact')"
      >
        Check your date <span class="text-pink" aria-hidden="true">→</span>
      </a>
    </div>

    <ol v-else class="group/list border-t border-ivory/15">
      <li
        v-for="row in rows"
        :key="row.id"
        class="row relative border-b border-ivory/15 transition-opacity duration-500"
        :class="[row.priv ? 'is-private' : 'is-public', row.label && 'is-next']"
      >
        <component
          :is="row.link ? 'a' : 'div'"
          :href="row.link || undefined"
          :target="row.link ? '_blank' : undefined"
          :rel="row.link ? 'noopener noreferrer' : undefined"
          class="group/row grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-3.5 py-6 md:grid-cols-[132px_1fr_auto] md:gap-x-7 md:gap-y-0 md:py-8 xl:grid-cols-[150px_1fr_auto] xl:gap-x-8"
          :class="row.link && 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-pink'"
        >
          <!-- Date: the big number carries it; month and weekday sit beside -->
          <span class="row-start-1 flex items-start gap-2.5 md:row-start-auto md:gap-3.5">
            <span
              class="date-num font-serif text-[46px] leading-[0.8] tracking-[-0.03em] transition-colors duration-300 md:text-[64px] xl:text-[76px]"
              :class="row.label ? 'text-pink' : row.priv ? 'text-ivory/35' : 'text-ivory'"
              aria-hidden="true"
              >{{ row.day }}</span
            >
            <span class="flex flex-col gap-1 pt-0.5 text-[11px] font-semibold uppercase leading-none tracking-[0.2em] md:pt-1 md:text-[12px]" aria-hidden="true">
              <span :class="row.priv ? 'text-ivory/40' : 'text-ivory'">{{ row.month }}</span>
              <span class="text-muted2">{{ row.dow }}</span>
            </span>
            <span class="sr-only">{{ row.longDate }}</span>
          </span>

          <!-- Venue + where/when -->
          <span class="col-span-2 flex min-w-0 flex-col gap-2 md:col-span-1">
            <span
              v-if="row.label"
              class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-pink md:text-[11px]"
            >
              <span class="h-px w-5 bg-pink" aria-hidden="true" />{{ row.label }}
            </span>
            <span
              class="venue font-serif text-[26px] leading-[1.04] transition-transform duration-500 md:text-[30px] xl:text-[36px]"
              :class="row.priv ? 'italic text-ivory/45' : 'text-ivory'"
              >{{ row.priv ? 'Private event' : row.venue }}</span
            >
            <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted2 md:text-[12px]">
              <template v-if="row.priv">Booked<template v-if="row.time"> · {{ row.time }}</template></template>
              <template v-else>
                {{ row.location || 'Location to be announced' }}<template v-if="row.time"> · {{ row.time }}</template>
              </template>
            </span>
          </span>

          <!-- Direction cue only where there's somewhere to go -->
          <span
            v-if="row.link"
            class="cue col-start-2 row-start-1 flex items-center gap-2 self-start pt-1 text-[11px] md:col-start-auto md:row-start-auto font-semibold uppercase tracking-[0.22em] text-muted2 transition-colors duration-300 md:self-center md:pt-0"
          >
            <span class="hidden md:inline">Venue</span>
            <span class="arrow inline-block text-[18px] leading-none text-pink transition-transform duration-500 md:text-[16px]" aria-hidden="true">↗</span>
            <span class="sr-only">, venue website, opens in a new tab</span>
          </span>
          <span v-else class="hidden md:block" aria-hidden="true" />
        </component>

        <!-- Hover rule: draws in pink along the row's base -->
        <span
          v-if="row.link"
          class="rule pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-pink transition-transform duration-700"
          aria-hidden="true"
        />
      </li>
    </ol>

    <button
      v-if="!loading && remaining > 0"
      type="button"
      class="mt-6 inline-flex min-h-[44px] items-center gap-2.5 self-start text-[12px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
      @click="loadMore"
    >
      {{ Math.min(PAGE, remaining) }} more {{ Math.min(PAGE, remaining) === 1 ? 'date' : 'dates' }}
      <span class="text-pink" aria-hidden="true">↓</span>
    </button>
  </div>
</template>

<style scoped>
  .row {
    --ease: cubic-bezier(0.22, 1, 0.36, 1);
  }
  .venue,
  .arrow,
  .rule {
    transition-timing-function: var(--ease);
  }

  /* Hover and keyboard focus share one treatment, on public rows only. */
  @media (hover: hover) and (pointer: fine) {
    /* Quiet the rest of the list so the hovered show reads first. */
    .group\/list:hover .row:not(:hover) {
      opacity: 0.4;
    }
    .is-public:hover .venue {
      transform: translateX(10px);
    }
    .is-public:hover .cue {
      color: #f3eee6;
    }
    .is-public:hover .arrow {
      transform: translate(3px, -3px);
    }
    .is-public:hover .rule {
      transform: scaleX(1);
    }
    .is-public:not(.is-next):hover .date-num {
      color: #ff2e8a;
    }
  }
  .is-public:focus-within .venue {
    transform: translateX(10px);
  }
  .is-public:focus-within .arrow {
    transform: translate(3px, -3px);
  }
  .is-public:focus-within .rule {
    transform: scaleX(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .venue,
    .arrow,
    .rule,
    .row {
      transition-duration: 0.01ms !important;
    }
    .is-public .venue {
      transform: none !important;
    }
  }
</style>
