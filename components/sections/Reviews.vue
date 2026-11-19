<script setup>
  // Wall of praise: one review set big, the rest beside it, all readable.
  // Choosing one of the smaller reviews swaps it into the feature spot.
  // Placeholder reviews (see data/reviews.js) never render in production;
  // with nothing real to show, the whole section steps aside.
  import { reviews } from '~/data/reviews.js';

  const { deployContext } = useRuntimeConfig().public;
  const shown = reviews.filter(r => deployContext !== 'production' || !r.placeholder);

  // Split each quote around its highlight so the emphasis is pure styling.
  const parts = r => {
    const i = r.highlight ? r.text.indexOf(r.highlight) : -1;
    if (i < 0) return [r.text, '', ''];
    return [r.text.slice(0, i), r.highlight, r.text.slice(i + r.highlight.length)];
  };

  const featured = ref(0);
  // The chosen button leaves the list, so keyboard focus moves to the quote
  // it just brought forward.
  const stage = ref(null);
  const feature = i => {
    featured.value = i;
    stage.value?.focus({ preventScroll: true });
  };
  const others = computed(() => shown.map((r, i) => ({ ...r, i })).filter(r => r.i !== featured.value));
</script>

<template>
  <section
    v-if="shown.length"
    id="reviews"
    class="section-y scroll-mt-[95px] bg-ivory text-ink"
    aria-labelledby="reviews-title"
  >
    <!-- Wider than the contained sections: aligned to the nav edges -->
    <div class="px-[22px] md:px-10 xl:px-14">
      <header>
        <h2
          id="reviews-title"
          class="font-serif text-[52px] leading-[0.92] tracking-[-0.02em] md:text-[84px] xl:text-[112px]"
        >
          Heard on the<br />
          <em>dance floor.</em>
        </h2>
      </header>

      <div class="mt-10 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-x-6">
        <!-- The feature -->
        <div ref="stage" tabindex="-1" class="outline-none lg:col-span-8" aria-live="polite">
          <Transition name="quote" mode="out-in">
            <figure :key="featured">
              <blockquote
                class="font-serif text-[30px] leading-[1.14] tracking-[-0.01em] md:text-[44px] xl:text-[60px]"
              >
                <p>
                  “{{ parts(shown[featured])[0] }}<em v-if="parts(shown[featured])[1]">{{
                    parts(shown[featured])[1]
                  }}</em
                  >{{ parts(shown[featured])[2] }}”
                </p>
              </blockquote>
              <figcaption class="mt-6 flex items-center gap-4 text-sm md:mt-8 md:text-base">
                <span class="h-[2px] w-10 bg-pink" aria-hidden="true" />
                <span class="font-bold">{{ shown[featured].who }}</span>
                <span class="text-stone">{{ shown[featured].where }}</span>
              </figcaption>
            </figure>
          </Transition>
        </div>

        <!-- The rest of the wall: tap one to bring it forward -->
        <aside
          v-if="others.length"
          class="border-t border-ink/15 pt-6 lg:col-span-4 lg:col-start-9 lg:border-l xl:col-span-3 xl:col-start-10 lg:border-t-0 lg:pl-8 lg:pt-2"
          aria-labelledby="reviews-more"
        >
          <p id="reviews-more" class="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone">
            More from the floor
          </p>
          <ul class="mt-4 flex flex-col">
            <li v-for="r in others" :key="r.i" class="border-b border-ink/10 last:border-b-0">
              <button
                type="button"
                class="group/q flex w-full flex-col gap-2.5 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                @click="feature(r.i)"
              >
                <span class="sr-only">Feature this review: </span>
                <span
                  class="font-serif text-[19px] leading-[1.3] text-ink/80 transition-colors duration-300 group-hover/q:text-ink md:text-[20px]"
                  >“{{ r.text }}”</span
                >
                <span class="flex items-center gap-3 text-[13px]">
                  <span class="font-bold">{{ r.who }}</span>
                  <span class="text-stone">{{ r.where }}</span>
                  <span
                    class="ml-auto text-pink-deep transition-transform duration-300 group-hover/q:-translate-y-1 lg:group-hover/q:-translate-x-1 lg:group-hover/q:translate-y-0"
                    aria-hidden="true"
                    ><span class="lg:hidden">↑</span><span class="hidden lg:inline">←</span></span
                  >
                </span>
              </button>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .quote-enter-active {
    transition:
      opacity 0.6s ease,
      transform 0.8s var(--ease-out);
  }
  .quote-leave-active {
    transition: opacity 0.25s ease;
  }
  .quote-enter-from {
    opacity: 0;
    transform: translateY(14px);
  }
  .quote-leave-to {
    opacity: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .quote-enter-active,
    .quote-leave-active {
      transition: opacity 0.15s linear;
    }
    .quote-enter-from {
      transform: none;
    }
  }
</style>
