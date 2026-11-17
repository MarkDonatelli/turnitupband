<script setup>
  import useScrollIntoView from '~/composables/useScrollIntoView';
  import { useMobileMenuStore } from '~/store/mobileMenu';
  import { bookHref } from '~/data/nav.js';

  const { scrollToElement } = useScrollIntoView();
  const menu = useMobileMenuStore();

  // Solid backing only once the hero has scrolled under the bar.
  const scrolled = ref(false);
  const onScroll = () => (scrolled.value = window.scrollY > 24);
  onMounted(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  });
  onUnmounted(() => window.removeEventListener('scroll', onScroll));

  const go = (e, href) => {
    e.preventDefault();
    scrollToElement(href);
  };

  const link =
    'relative py-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors duration-300 hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink';
</script>

<template>
  <header
    class="nav-in fixed inset-x-0 top-0 z-[60] border-b transition-[background-color,border-color] duration-500"
    :class="scrolled ? 'border-ivory/10 bg-ink/[0.94]' : 'border-transparent bg-transparent'"
  >
    <nav
      aria-label="Main"
      class="grid h-[68px] grid-cols-[1fr_auto] items-center gap-6 px-[22px] md:h-[84px] md:grid-cols-[1fr_auto_1fr] md:px-10 xl:px-14"
    >
      <!-- Left: wordmark -->
      <a
        href="#home"
        class="justify-self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
        aria-label="Turn It Up! — back to top"
        @click="go($event, '#home')"
      >
        <Wordmark size="text-[26px] md:text-[30px]" />
      </a>

      <!-- Center: Shows / Menu + (mobile: Menu + only, pinned right) -->
      <div class="flex items-center gap-5 justify-self-end md:justify-self-center">
        <a href="#shows" :class="[link, 'hidden md:inline-block']" @click="go($event, '#shows')">Shows</a>
        <span class="hidden h-3 w-px bg-ivory/30 md:block" aria-hidden="true" />
        <button
          id="menu-toggle"
          type="button"
          :class="[link, 'group inline-flex items-center gap-2.5']"
          aria-haspopup="dialog"
          :aria-expanded="menu.isOpen ? 'true' : 'false'"
          aria-controls="site-menu"
          @click="menu.toggleMobileMenu()"
        >
          Menu
          <span class="relative block size-2.5" aria-hidden="true">
            <span class="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-pink" />
            <span
              class="absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-pink transition-transform duration-300 group-hover:rotate-90"
            />
          </span>
        </button>
      </div>

      <!-- Right: Book Us -->
      <a
        :href="bookHref"
        :class="[link, 'group hidden items-center gap-2 justify-self-end md:inline-flex']"
        @click="go($event, bookHref)"
      >
        Book Us
        <span class="text-pink transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
      </a>
    </nav>
  </header>

  <SiteMenu />
</template>

<style scoped>
  /* Step 2 of the hero sequence: the bar settles in after the footage. */
  .nav-in {
    animation: navIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
  }
  @keyframes navIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .nav-in {
      animation: none;
    }
  }
</style>
