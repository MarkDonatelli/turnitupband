<script setup>
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
      console.log('[Google Calendar] Public shows response:', response);
      shows.value = response.shows;
      loadError.value = false;
    } catch {
      if (request.signal.aborted) return;
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
  const showsSorted = computed(() => shows.value
    .filter(show => isUpcomingCalendarShow(show, new Date(now.value)))
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start)));
  const nextShowId = computed(() => showsSorted.value[0]?.id);
  const PAGE = 15;
  const displayCount = ref(PAGE);
  const visibleShows = computed(() => showsSorted.value.slice(0, displayCount.value));
  const loadMore = () => { displayCount.value += PAGE; };
  const getVenueLink = (show) => show.link;
  const isToday = (show) => show.dateCheckString === todayString.value;
  const isNextShow = (show) => show.id === nextShowId.value;
</script>

<template>
  <section class="py-16 bg-black md:py-24 overflow-x-clip">
    <div class="container">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-4xl font-extrabold text-white md:text-5xl">
          Upcoming Shows
        </h2>
        <p class="mt-2 text-[#F63D7A] uppercase tracking-widest font-semibold">
          We bring the party, you bring the noise!
        </p>
      </div>

      <p v-if="loading" class="mt-8 text-center text-white/70" role="status">Loading shows…</p>
      <div v-else-if="loadError" class="mt-8 text-center text-white/70" role="status">
        <p>Shows are temporarily unavailable. Please try again shortly.</p>
        <button type="button" class="mt-3 font-semibold text-white underline underline-offset-4 hover:text-pink" @click="refreshShows">Try again</button>
      </div>
      <p v-else-if="!showsSorted.length" class="mt-8 text-center text-white/70" role="status">
        New dates coming soon. Check back for upcoming shows!
      </p>
      <!-- List -->
      <ul class="mt-8 space-y-3">
        <li
          v-for="show in visibleShows"
          :key="show.id"
          class="p-4 overflow-hidden border rounded-2xl backdrop-blur-sm md:p-5"
          :class="
            isNextShow(show)
              ? 'border-cyan-300 bg-cyan-400/10 shadow-[inset_5px_0_0_#67e8f9,0_0_28px_rgba(34,211,238,0.15)]'
              : isToday(show)
                ? 'border-[#F63D7A]/70 bg-[#F63D7A]/8 shadow-[inset_4px_0_0_rgba(246,61,122,0.85)]'
                : 'border-white/10 bg-white/5'
          "
        >
          <div
            v-if="isToday(show) || isNextShow(show)"
            class="flex flex-wrap gap-2 mb-3"
          >
            <span
              v-if="isToday(show)"
              class="rounded-full bg-[#F63D7A] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-black"
            >
              Today
            </span>
            <span
              v-if="isNextShow(show)"
              class="rounded-full bg-cyan-300 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-black"
            >
              Next Show
            </span>
          </div>

          <div
            class="grid items-center gap-3 md:grid-cols-2 xl:grid-cols-[280px_minmax(0,1fr)_200px_200px]"
          >
            <!-- Date -->
            <div
              class="min-w-0 px-3 py-2 text-sm font-semibold text-white border rounded-xl md:text-base"
              :class="
                isToday(show) || isNextShow(show)
                  ? 'border-white/15 bg-black/80'
                  : 'border-transparent bg-black/40'
              "
            >
              <p>{{ show.dateString }}</p>
            </div>

            <!-- Venue -->
            <div
              class="min-w-0 px-4 py-2 font-semibold text-white border rounded-xl"
              :class="
                isToday(show) || isNextShow(show)
                  ? 'border-white/15 bg-black/80'
                  : 'border-transparent bg-black/40'
              "
            >
              <p class="break-words md:text-lg">{{ show.title }}</p>
            </div>

            <!-- Location -->
            <div
              class="min-w-0 px-4 py-2 font-semibold text-white border rounded-xl md:col-start-1 md:row-start-2 xl:col-start-3 xl:row-start-1"
              :class="
                isToday(show) || isNextShow(show)
                  ? 'border-white/15 bg-black/80'
                  : 'border-transparent bg-black/40'
              "
            >
              <p class="break-words md:text-lg">{{ show.location || 'Location to be announced' }}</p>
            </div>

            <!-- CTA -->
            <a
              v-if="show.link"
              :href="getVenueLink(show)"
              :class="isNextShow(show) ? 'border-cyan-300 bg-cyan-300 text-black hover:border-cyan-200 hover:bg-cyan-200' : 'border-[#F63D7A] text-white hover:bg-black hover:text-white hover:border-white'"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full md:col-start-2 md:row-start-2 xl:col-start-4 xl:row-start-1 inline-flex items-center justify-center px-5 py-3 rounded-full border font-semibold uppercase tracking-wide transition-colors text-xs lg:text-sm"
            >
              Venue Information
            </a>
            <button
              v-else
              type="button"
              disabled
              title="Venue information is not available."
              aria-label="Venue information is not available."
              class="w-full md:col-start-2 md:row-start-2 xl:col-start-4 xl:row-start-1 inline-flex items-center justify-center px-5 py-3 rounded-full border border-white/20 text-white/45 font-semibold uppercase tracking-wide text-xs lg:text-sm cursor-not-allowed"
            >
              Venue Information
            </button>
          </div>
        </li>
      </ul>

      <!-- Load more -->
      <div class="flex justify-center mt-8">
        <button
          v-if="displayCount < showsSorted.length"
          @click="loadMore"
          class="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#F63D7A] text-black font-semibold uppercase tracking-wide shadow-md hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F63D7A] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Show More
          <svg
            class="size-4 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12.293 4.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L14.586 10H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            />
          </svg>
        </button>
        <p v-else-if="showsSorted.length" class="text-sm text-white/60">All shows loaded</p>
      </div>
    </div>
  </section>
</template>
