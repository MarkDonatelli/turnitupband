<script setup>
  import { shows } from '~/data/shows.mjs';
  import { getShowDateString, selectShows } from '~/utils/shows.mjs';

  const props = defineProps({ past: { type: Boolean, default: false } });
  // Nuxt serializes this value so server and client use the same initial date.
  const todayString = useState('shows-today', () => getShowDateString(new Date()));
  let todayTimer;
  const refreshToday = () => {
    todayString.value = getShowDateString(new Date());
  };
  onMounted(() => {
    refreshToday();
    todayTimer = window.setInterval(refreshToday, 1000);
    window.addEventListener('focus', refreshToday);
  });
  onUnmounted(() => {
    window.clearInterval(todayTimer);
    window.removeEventListener('focus', refreshToday);
  });
  const showsSorted = computed(() => selectShows(shows, todayString.value, props.past));
  const nextShowDate = computed(() => props.past ? null : showsSorted.value[0]?.dateCheckString);
  const PAGE = 15;
  const displayCount = ref(PAGE);
  const visibleShows = computed(() => showsSorted.value.slice(0, displayCount.value));
  const loadMore = () => { displayCount.value += PAGE; };
  const getVenueLink = (show) => show.link;
  const isToday = (show) => !props.past && show.dateCheckString === todayString.value;
  const isNextShow = (show) => !props.past && show.dateCheckString === nextShowDate.value;
</script>

<template>
  <section class="py-16 bg-black md:py-24 overflow-x-clip">
    <div class="container">
      <!-- Header -->
      <div class="text-center">
        <component :is="past ? 'h1' : 'h2'" class="text-4xl font-extrabold text-white md:text-5xl">
          {{ past ? 'Past Shows' : 'Upcoming Shows' }}
        </component>
        <p class="mt-2 text-[#F63D7A] uppercase tracking-widest font-semibold">
          {{ past ? 'Thanks for being part of the party!' : 'We bring the party, you bring the noise!' }}
        </p>
      </div>

      <div class="mt-6 text-center">
        <NuxtLink :to="past ? '/#shows' : '/past-shows'" class="font-semibold text-white underline underline-offset-4 hover:text-pink">
          {{ past ? 'View upcoming shows' : 'View past shows' }}
        </NuxtLink>
      </div>
      <p v-if="!showsSorted.length" class="mt-8 text-center text-white/70" role="status">
        {{ past ? 'No past shows yet.' : 'New dates coming soon. Check back for upcoming shows!' }}
      </p>
      <!-- List -->
      <ul class="mt-8 space-y-3">
        <li
          v-for="show in visibleShows"
          :key="`${show.venue}-${show.dateCheckString}-${show.dateString}`"
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
            class="grid gap-3 items-start md:grid-cols-[minmax(200px,1fr)_minmax(260px,1.2fr)] lg:grid-cols-[minmax(220px,1fr)_minmax(260px,1.2fr)_auto] xl:grid-cols-[280px_1fr_240px_auto]"
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
              <p class="truncate">{{ show.dateString }}</p>
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
              <p class="truncate md:text-lg">{{ show.venue }}</p>
            </div>

            <!-- Location -->
            <div
              v-if="show.location"
              class="min-w-0 px-4 py-2 font-semibold text-white border rounded-xl md:col-start-2 md:row-start-2 lg:col-start-auto lg:row-start-auto"
              :class="
                isToday(show) || isNextShow(show)
                  ? 'border-white/15 bg-black/80'
                  : 'border-transparent bg-black/40'
              "
            >
              <p class="truncate md:text-lg">{{ show.location }}</p>
            </div>

            <!-- CTA -->
            <a
              v-if="show.link"
              :href="getVenueLink(show)"
              :class="isNextShow(show) ? 'border-cyan-300 bg-cyan-300 text-black hover:border-cyan-200 hover:bg-cyan-200' : 'border-[#F63D7A] text-white hover:bg-black hover:text-white hover:border-white'"
              target="_blank"
              class="shrink-0 justify-self-stretch md:justify-self-start inline-flex items-center justify-center px-5 py-3 rounded-full border font-semibold uppercase tracking-wide transition-colors text-xs lg:text-sm"
            >
              Venue Information
            </a>
            <button
              v-else
              type="button"
              disabled
              title="Venue information is not available."
              aria-label="Venue information is not available."
              class="shrink-0 justify-self-stretch md:justify-self-start inline-flex items-center justify-center px-5 py-3 rounded-full border border-white/20 text-white/45 font-semibold uppercase tracking-wide text-xs lg:text-sm cursor-not-allowed"
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
