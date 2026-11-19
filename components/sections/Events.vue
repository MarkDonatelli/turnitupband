<script setup>
  // AVIF versions of the large photos (same sizes and crops; WebP stays the fallback).
  const weddingAvif = useAvifSource('/images/wedding-group.jpeg', { sizes: 'xs:88vw lg:48vw xl:600px', width: 864, height: 1259 });
  const corporateAvif = useAvifSource('/images/servicenowgig.png', { sizes: 'xs:100vw lg:84vw xl:1000px', width: 1448, height: 1086 });

  // Three rooms, three different shapes on the page: a portrait feature
  // (weddings), a captioned panorama (corporate), a small close-up (parties).
  // Photos are the band's own: the band at a real wedding, and a real
  // ServiceNow gig for the corporate panorama.
  import useScrollIntoView from '~/composables/useScrollIntoView';
  const { scrollToElement } = useScrollIntoView();

  // Each link opens the booking form with its own event type chosen
  // (labels match ContactForm's chips).
  const eventType = useState('contact-event-type', () => 'Wedding');
  const toContact = (e, type) => {
    e.preventDefault();
    eventType.value = type;
    scrollToElement('#contact');
  };

  // Text rises out of a clipping mask. Once every transition inside has
  // finished, the clip comes off so descenders (g, y, p) are never cut at rest.
  const unclipWhenSettled = el =>
    requestAnimationFrame(() =>
      Promise.all(el.getAnimations({ subtree: true }).map(a => a.finished))
        .catch(() => {})
        .then(() => el.classList.add('is-done'))
    );

  // Reveals: one entrance for the photos, one for the text. Without JS or
  // with reduced motion, everything is simply visible.
  const root = ref(null);
  const animated = ref(false);
  let io;
  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    animated.value = true;
    io = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          unclipWhenSettled(e.target);
          io.unobserve(e.target);
        }),
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    root.value.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  });
  onBeforeUnmount(() => io?.disconnect());

  const link =
    'group/link mt-1 inline-flex min-h-[44px] items-center gap-3 self-start text-[12px] font-semibold uppercase tracking-[0.22em] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink';
</script>

<template>
  <section
    id="events"
    ref="root"
    class="events section-y scroll-mt-[95px] bg-ivory text-ink"
    :class="{ 'is-animated': animated }"
    aria-labelledby="events-title"
  >
    <div class="container">
      <!-- Header: confident, not enormous; the photographs carry this page -->
      <header class="grid gap-6 md:gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <div class="lg:col-span-7">
          <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone md:text-[12px]">Private events</p>
          <h2
            id="events-title"
            data-reveal
            class="title mt-4 font-serif text-[46px] leading-[0.98] tracking-[-0.015em] md:text-[68px] xl:text-[84px]"
          >
            <span class="t-mask"><span class="t-line">From first dance</span></span>
            <span class="t-mask"><span class="t-line"><em class="text-pink-deep">to last call.</em></span></span>
          </h2>
        </div>
        <p class="max-w-[38ch] text-base leading-relaxed text-ink/75 md:text-[17px] lg:col-span-4 lg:col-start-9 lg:pb-2">
          The same band, set up differently for each room. Ceremony-quiet at 6, a full floor by 9.
          Volume, set list and stage presence are tuned to your crowd.
        </p>
      </header>

      <!-- Weddings: the portrait feature -->
      <article class="mt-14 grid gap-7 md:mt-20 lg:grid-cols-12 lg:items-center lg:gap-x-6" aria-labelledby="ev-weddings">
        <figure data-reveal class="rise-photo w-[88%] lg:col-span-6 lg:w-full">
          <div class="frame aspect-[4/5]">
            <picture class="contents">
              <source type="image/avif" :srcset="weddingAvif.srcset" :sizes="weddingAvif.sizes" />
              <NuxtImg
                src="/images/wedding-group.jpeg"
                alt="The five members of Turn It Up!, dressed up and smiling on stage under a wedding tent"
                sizes="xs:88vw lg:48vw xl:600px"
                width="864"
                height="1259"
                format="webp"
                loading="lazy"
                class="img size-full object-cover object-bottom"
              />
            </picture>
          </div>
        </figure>
        <div data-reveal class="copy flex flex-col gap-4 lg:col-span-5 lg:col-start-8">
          <h3 id="ev-weddings" class="font-serif text-[38px] leading-none md:text-[48px] xl:text-[56px]">Weddings</h3>
          <p class="max-w-[36ch] text-[17px] leading-relaxed text-ink/75 md:text-[18px]">
            Your first dance learned, your timeline respected, your grandparents and college friends
            on the same floor.
          </p>
          <a href="#contact" :class="link" @click="toContact($event, 'Wedding')">
            <span class="u">Ask about your wedding</span>
            <span class="arrow text-pink-deep" aria-hidden="true">→</span>
          </a>
        </div>
      </article>

      <!-- Corporate & galas: a caption band over a wide panorama -->
      <article class="mt-20 md:mt-28 lg:ml-[calc((100%_+_1.5rem)/6)]" aria-labelledby="ev-corporate">
        <div
          data-reveal
          class="copy grid gap-4 border-t border-ink/15 pt-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-baseline lg:gap-x-10"
        >
          <h3 id="ev-corporate" class="font-serif text-[30px] leading-none md:text-[36px]">
            Corporate <span class="italic">&amp;</span> galas
          </h3>
          <p class="max-w-[48ch] text-base leading-relaxed text-ink/75 md:text-[17px]">
            Holiday parties, launches and fundraisers. Clean sets, on-time changeovers, and a band that
            follows the run of show.
          </p>
          <a href="#contact" :class="link" @click="toContact($event, 'Corporate')">
            <span class="u">Ask about your event</span>
            <span class="arrow text-pink-deep" aria-hidden="true">→</span>
          </a>
        </div>
        <figure data-reveal class="rise-photo -mx-[1.375rem] mt-6 md:mx-0 md:mt-8">
          <div class="frame aspect-[4/3] md:aspect-[2/1]">
            <picture class="contents">
              <source type="image/avif" :srcset="corporateAvif.srcset" :sizes="corporateAvif.sizes" />
              <NuxtImg
                src="/images/servicenowgig.png"
                alt="Turn It Up! stage set for a corporate event at ServiceNow in Boston, with the band's banners either side of the screen"
                sizes="xs:100vw lg:84vw xl:1000px"
                width="1448"
                height="1086"
                format="webp"
                loading="lazy"
                class="pano size-full object-cover object-[50%_55%]"
              />
            </picture>
          </div>
        </figure>
      </article>

      <!-- Private parties: small, close, a little cheeky -->
      <article
        class="relative mt-14 grid gap-7 md:mt-0 lg:grid-cols-12 lg:items-start lg:gap-x-6"
        aria-labelledby="ev-parties"
      >
        <figure
          data-reveal
          class="rise-photo ml-auto w-[54%] max-w-[360px] md:-mt-10 md:ml-10 md:mr-auto md:w-[30%] lg:col-span-3 lg:col-start-1 lg:-mt-24 lg:ml-0 lg:w-full lg:max-w-none"
        >
          <div class="frame aspect-square">
            <NuxtImg
              src="/images/private-party-nh.jpg"
              alt="Turn It Up! on stage with guests at a private party in New Hampshire"
              sizes="xs:54vw md:30vw lg:24vw xl:300px"
              width="1000"
              height="1000"
              format="webp"
              loading="lazy"
              class="img size-full object-cover"
            />
          </div>
        </figure>
        <div data-reveal class="copy flex flex-col gap-4 lg:col-span-5 lg:col-start-6 lg:pt-14">
          <h3 id="ev-parties" class="font-serif text-[38px] leading-none md:text-[48px]">
            Private parties
          </h3>
          <p class="max-w-[38ch] text-[17px] leading-relaxed text-ink/75 md:text-[18px]">
            Milestone birthdays, reunions and backyard blowouts. Your guest list, your must-plays, a real
            dance floor.
          </p>
          <a href="#contact" :class="link" @click="toContact($event, 'Private party')">
            <span class="u">Ask about your party</span>
            <span class="arrow text-pink-deep" aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
  .events {
    --ease: var(--ease-out);
  }
  .frame {
    position: relative;
    overflow: hidden;
    background: #e6dfd4;
  }
  /* Room below the line for descenders; the clip only exists mid-reveal. */
  .t-mask {
    display: block;
    padding-bottom: 0.3em;
    margin-bottom: -0.3em;
  }
  .is-animated .title:not(.is-done) .t-mask {
    overflow: hidden;
  }
  .t-line {
    display: block;
  }

  /* Links: ink text, a pink rule that fills in, an arrow that leans forward. */
  .u {
    background-image: linear-gradient(#e6007e, #e6007e);
    background-position: 0 100%;
    background-repeat: no-repeat;
    background-size: 100% 1px;
    padding-bottom: 3px;
    transition: background-size 0.4s var(--ease);
  }
  .group\/link:hover .u,
  .group\/link:focus-visible .u {
    background-size: 100% 2px;
  }
  .arrow {
    display: inline-block;
    transition: transform 0.4s var(--ease);
  }
  .group\/link:hover .arrow,
  .group\/link:focus-visible .arrow {
    transform: translateX(5px);
  }

  /* --- Entrances (only once motion is enabled) --- */

  /* Title: two lines rise out of their masks. */
  .is-animated .title .t-line {
    transform: translateY(calc(105% + 0.3em));
    transition: transform 0.8s var(--ease);
  }
  .is-animated .title .t-mask + .t-mask .t-line {
    transition-delay: 0.1s;
  }
  .is-animated .title.is-in .t-line {
    transform: none;
  }

  /* Copy blocks: a short, quiet rise. */
  .is-animated .copy {
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.6s ease 0.1s,
      transform 0.8s var(--ease) 0.1s;
  }
  .is-animated .copy.is-in {
    opacity: 1;
    transform: none;
  }

  /* Photos: each opens upward and settles. */
  .is-animated .rise-photo .frame {
    clip-path: inset(100% 0 0 0);
    transition: clip-path 0.9s var(--ease);
  }
  .is-animated .rise-photo .img {
    transform: scale(1.04);
    transition: transform 1.1s var(--ease);
  }
  .is-animated .rise-photo.is-in .frame {
    clip-path: inset(0 0 0 0);
  }
  .is-animated .rise-photo.is-in .img {
    transform: none;
  }

  /* The panorama drifts a little as it passes, where the browser can tie
     animation to scroll natively. Elsewhere it simply sits still. */
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .pano {
        animation: drift linear both;
        animation-timeline: view();
        animation-range: entry 0% exit 100%;
      }
      @keyframes drift {
        from {
          transform: scale(1.08) translateX(2%);
        }
        to {
          transform: scale(1.08) translateX(-2%);
        }
      }
    }
  }
</style>
