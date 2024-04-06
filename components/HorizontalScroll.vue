<script setup></script>
<template>
  <div id="sectionPin">
    <div class="pin-wrap-sticky">
      <div class="flex items-center h-full pin-wrap">
        <div class="flex items-center gap-20">
          <div
            class="pl-20 text-lg font-extrabold font-display text-white mt-9 font-mont max-w-[50%]"
          >
            <p>
              TURN IT UP! is a Boston area high energy band, covering all of you
              favorite hits from 90's to now (and then some), comprised of
              experienced musicians/performers all with one goal: TO BRING THE
              PARTY!!!
            </p>
            <p>
              From bars/clubs to corporate events, weddings, house parties,
              casinos and beyond, reach out and let us know where YOU want to
              see us next.
            </p>
          </div>

          <div class="flex flex-col-reverse items-center gap-10">
            <p class="text-white max-w-[300px]">Mark</p>
            <div class="pt-[100px]">
              <NuxtImg
                loading="lazy"
                class=""
                src="images/mark.jpeg"
                width=""
                height=""
                alt=""
              />
            </div>
          </div>
          <div class="flex flex-col-reverse items-center gap-10">
            <p class="text-white max-w-[300px]">Mark</p>
            <div class="pt-[100px]">
              <NuxtImg
                loading="lazy"
                class=""
                src="images/mark.jpeg"
                width=""
                height=""
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @keyframes move {
    to {
      /* Move horizontally so that right edge is aligned against the viewport */
      transform: translateX(calc(-100% + 100vw));
    }
  }

  #sectionPin {
    /* Stretch it out, so that we create room for the horizontal scroll animation */
    height: 500vh;
    overflow: visible; /* To make position sticky work … */

    view-timeline-name: --section-pin-tl;
    view-timeline-axis: block;
  }

  .pin-wrap-sticky {
    /* Stick to Top */
    height: 100vh;
    width: 100vw;
    position: sticky;
    top: 0;

    width: 100vw;
    overflow-x: hidden;
  }

  .pin-wrap {
    width: 250vmax;

    /* Hook animation */
    will-change: transform;
    animation: linear move forwards;

    /* Link animation to view-timeline */
    animation-timeline: --section-pin-tl;
    animation-range: contain 0% contain 100%;
  }
</style>
