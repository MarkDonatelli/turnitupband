<script setup>
  /*
    composable
    */
  const { scrollToElement } = useScrollIntoView();

  onMounted(() => {
    const parallax = document.querySelector('.parallax');
    if (parallax) {
      gsap.to(parallax, {
        scrollTrigger: {
          trigger: '.parallax',
          start: 'top bottom',
          end: 'top top',
          scrub: true
        },
        y: -100,
        ease: 'none'
      });
    }
  });
</script>

<template>
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
              height=""
              width=""
              alt=""
              loading="lazy"
              format="webp"
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
</template>
