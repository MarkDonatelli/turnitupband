<script setup>
  import useScrollIntoView from '~/composables/useScrollIntoView';

  /*
  meta
  */
  useHead({
    title: 'Turn It Up! | Boston, MA'
  });

  /*
  composable
  */
  const { scrollToElement } = useScrollIntoView();

  const TIU = ref();

  onMounted(() => {
    gsap.to('.parallax', {
      scrollTrigger: {
        trigger: '.parallax',
        start: 'top bottom',
        end: 'top top',
        scrub: true
      },
      y: -100,
      ease: 'none'
    });

    // gsap.fromTo(
    //   TIU.value,
    //   { opacity: 0, y: 20 },
    //   { opacity: 1, y: 0, duration: 1 }
    // );
  });
</script>

<template>
  <div id="home" class="grid md:h-screen md:pt-[57px] scroll-mt-[95px]">
    <div ref="TIU">
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
      />
      <NuxtImg
        class="object-cover w-full h-full overflow-hidden"
        src="/images/hero.jpg"
      />
    </div>
  </div>

  <section id="shows" class="scroll-mt-[95px]">
    <div class="py-14 md:py-20">
      <div class="container">
        <div class="relative mb-10 text-center">
          <NuxtImg
            class="hidden md:block absolute w-full max-w-[250px] left-5 z-0"
            src="images/crosses.svg"
          />

          <div class="relative inline-block">
            <NuxtImg
              class="absolute block md:hidden max-w-[30px] top-0 w-full -left-6"
              src="images/cross-pink.svg"
            />
            <h2
              class="relative z-10 mb-3 text-4xl font-extrabold text-white md:text-5xl"
            >
              Upcoming Shows
            </h2>
          </div>

          <p class="text-lg font-semibold md:text-xl text-pink font-barlow">
            COME SEE US LIVE, IT'LL BE A GOOD TIME
          </p>
        </div>

        <!--shows list -->
        <ShowsList />
        <!--end shows list -->
      </div>
    </div>
  </section>

  <section id="about" class="scroll-mt-[95px]">
    <div class="py-14 md:py-20 bg-darkgray">
      <div class="container">
        <div class="mb-10 text-center md:relative">
          <NuxtImg
            class="hidden md:block absolute w-[250px] right-5 z-0"
            src="images/hearts-pink--group.svg"
          />

          <div class="relative inline-block">
            <NuxtImg
              class="md:hidden block absolute w-[65px] -right-[70px] -top-4 z-0"
              src="images/heart-pink.svg"
            />
            <h2
              class="z-10 mb-3 text-4xl font-extrabold text-white md:text-5xl"
            >
              About
            </h2>
          </div>

          <p
            class="mb-10 text-lg font-semibold uppercase md:text-xl text-pink font-barlow"
          >
            THIS IS TURN IT UP!
          </p>
          <About />
        </div>
      </div>
    </div>
  </section>

  <section id="social">
    <InstagramFeed />
  </section>

  <section>
    <div
      class="bg-cover lg:bg-no-repeat lg:bg-left lg:bg-fixed lg:bg-[url('/images/logo-parallax--pink.png')] bg-[url('/images/bg-splatter-pink.jpg')] pt-14 pb-20 lg:h-[500px]"
    >
      <div class="container h-full lg:parallax">
        <div
          class="grid items-center h-full lg:grid-cols-2 place-items-center place-content-center"
        >
          <div class="hidden lg:block"></div>
          <div class="text-white lg:hidden">
            <NuxtImg
              class="max-w-[275px] w-full mb-2"
              src="/images/logo-black--white.png"
            />
          </div>
          <div
            class="relative z-0 flex flex-col items-center text-center lg:text-left lg:items-start"
          >
            <h2
              class="text-2xl font-bold text-white uppercase stroke-2 xl:text-3xl font-mont whitespace-nowrap mobile-text"
            >
              Ready to
              <span>TURN IT UP!?</span>
              <br />
              Have a night to remember!?
              <br />
              What are you waiting for!?
            </h2>
            <button
              @click="scrollToElement('#contact')"
              class="relative p-5 mt-5 text-sm font-bold text-white uppercase transition-all duration-200 border lg:w-full hover:bg-white hover:text-pink font-mont"
            >
              Book Us Now!
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="hidden md:block">
    <div
      class="bg-cover md:bg-[100%] lg:bg-center md:bg-[url('/images/bob-kel--mic.jpg')] h-screen"
    >
      <div class="container h-full"></div>
    </div>
  </section>

  <section class="scroll-mt-[95px]" id="songs">
    <div class="py-14 md:py-20 bg-darkgray">
      <div class="container">
        <div class="mb-10 text-center md:relative">
          <NuxtImg
            class="hidden md:block absolute w-[250px] right-5 z-0"
            src="images/hearts-pink--group.svg"
          />

          <div class="relative inline-block">
            <NuxtImg
              class="md:hidden block absolute w-[65px] -right-[70px] -top-4 z-0"
              src="images/heart-pink.svg"
            />
            <h2
              class="z-10 mb-3 text-4xl font-extrabold text-white md:text-5xl"
            >
              Song List
            </h2>
          </div>

          <p
            class="text-lg font-semibold uppercase md:text-xl text-pink font-barlow"
          >
            Top 40, Dance, Pop/Rock anthems, 80's, and 90's hits!
          </p>

          <!-- songs list -->
          <SongsList />
          <!--end songs list -->
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="scroll-mt-[50px]">
    <div class="bg-black py-14 md:py-20">
      <div class="container">
        <div class="text-center md:relative">
          <NuxtImg
            class="hidden md:block absolute w-[250px] left-5 z-0"
            src="images/asterisk-pink--group.svg"
          />

          <div class="relative inline-block">
            <NuxtImg
              class="md:hidden block absolute w-[65px] -left-[70px] -top-4 z-0"
              src="images/asterisk-pink.svg"
            />
            <h2
              class="z-10 mb-3 text-4xl font-extrabold text-white md:text-5xl"
            >
              Contact
            </h2>
          </div>

          <p
            class="text-lg font-semibold uppercase md:text-xl text-pink font-barlow"
          >
            book us
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  </section>
</template>

<style>
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

  @media (max-width: 435px) {
    .title {
      font-size: 50px;
      padding-top: 100px;
    }
  }

  @media (max-width: 374px) {
    .title {
      font-size: 40px;
      padding-top: 100px;
    }
  }

  @media (max-width: 475px) {
    .mobile-text {
      font-size: 20px;
      line-height: 26px;
    }
  }

  @media (max-width: 375px) {
    .mobile-text {
      font-size: 16px;
      line-height: 21px;
    }
  }
</style>
