<script setup>
  // The Turn It Up M.O. Copy is the band's own words, kept verbatim.
  //
  // Motion, in two kinds:
  //  - Reveals: blocks marked data-reveal rise or unclip once as they enter.
  //  - The centerpiece: a pinned scene that steps from "blend in" (black and
  //    white, one line) to "stand out" (full colour, second line, then the
  //    supporting sentences). Steps are class changes, so the browser only
  //    animates opacity, transform and clip-path.
  // Without JS, or with reduced motion, everything is simply visible.
  import useScrollIntoView from '~/composables/useScrollIntoView';
  const { scrollToElement } = useScrollIntoView();

  const root = ref(null);
  const scene = ref(null);
  const animated = ref(false); // set on mount when motion is allowed
  const step = ref(0); // centerpiece: 0 blend in, 1 stand out, 2 supporting copy

  let io;
  let raf = 0;
  let mq;

  const measure = () => {
    raf = 0;
    const el = scene.value;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const travel = el.offsetHeight - window.innerHeight;
    const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 1;
    step.value = p > 0.58 ? 2 : p > 0.26 ? 1 : 0;
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(measure);
  };

  const enable = () => {
    animated.value = true;
    io = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }),
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
    );
    root.value.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    measure();
  };
  const disable = () => {
    animated.value = false;
    step.value = 2;
    io?.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
  const onMotionPref = () => (mq.matches ? disable() : enable());

  onMounted(() => {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', onMotionPref);
    onMotionPref();
  });
  onBeforeUnmount(() => {
    mq?.removeEventListener('change', onMotionPref);
    disable();
    cancelAnimationFrame(raf);
  });

  const toBand = e => {
    e.preventDefault();
    scrollToElement('#about');
  };
</script>

<template>
  <section
    id="mo"
    ref="root"
    class="mo section-y scroll-mt-[95px]"
    :class="{ 'is-animated': animated }"
    aria-labelledby="mo-title"
  >
    <!-- Opening: the chapter title, condensed and loud -->
    <div class="container">
      <header class="flex items-end justify-between gap-6 border-b border-ivory/15 pb-5 md:pb-7">
        <h2
          id="mo-title"
          data-reveal="mask"
          class="mask font-display font-black uppercase leading-[0.84] tracking-[-0.005em] text-[clamp(52px,10.5vw,168px)]"
        >
          <span class="mask-line">The Turn It Up <span class="text-pink">M.O.</span></span>
        </h2>
      </header>

      <!-- Act one: the edge -->
      <div class="mt-12 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-x-6">
        <p
          data-reveal="rise"
          class="rise font-serif text-[clamp(30px,4.4vw,64px)] leading-[1.08] tracking-[-0.01em] lg:col-span-8"
        >
          We bring a dynamic edge and a level of energy that slick, corporate-style function bands
          don’t bring.
        </p>
        <figure
          data-reveal="photo"
          class="photo ml-auto w-[62%] max-w-[300px] self-start sm:w-[44%] lg:col-span-3 lg:col-start-10 lg:ml-0 lg:mt-24 lg:w-full lg:max-w-none"
        >
          <div class="photo-frame aspect-[4/5]">
            <NuxtImg
              src="/images/mo/edge.jpg"
              alt="Turn It Up! guitarist mid-solo, shot from below"
              sizes="xs:62vw sm:44vw lg:25vw"
              width="864"
              height="1080"
              format="webp"
              loading="lazy"
              class="photo-img bw size-full object-cover"
            />
          </div>
        </figure>
      </div>

      <!-- Act two: the connection -->
      <div class="mt-14 grid items-center gap-10 md:mt-24 lg:grid-cols-12 lg:gap-x-6">
        <figure data-reveal="photo" class="photo w-[78%] max-w-[420px] lg:col-span-5 lg:w-full lg:max-w-none">
          <!-- 6:5 to match the group shot so all five members stay in frame -->
          <div class="photo-frame aspect-[6/5]">
            <NuxtImg
              src="/images/group-1.jpg"
              alt="The five members of Turn It Up! laughing together"
              sizes="xs:78vw sm:420px lg:40vw"
              width="3000"
              height="2483"
              format="webp"
              loading="lazy"
              class="photo-img bw size-full object-cover object-[50%_35%]"
            />
          </div>
        </figure>
        <p
          data-reveal="rise"
          class="rise max-w-[30ch] text-[19px] leading-[1.6] text-ivory/85 md:text-[22px] lg:col-span-5 lg:col-start-7 lg:max-w-none"
        >
          Our show is authentic, spontaneous, and passionate, while the band has a deep connection to
          the music, bringing a more contagious, high-octane atmosphere to the dance floor.
        </p>
      </div>
    </div>

    <!-- Centerpiece: blend in → stand out. Pinned on scroll, full-bleed. -->
    <div ref="scene" class="scene relative mt-20 md:mt-32" :class="`step-${step}`">
      <div class="scene-frame relative flex h-[100svh] min-h-[560px] items-end overflow-hidden lg:items-center">
        <div class="absolute inset-0" aria-hidden="true">
          <picture>
            <source media="(orientation: portrait)" srcset="/images/mo/standout-portrait.jpg" />
            <img src="/images/mo/standout.jpg" alt="" loading="lazy" class="scene-img absolute inset-0 size-full object-cover grayscale" />
          </picture>
          <picture>
            <source media="(orientation: portrait)" srcset="/images/mo/standout-portrait.jpg" />
            <img src="/images/mo/standout.jpg" alt="" loading="lazy" class="scene-color absolute inset-0 size-full object-cover" />
          </picture>
          <span class="scene-dim absolute inset-0 bg-ink" />
        </div>

        <div class="container relative z-10 pb-[12svh] lg:pb-0">
          <p class="scene-title font-serif leading-[0.92] tracking-[-0.02em] text-[clamp(48px,9.6vw,156px)]">
            <span class="line-a block">We’re not here<br />to blend in.</span>
            <span class="line-b mt-[0.18em] block">
              <span class="lm block"><span class="mask-line block">We’re here</span></span>
              <span class="lm block"><span class="mask-line block">to <em class="text-pink">stand out.</em></span></span>
            </span>
          </p>
          <p
            class="scene-copy mt-8 max-w-[34ch] text-[17px] leading-[1.6] text-ivory md:mt-10 md:text-[20px] lg:ml-auto lg:mr-[4%]"
          >
            Not a human jukebox playing note for note. We will give your event a distinct personality
            and a wow factor guests remember.
          </p>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Bridge into the band -->
      <div class="mt-12 flex justify-end border-t border-ivory/15 pt-5 md:mt-16">
        <a
          href="#about"
          class="group inline-flex min-h-[44px] items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
          @click="toBand"
        >
          Meet the band
          <span class="text-pink transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .mo {
    --ease: cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* --- Static (default, no-JS, reduced motion): everything visible --- */
  .photo-frame {
    position: relative;
    overflow: hidden;
    background: #1a1920;
  }
  .bw {
    filter: grayscale(1) contrast(1.12);
  }
  .scene-dim {
    opacity: 0.55;
  }
  .mask {
    overflow: hidden;
    padding-bottom: 0.06em;
    margin-bottom: -0.06em;
  }
  .mask-line {
    display: block;
  }

  /* --- Reveals (only once motion is enabled) --- */
  .is-animated .mask .mask-line {
    transform: translateY(105%);
    transition: transform 1.2s var(--ease);
  }
  .is-animated .mask.is-in .mask-line {
    transform: none;
  }

  .is-animated .rise {
    opacity: 0;
    transform: translateY(32px);
    transition:
      opacity 1s ease,
      transform 1.2s var(--ease);
  }
  .is-animated .rise.is-in {
    opacity: 1;
    transform: none;
  }

  .is-animated .photo .photo-frame {
    clip-path: inset(100% 0 0 0);
    transition: clip-path 1.3s var(--ease);
  }
  .is-animated .photo .photo-img {
    transform: scale(1.14);
    transition: transform 1.8s var(--ease);
  }
  .is-animated .photo.is-in .photo-frame {
    clip-path: inset(0 0 0 0);
  }
  .is-animated .photo.is-in .photo-img {
    transform: none;
  }

  /* --- Centerpiece --- */
  .is-animated .scene {
    height: 260svh; /* the pinned frame holds while the steps play */
  }
  .is-animated .scene-frame {
    position: sticky;
    top: 0;
  }
  .scene-color {
    opacity: 1;
  }
  .is-animated .scene-color {
    opacity: 0;
    transition: opacity 1.4s ease;
  }
  .is-animated .scene-dim {
    opacity: 0.7;
    transition: opacity 1.4s ease;
  }
  .is-animated .line-a {
    transition: opacity 0.9s ease;
  }
  .is-animated .line-b .lm {
    overflow: hidden;
    padding-bottom: 0.1em;
    margin-bottom: -0.1em;
  }
  .is-animated .line-b .mask-line {
    transform: translateY(108%);
    transition: transform 1.1s var(--ease);
  }
  .is-animated .line-b .lm + .lm .mask-line {
    transition-delay: 0.08s;
  }
  .is-animated .scene-copy {
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity 0.9s ease,
      transform 1.1s var(--ease);
  }

  /* Step 1: stand out. Colour arrives, the second line rises, the first recedes. */
  .is-animated .step-1 .scene-color,
  .is-animated .step-2 .scene-color {
    opacity: 1;
  }
  .is-animated .step-1 .scene-dim,
  .is-animated .step-2 .scene-dim {
    opacity: 0.5;
  }
  .is-animated .step-1 .line-a,
  .is-animated .step-2 .line-a {
    opacity: 0.5;
  }
  .is-animated .step-1 .line-b .mask-line,
  .is-animated .step-2 .line-b .mask-line {
    transform: none;
  }
  /* Step 2: the supporting sentences. */
  .is-animated .step-2 .scene-copy {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .scene {
      height: auto !important;
    }
    .scene-frame {
      position: relative !important;
    }
  }
</style>
