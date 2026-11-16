<script setup>
  // Custom poster with a live shot instead of YouTube's logo thumbnail.
  // The iframe only loads (and autoplays) once someone presses play.
  const videoId = 'JNdmXQs0MIM';
  const playing = ref(false);
</script>

<template>
  <section id="reel" class="section-y scroll-mt-[95px]">
    <div class="container flex flex-col gap-8 md:gap-12">
      <h2 class="font-serif text-[44px] leading-[0.95] tracking-[-0.01em] md:text-[72px] xl:text-[88px]">
        Don’t take our word <em class="text-pink">for it.</em>
      </h2>

      <div class="relative aspect-video overflow-hidden rounded-md bg-ink3">
        <iframe
          v-if="playing"
          class="absolute inset-0 size-full"
          :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`"
          title="Turn It Up! live reel"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />

        <button
          v-else
          type="button"
          class="poster group absolute inset-0 size-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
          aria-label="Play the Turn It Up! live reel"
          @click="playing = true"
        >
          <NuxtImg
            src="/images/reel-live.jpg"
            alt=""
            sizes="100vw xl:1136px"
            format="webp"
            loading="lazy"
            class="poster-img absolute inset-0 size-full object-cover object-[60%_40%]"
          />
          <span class="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/20" aria-hidden="true" />

          <!-- Play button -->
          <span
            class="absolute left-1/2 top-1/2 grid size-[72px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-pink text-ink shadow-[0_18px_50px_-12px_rgba(255,46,138,.75)] transition-transform duration-500 ease-out group-hover:scale-110 md:size-[104px]"
            aria-hidden="true"
          >
            <span class="ring absolute inset-0 rounded-full border border-pink" />
            <svg class="ml-1 size-6 md:size-8" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
          </span>

          <span
            class="absolute bottom-4 left-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory md:bottom-7 md:left-8 md:text-xs"
          >
            Watch it live
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .poster-img {
    filter: saturate(0.85) contrast(1.05) brightness(0.85);
    transition:
      transform 1.2s cubic-bezier(0.2, 0.7, 0.2, 1),
      filter 0.6s ease;
  }
  .poster:hover .poster-img {
    transform: scale(1.03);
    filter: saturate(1) contrast(1.05) brightness(0.95);
  }

  .ring {
    animation: reelPing 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  @keyframes reelPing {
    0% { transform: scale(1); opacity: 0.7; }
    80%, 100% { transform: scale(1.6); opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ring { animation: none; opacity: 0; }
    .poster-img { transition: none; }
  }
</style>
