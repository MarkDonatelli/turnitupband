<script setup>
import useScrollIntoView from '~/composables/useScrollIntoView';
const { scrollToElement } = useScrollIntoView();
const tags = ['Weddings', 'Corporate', 'Casinos', 'Clubs', 'Private parties'];
</script>

<template>
  <section
    id="home"
    class="relative overflow-hidden h-[720px] md:h-[780px] bg-ink"
  >
    <!-- EQ burst + logo -->
    <div
      class="absolute left-1/2 -translate-x-1/2 top-[80px] md:left-auto md:translate-x-0 md:right-[max(0px,calc(50%-560px))] md:top-[120px]"
    >
      <EqBurst class="hidden md:block" :size="560" />
      <EqBurst class="md:hidden" :size="300" :rays="28" :rings="7" alt="" />
      <!-- SVG viewBox is centered on the burst center from the original logo art -->
      <img
        src="/images/tiu_newpink.svg"
        alt="Turn It Up!"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+8px)] md:-translate-y-[calc(50%+14px)] max-w-none w-[194px] md:w-[344px] drop-shadow-[0_14px_40px_rgba(0,0,0,.55)] pointer-events-none"
      />
    </div>

    <div class="container relative h-full">
      <div
        class="absolute left-[22px] right-[22px] bottom-10 md:left-[72px] md:right-auto md:bottom-[130px] md:max-w-[680px] flex flex-col gap-5 md:gap-7"
      >
        <p class="eyebrow">
          <span class="md:hidden">Boston · Classics to now</span>
          <span class="hidden md:inline"
            >Boston’s live cover band · Classics to today’s hits</span
          >
        </p>
        <h1
          class="font-serif text-[54px] md:text-[96px] leading-[1] md:leading-[.98] tracking-[-0.015em] text-balance"
        >
          Black tie polish. <em class="text-pink">Bar band</em> heart.
        </h1>
        <p
          class="text-base md:text-[19px] leading-relaxed text-[#CFC8BD] max-w-[520px]"
        >
          A high-energy party band for weddings, corporate events, casinos and
          clubs. We read the room, then pack the dance floor.
        </p>
        <div class="flex flex-wrap items-center gap-3.5">
          <button
            @click="scrollToElement('#contact')"
            class="px-[30px] py-[18px] text-[15px] font-bold rounded-full bg-pink text-ink hover:bg-ivory transition-colors"
          >
            Check your date
          </button>
          <button
            @click="scrollToElement('#reel')"
            class="flex items-center gap-3 py-2.5 pl-2.5 pr-[22px] text-[15px] font-semibold border rounded-full border-ivory/25"
          >
            <span
              class="grid w-[38px] h-[38px] text-xs rounded-full place-items-center bg-ivory text-ink"
              >▶</span
            >
            Watch the reel
          </button>
        </div>
      </div>

      <div
        class="absolute hidden md:flex left-[72px] right-[72px] bottom-10 justify-between items-center pt-[22px] border-t border-ivory/15 text-[13px] uppercase tracking-[0.14em] text-muted2"
      >
        <div class="flex gap-10">
          <span v-for="t in tags" :key="t">{{ t }}</span>
        </div>
        <span>New England &amp; beyond</span>
      </div>
    </div>
  </section>
</template>
