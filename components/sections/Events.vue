<script setup>
  import useScrollIntoView from '~/composables/useScrollIntoView';
  const { scrollToElement } = useScrollIntoView();

  const rooms = [
    {
      tag: '01 · Weddings',
      title: 'Weddings',
      body: 'Your first dance learned, your timeline respected, your grandparents and college friends on the same floor.',
      cta: 'Wedding details →',
      img: '/images/kelcey-balloons.jpg',
      target: '#contact'
    },
    {
      tag: '02 · Corporate',
      title: 'Corporate & galas',
      body: 'Holiday parties, launches and fundraisers. Clean sets, on-time changeovers, and a band that follows the run of show.',
      cta: 'Corporate details →',
      img: '/images/bob-kel--mic.jpg',
      target: '#contact'
    },
    {
      tag: '03 · Clubs',
      title: 'Clubs & casinos',
      body: 'Where it started. Loud, sweaty and 90s-to-now, most weekends around New England.',
      cta: 'See public shows →',
      img: '/images/group-1.jpg',
      target: '#shows',
      pink: true
    }
  ];
</script>

<template>
  <section id="events" class="scroll-mt-[95px] py-16 md:py-[120px]">
    <div class="container flex flex-col gap-7 md:gap-14">
      <div class="grid gap-6 md:grid-cols-[1.2fr_1fr] md:gap-16 md:items-end">
        <div class="flex flex-col gap-4">
          <p class="eyebrow">One band, every room</p>
          <h2 class="font-serif text-[40px] md:text-[64px] leading-[1.02]">
            From first dance <em>to last call.</em>
          </h2>
        </div>
        <p class="hidden md:block text-[17px] leading-relaxed text-muted">
          The same band, set up differently for each room. Ceremony-quiet at 6,
          a full floor by 9. Volume, set list and stage presence are tuned to
          your crowd.
        </p>
      </div>

      <div
        class="flex gap-3.5 overflow-x-auto -mx-[22px] px-[22px] md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible"
      >
        <button
          v-for="(r, i) in rooms"
          :key="r.title"
          @click="scrollToElement(r.target)"
          class="flex-none w-[260px] md:w-auto flex flex-col gap-4 md:gap-[22px] text-left transition-transform hover:-translate-y-1.5"
          :class="{ 'md:mt-14': i === 1, 'md:mt-28': i === 2 }"
        >
          <div
            class="relative h-[320px] md:h-[460px] overflow-hidden rounded bg-ink3"
          >
            <NuxtImg
              :src="r.img"
              :alt="r.title"
              class="object-cover w-full h-full"
              format="webp"
              loading="lazy"
            />
            <span
              class="absolute top-[18px] left-[18px] px-[11px] py-[7px] rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-ink"
              :class="r.pink ? 'bg-pink' : 'bg-ivory'"
              >{{ r.tag }}</span
            >
          </div>
          <div class="flex flex-col gap-2.5">
            <h3 class="font-serif text-[26px] md:text-[32px]">{{ r.title }}</h3>
            <p class="hidden md:block text-[15px] leading-relaxed text-muted">
              {{ r.body }}
            </p>
            <span class="hidden md:block text-sm font-semibold text-pink">{{
              r.cta
            }}</span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>
