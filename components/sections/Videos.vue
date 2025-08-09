<script setup>
  import LiteYouTubeEmbed from 'vue-lite-youtube-embed';
  import 'vue-lite-youtube-embed/style.css';
</script>

<template>
  <section
    id="video-section"
    class="scroll-mt-[95px] py-14 md:py-20 bg-black border-t-8 border-pink"
  >
    <div class="container">
      <div class="mb-10 text-center">
        <h2
          class="relative z-10 mb-4 text-3xl font-extrabold text-white uppercase md:text-5xl font-mont"
        >
          Videos
        </h2>
        <p
          class="max-w-xl mx-auto text-base font-semibold tracking-wide uppercase text-pink md:text-lg font-barlow"
        >
          Experience the energy and excitement of our shows
        </p>
      </div>
      <LiteYouTubeEmbed id="JNdmXQs0MIM" title="Turn It Up! Promo 2024" />
    </div>
  </section>
</template>
