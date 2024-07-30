<script setup>
  /*
    meta
    */
  useHead({
    title: 'Turn It Up! | Boston, MA'
  });
</script>

<template>
  <div
    id="home"
    class="grid md:h-screen place-content-center md:pt-[57px] scroll-mt-[95px]"
  >
    <h1 class="text-white">NEW HOME</h1>
  </div>

  <!-- videos section -->
  <Videos />

  <!-- shows section -->
  <Shows />

  <!-- about section -->
  <About />

  <!-- social media (IG FEED) section -->
  <Social />

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
</style>
