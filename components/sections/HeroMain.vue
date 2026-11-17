<script setup>
  import useScrollIntoView from '~/composables/useScrollIntoView';
  import { useMobileMenuStore } from '~/store/mobileMenu';

  const { scrollToElement } = useScrollIntoView();
  const menu = useMobileMenuStore();

  // The poster is the first paint (and the LCP element); the matching frame
  // of the loop takes over once it is actually playing.
  useHead({
    link: [
      { rel: 'preload', as: 'image', href: '/images/hero-poster.jpg', media: '(orientation: landscape)', fetchpriority: 'high' },
      { rel: 'preload', as: 'image', href: '/images/hero-poster-portrait.jpg', media: '(orientation: portrait)', fetchpriority: 'high' }
    ]
  });

  const video = ref(null);
  const root = ref(null);
  const ready = ref(false); // a frame is decoded, so the video can cover the poster
  const playing = ref(false);
  const hasVideo = ref(false); // false: Save-Data, so the control is hidden too
  let userPaused = false;
  let inView = true;
  let io;

  const play = () => {
    const v = video.value;
    if (!v || userPaused || !inView || menu.isOpen) return;
    v.muted = true; // set as a property: the SSR attribute alone isn't reliable on iOS
    v.play().catch(() => {
      // Autoplay refused (low-power mode, browser policy): keep the poster
      // and let the visible Play control start it.
      userPaused = true;
      playing.value = false;
    });
  };
  const pause = () => video.value?.pause();

  const toggle = () => {
    if (playing.value) {
      userPaused = true;
      pause();
    } else {
      userPaused = false;
      play();
    }
  };

  onMounted(() => {
    const v = video.value;
    if (navigator.connection?.saveData) return;
    hasVideo.value = true;

    v.addEventListener('loadeddata', () => (ready.value = true));
    v.addEventListener('playing', () => (playing.value = true));
    v.addEventListener('pause', () => (playing.value = false));
    if (v.readyState >= 2) ready.value = true;
    // Background tabs may refuse to start playback; try again on return.
    document.addEventListener('visibilitychange', onVisible);

    // Respect reduced motion: show the still, offer Play.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      userPaused = true;
      return;
    }

    // Only decode while the hero is on screen.
    io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      inView ? play() : pause();
    });
    // Start fetching the loop only after the page has loaded, so it never
    // competes with the poster, fonts and scripts.
    const start = () => {
      io.observe(root.value);
      play();
    };
    document.readyState === 'complete' ? start() : window.addEventListener('load', start, { once: true });
  });
  const onVisible = () => !document.hidden && play();
  onBeforeUnmount(() => {
    io?.disconnect();
    document.removeEventListener('visibilitychange', onVisible);
  });

  // Nothing to watch behind the full-screen menu.
  watch(
    () => menu.isOpen,
    open => (open ? pause() : play())
  );

  const toNext = e => {
    e.preventDefault();
    scrollToElement('#statement');
  };
</script>

<template>
  <section id="home" ref="root" class="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink">
    <!-- Footage: edge to edge, natural colour, one even dim for legibility -->
    <div class="absolute inset-0" aria-hidden="true">
      <picture>
        <source media="(orientation: portrait)" srcset="/images/hero-poster-portrait.jpg" width="540" height="960" />
        <img
          src="/images/hero-poster.jpg"
          alt=""
          width="1280"
          height="720"
          fetchpriority="high"
          class="absolute inset-0 size-full object-cover"
        />
      </picture>
      <video
        ref="video"
        class="absolute inset-0 size-full object-cover transition-opacity duration-700"
        :class="ready ? 'opacity-100' : 'opacity-0'"
        muted
        loop
        playsinline
        preload="none"
        disablepictureinpicture
        disableremoteplayback
        tabindex="-1"
      >
        <source src="/videos/hero-loop-portrait.mp4" type="video/mp4" media="(orientation: portrait)" />
        <source src="/videos/hero-loop.mp4" type="video/mp4" />
      </video>
      <span class="absolute inset-0 bg-ink/45" />
      <!-- Legibility only: under the nav, and where the footage meets the page -->
      <span class="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/55 to-transparent" />
      <span class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
    </div>

    <!-- Logo centerpiece, sitting just below the vertical midpoint -->
    <div class="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-[9svh] text-center">
      <h1 class="hero-logo w-[min(80vw,44svh)] md:w-[min(48vw,50svh)] xl:w-[min(580px,52svh)]">
        <EqBurst
          fluid
          logo="/images/tiu_newpink.svg"
          logo-alt="Turn It Up!"
          logo-class="drop-shadow-[0_12px_32px_rgba(0,0,0,.45)]"
        />
      </h1>

      <div class="hero-copy mt-3 flex flex-col items-center gap-2.5 md:mt-5 md:gap-3">
        <p class="text-[11px] font-semibold uppercase tracking-[0.3em] text-ivory md:text-[13px]">
          Boston’s high-energy live band
        </p>
        <p class="max-w-[22ch] font-serif text-[19px] italic leading-snug text-ivory/80 md:max-w-none md:text-[22px]">
          From packed clubs to unforgettable celebrations.
        </p>
      </div>
    </div>

    <!-- Scroll cue -->
    <a
      href="#statement"
      class="hero-scroll absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-ivory/70 transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink md:bottom-8"
      @click="toNext"
    >
      Scroll
      <span class="relative block h-10 w-px overflow-hidden bg-ivory/25" aria-hidden="true">
        <span class="scroll-tick absolute inset-x-0 top-0 h-1/2 bg-pink" />
      </span>
    </a>

    <!-- Pause control (WCAG 2.2.2): looping motion must be stoppable -->
    <button
      v-if="hasVideo"
      type="button"
      class="hero-scroll absolute bottom-6 right-[22px] z-10 inline-flex min-h-[44px] items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-ivory/70 transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink md:bottom-8 md:right-10 xl:right-14"
      :aria-label="playing ? 'Pause background video' : 'Play background video'"
      @click="toggle"
    >
      <span class="flex size-3 items-center justify-center gap-[3px]" aria-hidden="true">
        <template v-if="playing">
          <span class="h-3 w-[2px] bg-current" /><span class="h-3 w-[2px] bg-current" />
        </template>
        <svg v-else viewBox="0 0 12 12" class="size-3 fill-current"><path d="M2 1v10l9-5z" /></svg>
      </span>
      <span aria-hidden="true">{{ playing ? 'Pause' : 'Play' }}</span>
    </button>
  </section>
</template>

<style scoped>
  /* Sequence: footage (immediate) → nav (0.3s, Header) → logo → copy → cue. */
  .hero-logo {
    animation: heroLogo 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both;
  }
  @keyframes heroLogo {
    from {
      opacity: 0;
      scale: 0.96;
    }
  }

  .hero-copy {
    animation: heroRise 1.1s cubic-bezier(0.22, 1, 0.36, 1) 1.35s both;
  }
  @keyframes heroRise {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }

  .hero-scroll {
    animation: heroFade 1s ease 2s both;
  }
  @keyframes heroFade {
    from {
      opacity: 0;
    }
  }

  .scroll-tick {
    transform: translateY(-100%);
    animation: scrollTick 2.4s cubic-bezier(0.65, 0, 0.35, 1) 2.6s infinite;
  }
  @keyframes scrollTick {
    0% {
      transform: translateY(-100%);
    }
    60%,
    100% {
      transform: translateY(200%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-logo,
    .hero-copy,
    .hero-scroll {
      animation: none;
    }
    .scroll-tick {
      animation: none;
      transform: none;
    }
  }
</style>
