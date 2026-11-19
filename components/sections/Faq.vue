<script setup>
  // Proposed copy: confirm each answer matches how the band actually works
  // (song requests, ceremony coverage, equipment, travel) before launch.
  const faqs = [
    {
      q: 'Will you learn our first dance?',
      a: 'Absolutely. Tell us which song you have in mind, and we’ll work with you on the best way to bring it to life. We can also discuss parent dances and entrance music.'
    },
    {
      q: 'Can you cover ceremony and cocktail hour?',
      a: 'We can discuss music options for your ceremony and cocktail hour as part of your event. Tell us what you’re planning, and we’ll help determine the right setup and coverage.'
    },
    {
      q: 'Do you provide sound and lighting?',
      a: 'Yes! We typically bring our own professional sound system and stage lighting, so you don’t have to worry about coordinating separate vendors. We’ll work with your venue to make sure everything is set up for the space and event.'
    },
    {
      q: 'How loud is it, really?',
      a: 'Loud enough to get the dance floor moving, but we’re not here to overpower the room. We adjust our volume to the venue, crowd, and moment. We know when to dial it back and when to turn it up.'
    },
    {
      q: 'How do you choose the setlist?',
      a: 'We read the room. Every crowd is different, and that’s part of what makes playing live so much fun. We mix classics, rock, pop, country, and today’s hits based on the energy in the room. We also love hearing your must-plays before the event.'
    },
    {
      q: 'How far do you travel?',
      a: 'We’re based in the Boston area and regularly perform throughout New England. Planning something farther away? Reach out and tell us where. We’re always open to discussing the right event.'
    },
    {
      q: 'How do we book Turn It Up?',
      a: 'Start by sending us your event date, location, and a few details about what you’re planning. We’ll check availability, talk through your event, and help you figure out the next steps.'
    }
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
        <h2 class="font-serif text-[48px] leading-[0.95] tracking-[-0.01em] md:text-[72px] xl:text-[84px]">
          Planner<br />
          questions.
        </h2>
        <p class="max-w-[380px] text-base leading-relaxed text-muted md:text-[17px]">
          The things couples and planners ask before they book. Anything else, just ask.
        </p>
        <a
          href="#contact"
          class="group/cta mt-1 inline-flex w-fit items-center gap-3 border-b border-pink pb-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
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
              class="group/q grid w-full grid-cols-[20px_1fr_auto] items-center gap-4 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink md:grid-cols-[24px_1fr_auto] md:gap-6 md:py-8"
              @click="toggle(i)"
            >
              <span class="num text-[11px] font-semibold leading-none tracking-[0.2em]" aria-hidden="true">{{
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
            class="answer grid"
          >
            <div class="overflow-hidden">
              <p
                class="max-w-[680px] pb-7 pl-[36px] pr-2 md:pr-12 text-[15px] leading-relaxed text-muted md:pb-9 md:pl-[48px] md:text-[17px]"
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
    color: #8c867c;
    transition: color 0.35s ease;
  }
  .is-open .num {
    color: #ff2e8a;
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
