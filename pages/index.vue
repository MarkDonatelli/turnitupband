<script setup>
  /*
    meta
    */
  useHead({
    title: 'Turn It Up! | Boston, MA'
  });
</script>

<template>
  <div id="home" class="grid md:h-screen md:pt-[57px] scroll-mt-[95px]">
    <div>
      <h1
        class="title md:pt-[35px] lg:pt-0 md:pb-0 font-bold text-center text-5xl md:text-[105px] text-white uppercase lg:text-[140px] leading-normal xl:text-[175px] whitespace-nowrap font-display tracking-tight"
      >
        Ready to

        <span class="relative font-extrabold text-pink">Turn It Up!?</span>
      </h1>
    </div>
    <div class="relative overflow-hidden">
      <NuxtImg
        class="absolute top-4 w-[150px] md:w-[200px] right-5 md:right-10 lg:w-[275px] lg:right-16"
        src="/images/bolt-pink--group.svg"
        width=""
        height=""
        alt=""
      />
      <NuxtImg
        class="object-cover w-full h-full overflow-hidden"
        src="/images/hero.jpg"
        width=""
        height=""
        alt=""
      />
    </div>
  </div>

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
</style>
