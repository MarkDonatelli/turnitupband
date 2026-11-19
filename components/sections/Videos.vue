<script setup>
  // Custom poster with a live shot instead of YouTube's logo thumbnail.
  // Nothing from YouTube loads until someone presses play; then the
  // privacy-enhanced player takes the poster's place, starts, and receives
  // focus so keyboard and screen-reader users land in its controls.
  const videoId = 'JNdmXQs0MIM';
  const playing = ref(false);
  const player = ref(null);

  const play = async () => {
    playing.value = true;
    await nextTick();
    player.value?.focus();
  };
</script>

<template>
  <section id="reel" class="section-y scroll-mt-[95px]" aria-labelledby="reel-title">
    <!-- Wider editorial measure than the text container, aligned to the nav edges -->
    <div class="px-[22px] md:px-10 xl:px-14">
      <div class="mx-auto flex max-w-[1340px] flex-col gap-6 md:gap-8">
        <h2
          id="reel-title"
          class="font-serif text-[44px] leading-[0.95] tracking-[-0.01em] md:text-[72px] xl:text-[88px]"
        >
          Don’t take our word for it.
        </h2>

        <div class="relative -mx-[22px] aspect-video overflow-hidden bg-ink3 md:mx-0 md:rounded-md">
          <iframe
            v-if="playing"
            ref="player"
            class="absolute inset-0 size-full"
            :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`"
            title="Turn It Up! live reel (YouTube video player)"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />

          <button
            v-else
            type="button"
            class="poster group absolute inset-0 size-full text-left focus-visible:outline-none"
            @click="play"
          >
            <NuxtImg
              src="/images/reel-poster.jpg"
              alt=""
              sizes="xs:100vw xl:1340px"
              width="1300"
              height="731"
              format="webp"
              loading="lazy"
              class="poster-img absolute inset-0 size-full object-cover object-[60%_45%]"
            />
            <span class="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/20" aria-hidden="true" />

            <!-- Play button: eases up on hover/focus, the icon leans forward -->
            <span
              class="play absolute left-1/2 top-1/2 grid size-[80px] place-items-center rounded-full bg-pink text-ink shadow-[0_18px_50px_-12px_rgba(255,46,138,.75)] md:size-[104px]"
              aria-hidden="true"
            >
              <svg class="icon ml-1 size-7 md:size-8" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
            </span>

            <span
              class="absolute bottom-4 left-[22px] text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory md:bottom-7 md:left-8 md:text-xs"
            >
              <span class="sr-only">Play video: </span>Watch it live
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .poster {
    --ease: cubic-bezier(0.22, 1, 0.36, 1);
  }
  .poster-img {
    filter: saturate(0.85) contrast(1.05) brightness(0.85);
    transition:
      transform 1.2s var(--ease),
      filter 0.6s ease;
  }
  .play {
    transform: translate(-50%, -50%);
    transition:
      transform 0.6s var(--ease),
      box-shadow 0.6s var(--ease);
  }
  .icon {
    transition: transform 0.6s var(--ease);
  }

  .poster:hover .poster-img,
  .poster:focus-visible .poster-img {
    transform: scale(1.03);
    filter: saturate(1) contrast(1.05) brightness(0.95);
  }
  .poster:hover .play,
  .poster:focus-visible .play {
    transform: translate(-50%, -50%) scale(1.06);
    box-shadow: 0 22px 56px -14px rgba(255, 46, 138, 0.8);
  }
  .poster:hover .icon,
  .poster:focus-visible .icon {
    transform: translateX(3px);
  }
  /* Keyboard focus: a crisp ring around the play button itself. */
  .poster:focus-visible .play {
    outline: 2px solid #f3eee6;
    outline-offset: 6px;
  }

  @media (prefers-reduced-motion: reduce) {
    .poster-img,
    .play,
    .icon {
      transition: none;
    }
  }
</style>
