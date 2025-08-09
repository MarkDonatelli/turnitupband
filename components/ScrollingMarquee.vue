<script setup>
  /*
  imports
  */
  import useScrollIntoView from '~/composables/useScrollIntoView';

  /*
  composables
   */
  const { scrollToElement } = useScrollIntoView();
</script>

<template>
  <div class="relative overflow-hidden bg-pink w-full h-[45px] font-mont">
    <div
      class="hidden md:flex animate-marquee whitespace-nowrap items-center gap-6 hover:[animation-play-state:paused] h-full"
    >
      <span
        v-for="i in 10"
        :key="i"
        class="flex gap-3 px-4 text-sm font-bold text-white uppercase"
      >
        Check out our upcoming shows!
        <button
          @click="scrollToElement('#shows')"
          href="#shows"
          class="text-sm font-bold text-white uppercase border-b border-b-white"
        >
          View Shows
        </button>
      </span>
    </div>

    <div class="flex items-center justify-center h-full md:hidden">
      <span class="gap-3 px-4 text-xs font-bold text-white uppercase">
        Check out our upcoming shows!
        <button
          @click="scrollToElement('#shows')"
          href="#shows"
          class="ml-2 text-xs font-bold text-white uppercase border-b border-b-white"
        >
          View Shows
        </button>
      </span>
    </div>
  </div>
</template>
