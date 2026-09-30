<script setup>
  // TODO: replace with real reviews
  const quotes = [
    {
      text: 'Every single guest danced, from our flower girl to my 88-year-old grandmother. They made the night.',
      who: 'Sample couple',
      where: 'Wedding'
    },
    {
      text: 'Professional from the first call. They hit every cue in our program and then turned the gala into a party.',
      who: 'Events director',
      where: 'Corporate gala'
    },
    {
      text: 'Best cover band in Boston, and it isn’t close. We plan our weekends around their calendar.',
      who: 'Regular',
      where: 'Club night'
    }
  ];
</script>

<template>
  <section class="bg-ivory text-ink py-14 md:py-[120px]">
    <div class="container flex flex-col gap-8 md:gap-16">
      <div class="flex items-end justify-between">
        <h2 class="font-serif text-[36px] md:text-[64px] leading-none">
          Heard on the <em>dance floor.</em>
        </h2>
        <span class="hidden md:block text-[13px] uppercase tracking-[0.18em] text-stone"
          >Reviews</span
        >
      </div>
      <div
        class="flex gap-6 overflow-x-auto snap-x -mx-[22px] px-[22px] md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-12 md:overflow-visible"
      >
        <figure
          v-for="q in quotes"
          :key="q.who"
          class="flex-none w-[300px] md:w-auto snap-start flex flex-col gap-6 pt-7 border-t border-ink"
        >
          <blockquote class="font-serif text-[24px] md:text-[27px] leading-[1.3]">
            “{{ q.text }}”
          </blockquote>
          <figcaption class="flex flex-col gap-1 text-sm">
            <b class="font-bold">{{ q.who }}</b>
            <span class="text-stone">{{ q.where }}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
