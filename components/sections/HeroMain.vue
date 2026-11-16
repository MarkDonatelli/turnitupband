<script setup>
import useScrollIntoView from '~/composables/useScrollIntoView';
const { scrollToElement } = useScrollIntoView();

// Headline words, revealed one after another. `pink` words get the italic accent.
const headline = [
  [{ w: 'Black' }, { w: 'tie' }, { w: 'polish.' }],
  [{ w: 'Bar band', pink: true }, { w: 'heart.' }]
];
const wordDelay = (line, i) => `${0.35 + (line * 3 + i) * 0.09}s`;

// Burst widths = logo width × 915/820 so the squares match the TIU artwork.
const bursts = [
  { class: 'lg:hidden', size: 240 },
  { class: 'hidden lg:block xl:hidden', size: 320 },
  { class: 'hidden xl:block', size: 440 }
];

const tags = ['Weddings', 'Corporate', 'Casinos', 'Clubs', 'Private parties'];
</script>

<template>
  <section
    id="home"
    class="relative overflow-hidden bg-ink lg:min-h-[800px] xl:min-h-[860px]"
  >
    <!-- Band photo: full-bleed behind everything, graded black & white with a
         dark overlay so the copy and logo stay legible, plus a magenta stage light. -->
    <div
      class="hero-image relative isolate h-[420px] overflow-hidden sm:h-[500px] lg:absolute lg:inset-0 lg:h-auto"
      aria-hidden="true"
    >
      <NuxtImg
        src="/images/band-hero.jpg"
        alt=""
        sizes="100vw sm:100vw md:100vw lg:100vw xl:100vw"
        format="webp"
        preload
        loading="eager"
        fetchpriority="high"
        class="hero-photo absolute inset-0 size-full object-cover object-[45%_30%] lg:object-[50%_35%]"
      />
      <!-- Magenta stage light, colouring only the highlights it touches -->
      <span
        class="absolute inset-0 mix-blend-color opacity-60 bg-[radial-gradient(ellipse_at_80%_16%,#FF2E8A_0%,transparent_50%)]"
      />
      <!-- Overall dim: the bright brick wall would otherwise compete with the copy -->
      <span class="absolute inset-0 bg-ink/45" />
      <!-- Film grain -->
      <span class="hero-grain absolute inset-0 opacity-[0.16] mix-blend-overlay" />
      <!-- Melt the photo into the page: top for the nav, left/bottom for the copy -->
      <span class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" />
      <span class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/40 to-transparent lg:h-[22%] lg:via-ink/30" />
      <span class="absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-ink via-ink/65 to-transparent lg:block" />
    </div>

    <!-- Full TIU logo + pulsing EQ burst, centered on the photo panel.
         A soft vignette behind it keeps the lettering legible over the photo. -->
    <div
      class="hero-logo pointer-events-none absolute left-1/2 top-[78px] z-[5] -translate-x-1/2 sm:top-[96px] lg:left-[72%] lg:top-[46%] lg:-translate-y-1/2 xl:left-[73%]"
    >
      <span
        class="absolute left-1/2 top-1/2 size-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(13,12,16,.78)_0%,rgba(13,12,16,.45)_38%,transparent_68%)]"
        aria-hidden="true"
      />
      <EqBurst
        v-for="b in bursts"
        :key="b.size"
        :class="b.class"
        :size="b.size"
        logo="/images/tiu_newpink.svg"
        logo-alt=""
        logo-class="drop-shadow-[0_14px_40px_rgba(0,0,0,.6)]"
      />
    </div>

    <div class="container relative z-10 -mt-[120px] pb-12 sm:-mt-[150px] lg:mt-0 lg:flex lg:min-h-[800px] lg:flex-col lg:justify-end lg:pb-[150px] xl:min-h-[860px]">
      <div class="flex max-w-[860px] flex-col gap-6 lg:gap-8">
        <p class="eyebrow hero-fade" style="animation-delay: 0.2s">
          <span class="lg:hidden">Boston · Classics to now</span>
          <span class="hidden lg:inline">Boston’s live cover band · Classics to today’s hits</span>
        </p>

        <h1
          class="font-serif text-[clamp(40px,12.2vw,64px)] lg:text-[72px] xl:text-[96px] leading-[1] lg:leading-[.98] tracking-[-0.015em]"
        >
          <span v-for="(line, l) in headline" :key="l" class="block">
            <template v-for="(word, i) in line" :key="word.w">
              <span class="hero-mask"><span
                class="hero-word"
                :class="word.pink && 'italic text-pink'"
                :style="{ animationDelay: wordDelay(l, i) }"
              >{{ word.w }}</span></span>{{ i < line.length - 1 ? ' ' : '' }}
            </template>
          </span>
        </h1>

        <p
          class="hero-fade max-w-[500px] text-base lg:text-[18px] leading-[1.7] text-[#CFC8BD]"
          style="animation-delay: 0.95s"
        >
          From weddings and private events to packed clubs and casinos, we bring
          the energy of a live rock show to every stage.
        </p>

        <div class="hero-fade flex flex-wrap items-center gap-3.5 pt-1" style="animation-delay: 1.1s">
          <button
            type="button"
            class="group inline-flex items-center gap-3 rounded-full bg-pink px-6 py-[18px] sm:px-[30px] text-[15px] font-bold text-ink shadow-[0_10px_30px_-12px_rgba(255,46,138,.7)] transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-ivory hover:shadow-[0_14px_34px_-14px_rgba(243,238,230,.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
            @click="scrollToElement('#contact')"
          >
            Book the band
            <svg class="size-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <button
            type="button"
            class="group inline-flex items-center gap-3 rounded-full border border-ivory/25 px-5 py-[17px] sm:px-[26px] text-[15px] font-semibold text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory"
            @click="scrollToElement('#shows')"
          >
            See us live
            <span class="relative size-2 rounded-full bg-pink" aria-hidden="true">
              <span class="absolute inset-0 rounded-full bg-pink opacity-0 group-hover:opacity-60 motion-safe:group-hover:animate-ping" />
            </span>
          </button>
        </div>
      </div>
    </div>

    <div
      class="hero-fade absolute inset-x-0 bottom-10 z-10 hidden lg:block"
      style="animation-delay: 1.3s"
    >
      <div
        class="container flex items-center justify-between border-t border-ivory/15 pt-[22px] text-[13px] uppercase tracking-[0.14em] text-muted2"
      >
        <div class="flex gap-10">
          <span v-for="t in tags" :key="t">{{ t }}</span>
        </div>
        <span>New England &amp; beyond</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Angled cut on the photo's leading edge (mobile: bottom edge). */
.hero-image {
  clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
  animation: heroReveal 1.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@media (min-width: 1024px) {
  .hero-image {
    clip-path: none;
    animation-name: heroFadeIn;
  }
}
@keyframes heroFadeIn {
  from { opacity: 0; }
}

.hero-photo {
  filter: grayscale(1) contrast(1.25) brightness(0.72);
  animation: heroSettle 2.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Logo arrives once the photo has revealed. Uses the standalone `scale`
   property so it doesn't fight Tailwind's centering translate. */
.hero-logo {
  animation: heroLogoIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both;
}
@keyframes heroLogoIn {
  from { opacity: 0; scale: 0.92; }
}

.hero-grain {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* Each headline word rises out of its own mask. Padding keeps descenders
   and the italic overhang from being clipped. */
.hero-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding: 0 0.08em 0.14em 0;
  margin: 0 -0.08em -0.14em 0;
}
.hero-word {
  display: inline-block;
  animation: heroWord 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-fade {
  animation: heroFade 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes heroReveal {
  from { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); }
}
@keyframes heroSettle {
  from { transform: scale(1.14); }
  to { transform: scale(1); }
}
@keyframes heroWord {
  from { transform: translateY(105%); }
  to { transform: none; }
}
@keyframes heroFade {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-image,
  .hero-photo,
  .hero-logo,
  .hero-word,
  .hero-fade {
    animation: none;
  }
}
</style>
