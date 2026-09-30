<script setup>
import useScrollIntoView from '~/composables/useScrollIntoView';

const { scrollToElement } = useScrollIntoView();
const eventTypes = ['Weddings', 'Corporate', 'Casinos', 'Clubs', 'Private parties'];
</script>

<template>
  <section
    id="hero-concept"
    class="relative min-h-[760px] overflow-hidden bg-ink pt-[96px] lg:min-h-[780px] lg:pt-[112px]"
  >
    <div
      class="pointer-events-none absolute -left-28 top-24 h-72 w-72 rounded-full bg-pink/10 blur-[110px]"
      aria-hidden="true"
    />

    <div
      class="container relative grid min-h-[664px] items-center gap-8 pb-10 lg:min-h-[668px] lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,1.1fr)] lg:gap-14 lg:pb-[98px]"
    >
      <div class="relative z-20 order-2 pb-2 lg:order-1 lg:pb-0">
        <p class="eyebrow mb-5">Boston’s live cover band</p>

        <h1
          class="max-w-[720px] font-serif text-[52px] leading-[0.96] tracking-[-0.025em] text-ivory sm:text-[64px] lg:text-[72px] xl:text-[88px]"
        >
          Black tie polish.<br />
          <em class="text-pink">Bar band</em> heart.
        </h1>

        <p
          class="mt-6 max-w-[540px] text-base leading-[1.7] text-[#D7D0C6] lg:mt-7 lg:text-[18px]"
        >
          A high-energy party band for weddings, corporate events, casinos and
          clubs. We read the room, then pack the dance floor.
        </p>

        <div class="mt-7 flex flex-wrap items-center gap-3 lg:mt-8">
          <button
            class="rounded-full bg-pink px-7 py-4 text-[15px] font-bold text-ink transition-colors hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
            @click="scrollToElement('#contact')"
          >
            Check availability
          </button>
          <button
            class="group flex items-center gap-3 rounded-full border border-ivory/30 py-2 pl-2 pr-5 text-[15px] font-semibold text-ivory transition-colors hover:border-ivory hover:bg-ivory/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory"
            @click="scrollToElement('#reel')"
          >
            <span
              class="grid size-10 place-items-center rounded-full bg-ivory text-[11px] text-ink transition-transform group-hover:scale-105"
              aria-hidden="true"
            >▶</span>
            Watch us live
          </button>
        </div>

        <p class="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-muted2">
          Boston based <span class="mx-2 text-pink">•</span> New England &amp; beyond
        </p>
      </div>

      <button
        class="group relative order-1 mt-2 block h-[290px] w-full overflow-hidden rounded-[2px] text-left sm:h-[350px] lg:order-2 lg:mt-0 lg:h-[500px] xl:h-[540px]"
        aria-label="Watch Turn It Up perform live"
        @click="scrollToElement('#reel')"
      >
        <video
          class="absolute inset-0 size-full object-cover grayscale transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0"
          autoplay
          muted
          loop
          playsinline
          poster="/images/band-hero.jpg"
        >
          <source
            src="https://res.cloudinary.com/dpqslxpd6/video/upload/v1754691159/tiu-bernies_pgaoqn.mp4"
            type="video/mp4"
          />
        </video>
        <span
          class="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-ink/20"
          aria-hidden="true"
        />
        <span
          class="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-ink/50 to-transparent lg:w-20"
          aria-hidden="true"
        />

        <span class="absolute bottom-5 left-5 flex items-center gap-3 lg:bottom-7 lg:left-7">
          <span
            class="grid size-12 place-items-center rounded-full bg-pink text-sm text-ink shadow-[0_12px_40px_rgba(0,0,0,.45)] transition-transform group-hover:scale-105"
            aria-hidden="true"
          >▶</span>
          <span>
            <span class="block text-[11px] font-semibold uppercase tracking-[0.2em] text-pink">
              See the energy
            </span>
            <span class="mt-0.5 block text-sm font-semibold text-ivory">Watch the reel</span>
          </span>
        </span>

        <span
          class="absolute right-0 top-0 h-[3px] w-24 bg-pink"
          aria-hidden="true"
        />
      </button>

      <div
        class="absolute inset-x-[22px] bottom-9 hidden items-center justify-between border-t border-ivory/15 pt-5 text-[11px] font-medium uppercase tracking-[0.15em] text-muted2 lg:flex lg:inset-x-[72px]"
      >
        <div class="flex gap-8 xl:gap-10">
          <span v-for="eventType in eventTypes" :key="eventType">{{ eventType }}</span>
        </div>
        <span class="hidden xl:inline">Classics to today’s hits</span>
      </div>
    </div>
  </section>
</template>
