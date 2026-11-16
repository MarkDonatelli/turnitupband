<script setup>
  import useScrollIntoView from '~/composables/useScrollIntoView';
  import { useMobileMenuStore } from '~/store/mobileMenu';

  const { scrollToElement } = useScrollIntoView();
  const mobileMenuStore = useMobileMenuStore();

  const scrolled = ref(false);
  const handleScroll = () => (scrolled.value = window.scrollY > 150);

  onMounted(() => window.addEventListener('scroll', handleScroll));
  onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<template>
  <header
    class="header-in fixed top-0 z-[60] w-full border-b transition-colors duration-500"
    :class="scrolled ? 'bg-ink/90 backdrop-blur-md border-ivory/10' : 'bg-transparent border-transparent'"
  >
    <nav
      class="relative z-50 flex items-center justify-between mx-auto max-w-[1440px] px-[22px] py-[22px] md:px-[72px] md:py-[30px]"
    >
      <button @click="scrollToElement('#home')" aria-label="Turn It Up! home">
        <Wordmark size="text-[28px] md:text-[34px]" />
      </button>

      <NavList class="hidden lg:flex gap-[38px]" />

      <button
        @click="scrollToElement('#contact')"
        class="hidden lg:inline-flex px-[22px] py-[13px] text-sm font-semibold border rounded-full border-pink text-ivory hover:bg-pink hover:text-ink transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
      >
        Book the band
      </button>

      <Hamburger />
    </nav>
  </header>

  <!-- Outside the header on purpose: the header's backdrop-blur/transform make
       it the containing block for fixed children, which squashed the menu to
       the header's height and left it see-through. -->
  <MobileMenu />
</template>

<style scoped>
.header-in {
  animation: headerIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}
@keyframes headerIn {
  from { opacity: 0; transform: translateY(-12px); }
}
@media (prefers-reduced-motion: reduce) {
  .header-in { animation: none; }
}
</style>
