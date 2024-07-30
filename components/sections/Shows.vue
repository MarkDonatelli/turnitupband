<script setup></script>

<template>
  <section id="shows" class="scroll-mt-[95px]">
    <div class="py-14 md:py-20">
      <div class="container">
        <div class="relative mb-10 text-center">
          <NuxtImg
            loading="lazy"
            class="hidden md:block absolute w-full max-w-[250px] left-5 z-0"
            src="images/crosses.svg"
            width=""
            height=""
            alt=""
          />

          <div class="relative inline-block">
            <NuxtImg
              loading="lazy"
              class="absolute block md:hidden max-w-[30px] top-0 w-full -left-6"
              src="images/cross-pink.svg"
              width=""
              height=""
              alt=""
            />

            <div class="animate-shows">
              <h2
                class="relative z-10 mb-3 text-4xl font-extrabold text-white md:text-5xl"
              >
                Upcoming Shows
              </h2>

              <p
                class="text-lg font-semibold uppercase md:text-xl text-pink font-barlow"
              >
                We bring the party, you bring the noise!
              </p>
            </div>
          </div>
        </div>

        <!--shows list -->
        <ShowsList />
        <!--end shows list -->
      </div>
    </div>
  </section>
</template>
