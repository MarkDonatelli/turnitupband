<template>
  <section id="contact" class="scroll-mt-[50px] px-3.5 md:px-8 pb-8">
    <div
      class="relative overflow-hidden rounded-lg bg-ink2 px-5 py-12 md:px-[72px] md:py-[110px] flex flex-col items-center gap-6 md:gap-[30px] text-center"
    >
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-55 hidden md:block">
        <EqBurst :size="900" :rays="44" :rings="9" :inner="0.28" alt="" />
      </div>
      <p class="relative eyebrow">Booking 2026–2027</p>
      <h2 class="relative font-serif text-[40px] md:text-[84px] leading-none">
        Is your date <em>still open?</em>
      </h2>
      <ContactForm class="relative" />
    </div>
  </section>
</template>
