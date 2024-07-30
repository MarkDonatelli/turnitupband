<script setup></script>

<template>
  <section class="scroll-mt-[95px]" id="songs">
    <div class="py-14 md:py-20 bg-darkgray">
      <div class="container">
        <div class="mb-10 text-center md:relative">
          <NuxtImg
            loading="lazy"
            class="hidden md:block absolute w-[250px] right-5 z-0"
            src="images/hearts-pink--group.svg"
            width=""
            height=""
            alt=""
          />

          <div class="relative inline-block">
            <NuxtImg
              loading="lazy"
              class="md:hidden block absolute w-[65px] right-[30px] -top-4 z-0"
              src="images/heart-pink.svg"
              width=""
              height=""
              alt=""
            />

            <div class="">
              <h2
                class="relative z-10 mb-3 text-4xl font-extrabold text-white md:text-5xl trigger"
              >
                Song List
              </h2>
              <p
                class="text-lg font-semibold uppercase md:text-xl text-pink font-barlow"
              >
                Top 40, Dance, Pop/Rock anthems, 80's, and 90's hits!
              </p>
            </div>
          </div>

          <!-- songs list -->
          <SongsList />
          <!--end songs list -->
        </div>
      </div>
    </div>
  </section>
</template>
