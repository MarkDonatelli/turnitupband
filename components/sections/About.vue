<script setup>
  // Exactly five members. `zoom` + `origin` bring every head to a similar
  // size inside the shared 4:5 frame, so mixed close-ups and full-length
  // shots crop consistently.
  const members = [
    { name: 'Kelcey', role: 'Vocals', img: '/images/kelcey-balloons.jpg', zoom: 1.2, origin: '58% 34%' },
    { name: 'Bob', role: 'Vocals', img: '/images/bob.jpg', zoom: 1, origin: '50% 30%', focus: '45% 30%' },
    { name: 'Mark', role: 'Guitar', img: '/images/mark.jpg', zoom: 1.15, origin: '50% 0%' },
    { name: 'Tom', role: 'Bass', img: '/images/tom-balloons.jpg', zoom: 1.25, origin: '52% 12%' },
    { name: 'James', role: 'Drums', img: '/images/james.jpg', zoom: 1, origin: '40% 40%', focus: '38% 40%' }
  ];

  const pad = n => String(n).padStart(2, '0');

  // Touch screens have no hover, so the card snapped into view is the one
  // that "turns up" to full colour.
  const scroller = ref(null);
  const live = ref(0);
  const isTouch = ref(false);
  let io;

  onMounted(() => {
    isTouch.value = window.matchMedia('(hover: none)').matches;
    io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) live.value = Number(e.target.dataset.i);
        });
      },
      { threshold: 0.65 }
    );
    scroller.value?.querySelectorAll('[data-i]').forEach(el => io.observe(el));
  });
  onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <section id="about" class="section-y scroll-mt-[95px]">
    <div class="container">
      <!-- Feature opener: oversized headline overlapping the group photograph -->
      <div class="grid gap-6 md:gap-8 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-10">
        <header class="relative z-10 flex flex-col gap-4 md:gap-6 lg:col-start-1 lg:col-end-8 lg:row-start-1 lg:pt-4">
          <p class="eyebrow flex items-center gap-4">
            The band
            <span class="h-px w-12 bg-pink/60 md:w-20" aria-hidden="true" />
          </p>
          <h2
            class="font-serif text-[56px] leading-[0.9] tracking-[-0.01em] sm:text-[76px] md:text-[104px] xl:text-[128px]"
          >
            This is<br />
            <em class="text-pink">Turn It Up!</em>
          </h2>
        </header>

        <figure
          class="photo group/photo relative overflow-hidden rounded-sm bg-ink3 aspect-[18/11] lg:col-start-6 lg:col-end-13 lg:row-span-2 lg:row-start-1 lg:aspect-auto lg:min-h-[440px]"
        >
          <NuxtImg
            src="/images/TIU_Grafitti.jpg"
            alt="Turn It Up! — Kelcey, Bob, Mark, Tom and James"
            sizes="100vw lg:60vw"
            format="webp"
            loading="lazy"
            class="graded absolute inset-0 size-full object-cover object-[center_32%]"
          />
          <span class="tint absolute inset-0" aria-hidden="true" />
          <!-- Let the headline sit cleanly on the photo's left edge -->
          <span
            class="absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-ink/80 to-transparent lg:block"
            aria-hidden="true"
          />
          <figcaption
            class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-3 pt-12 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory/80 md:px-6 md:pb-5 md:text-[11px]"
          >
            <span>The full lineup</span>
            <span class="text-pink">Boston</span>
          </figcaption>
        </figure>

        <div class="flex flex-col gap-5 lg:col-start-1 lg:col-end-5 lg:row-start-2 lg:self-end lg:pb-1">
          <p class="max-w-[440px] text-base leading-relaxed text-muted md:text-[17px]">
            Five musicians, two lead voices, and years of packed club nights behind every wedding and
            gala we play.
          </p>
          <p
            class="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-ivory/15 pt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted2"
          >
            <span class="text-ivory/50">Featuring</span>
            <template v-for="(m, i) in members" :key="m.name">
              <span class="text-ivory">{{ m.name }}</span>
              <span v-if="i < members.length - 1" class="text-pink" aria-hidden="true">/</span>
            </template>
          </p>
        </div>
      </div>

      <!-- Lineup rule -->
      <div
        class="mt-12 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted2 md:mt-20 lg:mt-24"
      >
        <span class="text-ivory">The lineup</span>
        <span class="h-px flex-1 bg-ivory/15" aria-hidden="true" />
      </div>

      <!-- Five members: 2 columns on mobile (last one centred), 3 + 2 centred on tablet,
           staggered five-column spread on desktop -->
      <ul
        ref="scroller"
        class="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-8 md:grid-cols-6 md:gap-x-6 md:gap-y-12 lg:grid-cols-5 lg:items-start lg:gap-x-5"
      >
        <li
          v-for="(m, i) in members"
          :key="m.name"
          :data-i="i"
          class="member max-md:[&:nth-child(5)]:col-span-2 max-md:[&:nth-child(5)]:mx-auto max-md:[&:nth-child(5)]:w-[calc(50%-0.5rem)] md:col-span-2 md:[&:nth-child(4)]:col-start-2 lg:col-span-1 lg:[&:nth-child(4)]:col-start-auto lg:[&:nth-child(even)]:mt-16"
          :class="{ 'is-live': isTouch && live === i }"
        >
          <div class="mb-3 flex items-end justify-between border-t border-ivory/20 pt-3">
            <span class="num font-display text-[52px] font-black leading-[0.8] lg:text-[64px]">{{
              pad(i + 1)
            }}</span>
            <span class="text-[11px] font-semibold uppercase tracking-[0.2em] text-pink">{{ m.role }}</span>
          </div>

          <div class="portrait relative aspect-[4/5] overflow-hidden rounded-sm bg-ink3">
            <NuxtImg
              :src="m.img"
              :alt="`${m.name}, ${m.role.toLowerCase()}`"
              sizes="70vw md:33vw lg:20vw"
              format="webp"
              loading="lazy"
              class="graded absolute inset-0 size-full object-cover"
              :style="{ '--z': m.zoom, '--o': m.origin, objectPosition: m.focus || '50% 30%' }"
            />
            <span class="tint absolute inset-0" aria-hidden="true" />
            <span
              class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/50 to-transparent"
              aria-hidden="true"
            />
            <span class="bar absolute bottom-0 left-0 h-[3px] w-full bg-pink" aria-hidden="true" />
          </div>

          <h3 class="name mt-4 font-serif text-[30px] leading-none md:text-[34px] xl:text-[38px]">
            {{ m.name }}
          </h3>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
  /* Shared grade: high-contrast black & white with a magenta stage light,
     matching the hero photograph. Hover brings back the real colour. */
  .graded {
    filter: grayscale(1) contrast(1.15) brightness(0.9);
    transform: scale(var(--z, 1));
    transform-origin: var(--o, 50% 30%);
    transition:
      filter 0.7s ease,
      transform 1.1s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  .tint {
    background: radial-gradient(120% 80% at 88% 0%, #ff2e8a 0%, transparent 60%);
    mix-blend-mode: color;
    opacity: 0.5;
    transition: opacity 0.6s ease;
  }

  .num {
    color: transparent;
    -webkit-text-stroke: 1px rgba(243, 238, 230, 0.35);
    transition:
      color 0.4s ease,
      -webkit-text-stroke-color 0.4s ease;
  }

  .bar {
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  .name {
    transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  /* --- Turned up: hover on pointer devices, snapped card on touch --- */
  .member.is-live .graded,
  .photo.is-live .graded {
    filter: grayscale(0) contrast(1.05) brightness(1);
    transform: scale(calc(var(--z, 1) * 1.05));
  }
  .member.is-live .tint {
    opacity: 0;
  }
  .member.is-live .num {
    color: #ff2e8a;
    -webkit-text-stroke-color: #ff2e8a;
  }
  .member.is-live .bar {
    transform: scaleX(1);
  }

  @media (hover: hover) {
    .member:hover .graded,
    .photo:hover .graded {
      filter: grayscale(0) contrast(1.05) brightness(1);
      transform: scale(calc(var(--z, 1) * 1.05));
    }
    .member:hover .tint,
    .photo:hover .tint {
      opacity: 0;
    }
    .member:hover .num {
      color: #ff2e8a;
      -webkit-text-stroke-color: #ff2e8a;
    }
    .member:hover .bar {
      transform: scaleX(1);
    }
    .member:hover .name {
      transform: translateX(6px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .graded,
    .bar,
    .name {
      transition-duration: 0.01ms;
    }
  }

  .no-scrollbar {
    scrollbar-width: none;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
