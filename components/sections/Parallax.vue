<script setup>
  import useScrollIntoView from '~/composables/useScrollIntoView';
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
              class="group inline-flex items-center mt-5 justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-full bg-[#F63D7A] text-black font-semibold uppercase tracking-wide shadow-md hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F63D7A] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Book Us Now!
              <svg
                class="size-4 transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M12.293 4.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L14.586 10H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
