<script setup>
  /*
    meta
    */
  useHead({
    title: 'Turn It Up! | Boston, MA'
  });
</script>

<template>
  <!-- hero section -->
  <HeroVideo />

  <!--scrolling marquee -->
  <ScrollingMarquee />

  <!-- 2 cols band logo - image -->
  <LogoBand />

  <!-- videos section -->
  <Videos />

  <!-- shows section -->
  <Shows />

  <!-- about section -->
  <About />

  <!--parallax section -->
  <Parallax />

  <!-- hero section -->
  <Hero />

  <!-- songs section -->
  <Songs />

  <!-- contact section -->
  <Contact />
</template>

<style>
  /* .title, */
  .hero-fade-in {
    animation: fadeIn 2s ease-in forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 767px) {
    .title {
      font-size: 75px;
      padding-top: 100px;
    }
  }

  @media (max-width: 575px) {
    .title {
      font-size: 55px;
      padding-top: 100px;
      padding-bottom: 20px;
    }
  }

  @media (max-width: 475px) {
    .title {
      font-size: 50px;
      padding-top: 100px;
    }

    .mobile-text {
      font-size: 20px;
      line-height: 26px;
    }
  }

  @media (max-width: 375px) {
    .title {
      font-size: 40px;
      padding-top: 100px;
    }

    .mobile-text {
      font-size: 16px;
      line-height: 21px;
    }
  }

  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-marquee {
    animation: marquee 20s linear infinite;
  }
</style>
