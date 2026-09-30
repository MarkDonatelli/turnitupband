<script setup>
  import LiteYouTubeEmbed from 'vue-lite-youtube-embed';
  import 'vue-lite-youtube-embed/style.css';
</script>

<template>
  <section id="reel" class="scroll-mt-[95px] pb-16 md:pb-[120px]">
    <div class="container flex flex-col gap-7">
      <div class="flex items-end justify-between gap-6">
        <h2 class="font-serif text-[36px] md:text-[52px] leading-none">
          A whole night, <em>in three minutes.</em>
        </h2>
        <span class="hidden md:block text-[13px] uppercase tracking-[0.18em] text-muted2"
          >The reel</span
        >
      </div>
      <div class="overflow-hidden rounded-md bg-ink3">
        <LiteYouTubeEmbed id="JNdmXQs0MIM" title="Turn It Up! Promo 2024" />
      </div>
    </div>
  </section>
</template>
