<script setup></script>

<template>
  <section id="contact" class="scroll-mt-[50px]">
    <div class="bg-black py-14 md:py-20">
      <div class="container">
        <div class="text-center md:relative">
          <NuxtImg
            loading="lazy"
            class="hidden md:block absolute w-[250px] left-5 z-0"
            src="images/asterisk-pink--group.svg"
            width=""
            height=""
            alt=""
          />

          <div class="relative inline-block">
            <NuxtImg
              loading="lazy"
              class="md:hidden block absolute w-[65px] -left-[60px] -top-4 z-0"
              src="images/asterisk-pink.svg"
              width=""
              height=""
              alt=""
            />

            <div class="">
              <h2
                class="z-10 mb-3 text-4xl font-extrabold text-white md:text-5xl"
              >
                Contact
              </h2>

              <p
                class="text-lg font-semibold uppercase md:text-xl text-pink font-barlow"
              >
                Contact us for Booking
              </p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  </section>
</template>
