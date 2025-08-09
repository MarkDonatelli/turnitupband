<script setup></script>

<template>
  <section id="about" class="scroll-mt-[95px]">
    <div class="relative">
      <!-- Full image -->
      <NuxtImg
        src="/images/TIU_Grafitti.jpg"
        alt="Turn It Up band"
        class="block object-cover w-full h-auto"
      />

      <div
        class="absolute inset-x-0 bottom-0 h-24 pointer-events-none md:h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
      ></div>

      <div class="absolute inset-x-0 bottom-4 md:bottom-8">
        <div class="mx-4 md:mx-10">
          <div
            class="inline-flex flex-col rounded-xl px-4 py-2 md:px-6 md:py-3 bg-black/45 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          >
            <h2
              class="text-3xl font-extrabold leading-tight text-white md:text-5xl"
            >
              The Band
            </h2>
            <p
              class="mt-1 md:mt-2 text-[#F63D7A] font-semibold uppercase tracking-widest text-xs md:text-sm"
              style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7)"
            >
              THIS IS TURN IT UP!
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2 md:grid-cols-3">
      <!-- Kelcey -->
      <div class="relative aspect-square">
        <NuxtImg
          src="/images/kelcey-balloons.jpg"
          alt="Turn It Up band"
          class="object-cover w-full h-full"
        />
        <div class="absolute px-4 py-2 rounded-lg bottom-3 left-3 bg-black/70">
          <span class="block text-lg font-bold leading-tight text-white">
            Kelcey
          </span>
          <span class="block text-sm font-medium text-pink">Vocals</span>
        </div>
      </div>

      <!-- Logo -->
      <div class="relative aspect-square">
        <NuxtImg
          src="/images/logo.png"
          alt="Turn It Up band"
          class="object-cover w-full h-full"
        />
      </div>

      <!-- Bob -->
      <div class="relative aspect-square">
        <NuxtImg
          src="/images/bob.jpg"
          alt="Turn It Up band"
          class="object-cover w-full h-full"
        />
        <div class="absolute px-4 py-2 rounded-lg bottom-3 left-3 bg-black/70">
          <span class="block text-lg font-bold leading-tight text-white">
            Bob
          </span>
          <span class="block text-sm font-medium text-pink">Vocals</span>
        </div>
      </div>

      <!-- Tom -->
      <div class="relative aspect-square">
        <NuxtImg
          src="/images/tom-balloons.jpg"
          alt="Turn It Up band"
          class="object-cover w-full h-full"
        />
        <div class="absolute px-4 py-2 rounded-lg bottom-3 left-3 bg-black/70">
          <span class="block text-lg font-bold leading-tight text-white">
            Tom
          </span>
          <span class="block text-sm font-medium text-pink">Bass</span>
        </div>
      </div>

      <!-- James -->
      <div class="relative aspect-square">
        <NuxtImg
          src="/images/james.jpg"
          alt="Turn It Up band"
          class="object-cover w-full h-full"
        />
        <div class="absolute px-4 py-2 rounded-lg bottom-3 left-3 bg-black/70">
          <span class="block text-lg font-bold leading-tight text-white">
            James
          </span>
          <span class="block text-sm font-medium text-pink">Drums</span>
        </div>
      </div>

      <!-- Mark -->
      <div class="relative aspect-square">
        <NuxtImg
          src="/images/mark.jpg"
          alt="Turn It Up band"
          class="object-cover w-full h-full"
        />
        <div class="absolute px-4 py-2 rounded-lg bottom-3 left-3 bg-black/70">
          <span class="block text-lg font-bold leading-tight text-white">
            Mark
          </span>
          <span class="block text-sm font-medium text-pink">Guitar</span>
        </div>
      </div>
    </div>
  </section>
</template>
