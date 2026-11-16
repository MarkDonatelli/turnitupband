<script setup>
  // TODO: confirm answers
  const faqs = [
    { q: 'Will you learn our first dance?', a: 'Yes. Send it with your booking and we’ll play it live, arranged for the band. Parent dances and entrance songs too.' },
    { q: 'Can you cover ceremony and cocktail hour?', a: 'We offer acoustic ceremony and cocktail sets, plus curated playlists during breaks so the room never goes quiet.' },
    { q: 'Do you bring sound and lighting?', a: 'Full professional PA and dance-floor lighting are included, sized to your venue. We coordinate load-in with your planner.' },
    { q: 'How loud is it, really?', a: 'As loud as you want. Dinner sets stay conversational; after the cake cutting we open it up. You set the ceiling.' },
    { q: 'How far do you travel?', a: 'All of New England as standard. Destination events are quoted on request.' }
  ];
  const open = ref(0);
  const toggle = i => (open.value = open.value === i ? null : i);
  const pad = n => String(n).padStart(2, '0');
</script>

<template>
  <section id="faq" class="section-y scroll-mt-[95px]">
    <div class="container grid gap-10 md:gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <!-- Intro column: sticks beside the list on desktop -->
      <div class="flex flex-col gap-5 md:gap-6 lg:sticky lg:top-[120px] lg:self-start">
        <p class="eyebrow flex items-center gap-4">
          FAQ
          <span class="h-px w-12 bg-pink/60 md:w-20" aria-hidden="true" />
        </p>
        <h2 class="font-serif text-[48px] leading-[0.95] tracking-[-0.01em] md:text-[72px] xl:text-[84px]">
          Planner<br />
          <em class="text-pink">questions.</em>
        </h2>
        <p class="max-w-[380px] text-base leading-relaxed text-muted md:text-[17px]">
          The things couples and planners ask before they book. Anything else, just ask.
        </p>
        <a
          href="#contact"
          class="group/cta mt-1 inline-flex w-fit items-center gap-3 border-b border-pink pb-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:text-pink"
        >
          Ask us anything
          <span class="transition-transform group-hover/cta:translate-x-1" aria-hidden="true">→</span>
        </a>
      </div>

      <!-- Accordion -->
      <ul class="border-t border-ivory/15">
        <li
          v-for="(f, i) in faqs"
          :key="f.q"
          class="faq-item border-b border-ivory/15"
          :class="{ 'is-open': open === i }"
        >
          <h3>
            <button
              :id="`faq-q-${i}`"
              type="button"
              :aria-expanded="open === i"
              :aria-controls="`faq-a-${i}`"
              class="group/q grid w-full grid-cols-[40px_1fr_auto] items-center gap-4 py-6 text-left md:grid-cols-[64px_1fr_auto] md:gap-6 md:py-8"
              @click="toggle(i)"
            >
              <span class="num font-display text-[30px] font-black leading-none md:text-[40px]">{{
                pad(i + 1)
              }}</span>
              <span
                class="text-[17px] font-semibold leading-snug transition-colors group-hover/q:text-pink md:text-[22px]"
                >{{ f.q }}</span
              >
              <span
                class="icon relative grid size-9 place-items-center rounded-full border border-ivory/20 transition-colors group-hover/q:border-pink md:size-11"
                aria-hidden="true"
              >
                <span class="absolute h-px w-3.5 bg-pink md:w-4" />
                <span class="bar-v absolute h-px w-3.5 bg-pink md:w-4" />
              </span>
            </button>
          </h3>

          <div
            :id="`faq-a-${i}`"
            role="region"
            :aria-labelledby="`faq-q-${i}`"
            :aria-hidden="open !== i"
            class="answer grid"
          >
            <div class="overflow-hidden">
              <p
                class="max-w-[680px] pb-7 pl-[56px] pr-2 md:pr-12text-[15px] leading-relaxed text-muted md:pb-9 md:pl-[88px] md:text-[17px]"
              >
                {{ f.a }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
  .num {
    color: transparent;
    -webkit-text-stroke: 1px rgba(243, 238, 230, 0.3);
    transition:
      color 0.35s ease,
      -webkit-text-stroke-color 0.35s ease;
  }
  .is-open .num {
    color: #ff2e8a;
    -webkit-text-stroke-color: #ff2e8a;
  }

  /* Plus → minus */
  .bar-v {
    transform: rotate(90deg);
    transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .is-open .bar-v {
    transform: rotate(0deg);
  }
  .is-open .icon {
    border-color: #ff2e8a;
    background: rgba(255, 46, 138, 0.1);
  }

  /* Height animation without measuring: 0fr → 1fr */
  .answer {
    grid-template-rows: 0fr;
    visibility: hidden;
    transition:
      grid-template-rows 0.45s cubic-bezier(0.2, 0.7, 0.2, 1),
      visibility 0s linear 0.45s;
  }
  .is-open .answer {
    grid-template-rows: 1fr;
    visibility: visible;
    transition:
      grid-template-rows 0.45s cubic-bezier(0.2, 0.7, 0.2, 1),
      visibility 0s;
  }
  .answer p {
    opacity: 0;
    transform: translateY(-6px);
    transition:
      opacity 0.3s ease,
      transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .is-open .answer p {
    opacity: 1;
    transform: none;
    transition-delay: 0.08s;
  }

  @media (prefers-reduced-motion: reduce) {
    .answer,
    .answer p,
    .bar-v {
      transition-duration: 0.01ms !important;
    }
  }
</style>
