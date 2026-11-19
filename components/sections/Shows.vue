<script setup>
  // Tour-poster masthead over the schedule. The count starts from the shows
  // read at build time and ShowsList keeps it current: null while loading,
  // -1 on error, otherwise the number of upcoming dates.
  const { count } = await useBakedShows();
  const countLabel = computed(() => {
    if (count.value === null) return 'Loading dates';
    if (count.value < 1) return '';
    return `${count.value} upcoming ${count.value === 1 ? 'date' : 'dates'}`;
  });

  // The masthead rises once as it enters. Without JS or with reduced
  // motion it is simply there.
  const head = ref(null);
  const animated = ref(false);
  let io;
  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    animated.value = true;
    io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        head.value?.classList.add('is-in');
        io.disconnect();
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(head.value);
  });
  onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <section id="shows" class="section-y scroll-mt-[95px]" aria-labelledby="shows-title">
    <!-- Masthead: full-bleed, aligned to the nav's edges. Extra room on top
         so its rule doesn't pair up with the Statement's progress line. -->
    <div class="mt-10 px-[22px] md:mt-14 md:px-10 xl:px-14">
      <div
        class="flex items-baseline justify-between gap-6 border-b border-ivory/15 pb-4 text-[11px] font-semibold uppercase tracking-[0.24em] md:text-[12px]"
      >
        <p class="text-pink">Live shows</p>
        <p class="text-muted2" aria-live="polite">{{ countLabel }}</p>
      </div>

      <div ref="head" class="masthead mt-5 md:mt-7" :class="{ 'is-animated': animated }">
        <h2
          id="shows-title"
          class="font-display font-black uppercase leading-[0.86] tracking-[-0.01em] text-[clamp(76px,21vw,150px)] md:leading-[0.8] md:whitespace-nowrap md:text-[clamp(96px,12.9vw,260px)]"
        >
          <span class="line block md:inline-block">See you</span>
          <span class="line block md:inline-block md:pl-[0.22em]">out there<span class="text-pink">.</span></span>
        </h2>
      </div>
    </div>

    <!-- Schedule: the copy holds the left edge, the dates do the talking -->
    <div
      class="container mt-10 grid gap-8 md:mt-16 md:grid-cols-[minmax(0,260px)_1fr] md:gap-[56px] lg:grid-cols-[300px_1fr] lg:gap-[72px]"
    >
      <p
        class="max-w-[34ch] text-base leading-relaxed text-muted md:sticky md:top-[120px] md:self-start md:text-[17px]"
      >
        Bars, beach clubs and packed dance floors across New England. Come find us, and stay for
        the last set.
      </p>
      <ShowsList />
    </div>
  </section>
</template>

<style scoped>
  /* One gentle rise for the masthead; nothing else moves on entry. */
  .masthead.is-animated .line {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 0.7s ease,
      transform 0.9s var(--ease-out);
  }
  .masthead.is-animated .line + .line {
    transition-delay: 0.08s;
  }
  .masthead.is-animated.is-in .line {
    opacity: 1;
    transform: none;
  }
</style>
