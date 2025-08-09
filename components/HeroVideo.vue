<script setup>
  /*
  imports
  */
  import useScrollIntoView from '~/composables/useScrollIntoView';

  /*
  composables
   */
  const { scrollToElement } = useScrollIntoView();
</script>

<template>
  <div id="home" class="relative w-full overflow-hidden h-[650px] md:h-[900px]">
    <!-- Background video -->
    <video
      class="absolute top-0 left-0 z-0 object-cover w-full h-full pointer-events-none"
      autoplay
      muted
      loop
      playsinline
    >
      <source
        src="https://res.cloudinary.com/dpqslxpd6/video/upload/v1754691159/tiu-bernies_pgaoqn.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>

    <!-- Contrast overlay -->
    <div
      class="absolute inset-0 z-10 bg-gradient-to-b from-black/90 via-black/20 to-black/70"
    ></div>

    <!-- Content -->
    <div class="container h-full">
      <div
        class="relative z-20 flex items-end w-full h-full md:items-center md:pb-0"
      >
        <div class="max-w-2xl mb-10 text-white md:mb-0">
          <NuxtImg
            alt="TIU Logo"
            class="md:w-[200px] w-[100px]"
            height=""
            width=""
            src="/images/logo_cropped.png"
            format="webp"
          />

          <p class="mt-2 text-lg md:mt-4 md:text-xl text-white/90">
            Boston’s high-energy cover band bringing 90s to now. Clubs,
            weddings, casinos, and corporate events.
          </p>

          <div class="flex flex-wrap gap-3 mt-6">
            <button
              @click="scrollToElement('#shows')"
              class="inline-flex items-center px-6 py-3 rounded-full bg-[#F63D7A] text-black font-semibold hover:bg-black hover:text-white transition"
            >
              Upcoming Shows
            </button>
            <button
              @click="scrollToElement('#contact')"
              class="inline-flex items-center px-6 py-3 text-white transition border rounded-full border-white/50 hover:border-white"
            >
              Book the Band
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
