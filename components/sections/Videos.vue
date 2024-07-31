<script setup>
  import LiteYouTubeEmbed from 'vue-lite-youtube-embed';
  import 'vue-lite-youtube-embed/style.css';
</script>

<template>
  <section
    id="video-section"
    class="scroll-mt-[95px] py-14 md:py-20 bg-darkgray"
  >
    <div class="container">
      <div class="mb-10 text-center">
        <h2
          class="relative z-10 mb-3 text-4xl font-extrabold text-white md:text-5xl"
        >
          Videos
        </h2>
        <p
          class="text-lg font-semibold uppercase md:text-xl text-pink font-barlow"
        >
          Experience the energy and excitement of our shows!
        </p>
      </div>
      <LiteYouTubeEmbed id="JNdmXQs0MIM" title="Turn It Up! Promo 2024" />
    </div>
  </section>
</template>
