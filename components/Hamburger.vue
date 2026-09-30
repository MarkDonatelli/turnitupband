<script setup>
  import { useMobileMenuStore } from '~/store/mobileMenu';
  const mobileMenuStore = useMobileMenuStore();
  const { toggleMobileMenu } = useMobileMenuStore();
</script>

<template>
  <button
    @click="toggleMobileMenu"
    aria-label="Menu"
    class="flex flex-col items-center justify-center gap-[5px] w-11 h-11 border rounded-full lg:hidden border-ivory/30"
  >
    <span
      class="w-4 h-[1.5px] bg-ivory transition-transform"
      :class="{ 'translate-y-[3.25px] rotate-45': mobileMenuStore.isOpen }"
    ></span>
    <span
      class="w-4 h-[1.5px] bg-ivory transition-transform"
      :class="{ '-translate-y-[3.25px] -rotate-45': mobileMenuStore.isOpen }"
    ></span>
  </button>
</template>
