<script setup>
  import useScrollIntoView from '~/composables/useScrollIntoView';
  import { useMobileMenuStore } from '~/store/mobileMenu';
  const mobileMenuStore = useMobileMenuStore();
  const { closeMobileMenu } = useMobileMenuStore();
  const { scrollToElement } = useScrollIntoView();
</script>

<template>
  <!-- Dim the page behind the panel; tapping it closes the menu -->
  <Transition name="fade">
    <div
      v-if="mobileMenuStore.isOpen"
      class="fixed inset-0 z-30 bg-ink/70 lg:hidden"
      aria-hidden="true"
      @click="closeMobileMenu()"
    />
  </Transition>
  <Transition name="slide-fade">
    <div
      v-if="mobileMenuStore.isOpen"
      class="fixed inset-y-0 right-0 z-40 flex flex-col w-[300px] px-[22px] pt-[100px] pb-8 bg-ink lg:hidden"
    >
      <NavList />
      <button
        @click="scrollToElement('#contact'), closeMobileMenu()"
        class="mt-8 h-12 rounded-full bg-pink text-ink font-bold"
      >
        Check your date
      </button>
      <SocialList class="mt-8" />
    </div>
  </Transition>
</template>
