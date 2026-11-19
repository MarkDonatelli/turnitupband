<script setup>
  // Oversized statement that pins and pans sideways as you scroll.
  // The section is exactly as tall as the horizontal distance to travel,
  // so one pixel of scroll moves the line one pixel. Transform only.
  const root = ref(null);
  const track = ref(null);
  const bar = ref(null);
  const distance = ref(0);
  const pinned = ref(true); // false under reduced motion: static, stacked layout

  let raf = 0;
  let ro;
  let mq;

  const measure = () => {
    if (!pinned.value || !track.value) return;
    distance.value = Math.max(0, track.value.scrollWidth - window.innerWidth);
    update();
  };

  const update = () => {
    raf = 0;
    if (!pinned.value || !root.value) return;
    const d = distance.value;
    const p = d ? Math.min(1, Math.max(0, -root.value.getBoundingClientRect().top / d)) : 0;
    track.value.style.transform = `translate3d(${(-p * d).toFixed(1)}px,0,0)`;
    if (bar.value) bar.value.style.transform = `scaleX(${p.toFixed(4)})`;
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  const setMode = () => {
    pinned.value = !mq.matches;
    if (!pinned.value && track.value) {
      track.value.style.transform = '';
      distance.value = 0;
    }
    nextTick(measure);
  };

  onMounted(() => {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', setMode);
    setMode();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    ro = new ResizeObserver(measure);
    ro.observe(track.value);
    document.fonts?.ready.then(measure); // the serif's width changes the travel
  });
  onBeforeUnmount(() => {
    mq?.removeEventListener('change', setMode);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', measure);
    ro?.disconnect();
    cancelAnimationFrame(raf);
  });

  // Until measured (SSR, first paint) assume roughly four screens of travel,
  // so the page below doesn't jump when the real height arrives.
  const height = computed(() =>
    pinned.value && distance.value ? `calc(100svh + ${distance.value}px)` : undefined
  );
</script>

<template>
  <section
    id="statement"
    ref="root"
    class="statement relative bg-ink"
    :class="{ 'is-static': !pinned }"
    :style="{ height }"
    aria-labelledby="statement-title"
  >
    <div class="frame sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">

      <div ref="track" class="track flex w-max items-center gap-[8vw] px-[6vw] will-change-transform">
        <h2
          id="statement-title"
          class="flex items-baseline gap-[0.28em] whitespace-nowrap font-serif leading-[0.86] tracking-[-0.02em] text-[clamp(120px,22vw,360px)]"
        >
          <span class="text-ivory">Black tie polish.</span>
          <em class="text-pink">Bar band heart.</em>
        </h2>
        <p class="w-[min(78vw,380px)] shrink-0 text-base leading-relaxed text-muted md:text-[18px]">
          From weddings and private events to packed clubs and casinos, we bring the energy of a live
          rock show to every stage.
        </p>
      </div>

      <!-- Progress: how far through the line you are -->
      <div
        class="absolute bottom-8 left-[22px] right-[22px] h-px bg-ivory/15 md:left-10 md:right-10 xl:left-14 xl:right-14"
        aria-hidden="true"
      >
        <span ref="bar" class="absolute inset-0 origin-left scale-x-0 bg-pink" />
      </div>
    </div>
  </section>
</template>

<style scoped>
  /* Pre-measure estimate; replaced by the exact inline height on mount. */
  .statement:not(.is-static) {
    height: 400svh;
  }

  /* Reduced motion: no pin, no pan. A big, stacked headline instead. */
  .statement.is-static {
    height: auto !important;
  }
  .is-static .frame {
    position: relative;
    height: auto;
    overflow: visible;
    padding: var(--section-y) 0;
  }
  .is-static .frame > p:first-child,
  .is-static .frame > div:last-child {
    display: none;
  }
  .is-static .track {
    width: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
    transform: none !important;
  }
  .is-static h2 {
    flex-direction: column;
    white-space: normal;
    font-size: clamp(64px, 13vw, 200px);
  }
  @media (prefers-reduced-motion: reduce) {
    .statement {
      height: auto !important;
    }
  }
</style>
