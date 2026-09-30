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
    class="fixed top-0 z-[60] w-full transition-colors duration-300"
    :class="scrolled ? 'bg-ink/95 backdrop-blur' : 'bg-transparent'"
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
        class="hidden lg:inline-flex px-[22px] py-[13px] text-sm font-semibold border rounded-full border-pink text-ivory hover:bg-pink hover:text-ink transition-colors"
      >
        Check your date
      </button>

      <Hamburger />
    </nav>

    <MobileMenu />
  </header>
</template>
