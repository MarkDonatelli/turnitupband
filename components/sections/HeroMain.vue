<script setup>
import useScrollIntoView from '~/composables/useScrollIntoView';
const { scrollToElement } = useScrollIntoView();
const bursts = [
  { class: 'lg:hidden', size: 206 },
  { class: 'hidden lg:block xl:hidden', size: 262 },
  { class: 'hidden xl:block', size: 385 }
];
const tags = ['Weddings', 'Corporate', 'Casinos', 'Clubs', 'Private parties'];
</script>

<template>
  <section
    id="home"
    class="relative overflow-hidden h-[720px] lg:h-[780px] bg-ink"
  >
    <div class="container relative h-full">
      <!-- EQ burst + logo: stacked above the copy below lg, beside it from lg up.
           Burst widths = logo width × 915/820 so the squares match the TIU artwork;
           offsets keep the logo center where it was before. -->
      <div
        class="absolute left-1/2 -translate-x-1/2 top-[130px] lg:left-auto lg:translate-x-0 lg:right-[100px] lg:top-[264px] xl:right-[78px] xl:top-[205px]"
      >
        <EqBurst
          v-for="b in bursts"
          :key="b.size"
          :class="b.class"
          :size="b.size"
          logo="/images/tiu_newpink.svg"
          logo-class="drop-shadow-[0_14px_40px_rgba(0,0,0,.55)]"
        />
      </div>

      <div
        class="absolute left-[22px] right-[22px] md:left-[72px] md:right-[72px] bottom-10 lg:left-[72px] lg:right-auto lg:bottom-[130px] lg:max-w-[520px] xl:max-w-[680px] flex flex-col gap-5 lg:gap-7"
      >
        <p class="eyebrow">
          <span class="lg:hidden">Boston · Classics to now</span>
          <span class="hidden lg:inline"
            >Boston’s live cover band · Classics to today’s hits</span
          >
        </p>
        <h1
          class="font-serif text-[54px] lg:text-[72px] xl:text-[96px] leading-[1] lg:leading-[.98] tracking-[-0.015em] text-balance"
        >
          Black tie polish. <em class="text-pink">Bar band</em> heart.
        </h1>
        <p
          class="text-base lg:text-[19px] leading-relaxed text-[#CFC8BD] max-w-[520px]"
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
        class="absolute hidden lg:flex left-[72px] right-[72px] bottom-10 justify-between items-center pt-[22px] border-t border-ivory/15 text-[13px] uppercase tracking-[0.14em] text-muted2"
      >
        <div class="flex gap-10">
          <span v-for="t in tags" :key="t">{{ t }}</span>
        </div>
        <span>New England &amp; beyond</span>
      </div>
    </div>
  </section>
</template>
