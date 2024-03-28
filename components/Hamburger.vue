<script setup>
  import { useMobileMenuStore } from '~/store/mobileMenu';
  const mobileMenuStore = useMobileMenuStore();
  const { toggleMobileMenu } = useMobileMenuStore();
</script>

<template>
  <div
    @click="toggleMobileMenu"
    class="flex flex-col justify-between w-10 h-6 cursor-pointer md:hidden"
  >
    <div
      :class="{
        'translate-y-[10px] rotate-45 transform': mobileMenuStore.isOpen
      }"
      class="w-full h-1 transition-all rounded-sm bg-pink"
    ></div>

    <div
      :class="{ 'opacity-0': mobileMenuStore.isOpen }"
      class="w-full h-1 transition-all rounded-sm bg-pink"
    ></div>

    <div
      :class="{
        '-translate-y-[10px] -rotate-45 transform': mobileMenuStore.isOpen
      }"
      class="w-full h-1 transition-all rounded-sm bg-pink"
    ></div>
  </div>
</template>
