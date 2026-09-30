<script setup>
  const members = [
    { name: 'Kelcey', role: 'Vocals', img: '/images/kelcey-balloons.jpg' },
    { name: 'Bob', role: 'Vocals', img: '/images/bob.jpg' },
    { name: 'Joey', role: 'Guitar, Vocals', img: '/images/joey.jpg' }, // TODO: add joey.jpg to /public/images
    { name: 'Mark', role: 'Guitar', img: '/images/mark.jpg' },
    { name: 'Tom', role: 'Bass', img: '/images/tom-balloons.jpg' },
    { name: 'James', role: 'Drums', img: '/images/james.jpg' }
  ];
</script>

<template>
  <section id="about" class="scroll-mt-[95px] pb-16 md:pb-[120px]">
    <div class="container flex flex-col gap-6 md:gap-11">
      <div class="grid gap-4 md:grid-cols-[1.2fr_1fr] md:gap-16 md:items-end">
        <div class="flex flex-col gap-3 md:gap-4">
          <p class="eyebrow">The band</p>
          <h2 class="font-serif text-[40px] md:text-[64px] leading-[1.02]">
            This is <em>Turn It Up!</em>
          </h2>
        </div>
        <p class="hidden md:block text-[17px] leading-relaxed text-muted">
          Six musicians, three lead voices, and years of packed club nights
          behind every wedding and gala we play.
        </p>
      </div>

      <div class="h-[220px] md:h-[560px] overflow-hidden rounded md:rounded-md">
        <NuxtImg
          src="/images/TIU_Grafitti.jpg"
          alt="Turn It Up! band"
          class="object-cover w-full h-full object-[center_30%]"
          format="webp"
          loading="lazy"
        />
      </div>

      <div class="grid grid-cols-2 gap-x-3 gap-y-[18px] md:grid-cols-3 md:gap-6">
        <div
          v-for="m in members"
          :key="m.name"
          class="flex flex-col gap-2.5 md:gap-4 transition-transform md:hover:-translate-y-1.5"
        >
          <div class="h-[180px] md:h-[340px] overflow-hidden rounded bg-ink3">
            <NuxtImg
              :src="m.img"
              :alt="m.name"
              class="object-cover w-full h-full object-[center_25%]"
              format="webp"
              loading="lazy"
            />
          </div>
          <div
            class="flex flex-col gap-0.5 md:flex-row md:justify-between md:items-baseline md:gap-4 md:pt-3.5 md:border-t md:border-ivory/20"
          >
            <span class="font-serif text-[22px] md:text-[32px] leading-[1.1] md:leading-none">{{
              m.name
            }}</span>
            <span
              class="text-[11px] md:text-xs font-semibold uppercase tracking-[0.16em] md:tracking-[0.2em] text-pink"
              >{{ m.role }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
