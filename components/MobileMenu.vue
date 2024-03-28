<script setup>
  import { useMobileMenuStore } from '~/store/mobileMenu';
  const mobileMenuStore = useMobileMenuStore();
</script>

<template>
  <Transition name="slide-fade">
    <div
      ref="mobileMenuRef"
      v-if="mobileMenuStore.isOpen"
      class="absolute z-40 bg-black h-dvh mobile-menu md:hidden"
    >
      <NavList class="pt-[100px] md:pt-0" />
      <SocialList />
    </div>
  </Transition>
</template>

<style scoped>
  .mobile-menu {
    width: 225px;
  }

  @media (min-width: 500px) {
    .mobile-menu {
      width: 320px;
    }
  }
</style>
