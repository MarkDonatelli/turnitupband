<script setup>
  import useScrollIntoView from '~/composables/useScrollIntoView';
  import { useMobileMenuStore } from '~/store/mobileMenu';
  import { navItems, bookHref } from '~/data/nav.js';

  const menu = useMobileMenuStore();
  const { scrollToElement } = useScrollIntoView();
  const panel = ref(null);
  const reduceMotion = ref(false);

  const pad = n => String(n).padStart(2, '0');

  // Close first, then scroll: page scrolling is locked while the menu is
  // open, and unlocking it mid-scroll would cancel a smooth scroll.
  const go = async (e, href) => {
    e.preventDefault();
    menu.closeMobileMenu();
    await nextTick();
    scrollToElement(href);
  };

  // --- Modal behaviour -----------------------------------------------------
  const focusables = () =>
    [...(panel.value?.querySelectorAll('a[href], button:not([disabled])') ?? [])].filter(
      el => el.getClientRects().length > 0
    );

  const onKeydown = e => {
    if (e.key === 'Escape') {
      e.preventDefault();
      menu.closeMobileMenu();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (!panel.value?.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    }
  };

  const behind = () => document.querySelectorAll('#__nuxt > header, main, footer');

  const lock = on => {
    const html = document.documentElement;
    if (on) {
      // Keep the page from jumping sideways when its scrollbar disappears.
      const gutter = window.innerWidth - html.clientWidth;
      html.style.overflow = 'hidden';
      if (gutter > 0) html.style.paddingRight = `${gutter}px`;
    } else {
      html.style.overflow = '';
      html.style.paddingRight = '';
    }
  };

  watch(
    () => menu.isOpen,
    async open => {
      behind().forEach(el => (el.inert = open));
      lock(open);
      if (open) {
        document.addEventListener('keydown', onKeydown);
        await nextTick();
        panel.value?.querySelector('[data-first]')?.focus({ preventScroll: true });
      } else {
        document.removeEventListener('keydown', onKeydown);
        const active = document.activeElement;
        if (!active || active === document.body || panel.value?.contains(active)) {
          document.getElementById('menu-toggle')?.focus({ preventScroll: true });
        }
      }
    }
  );

  onMounted(() => {
    reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown);
    behind().forEach(el => (el.inert = false));
    lock(false);
  });

  const barLink =
    'py-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors duration-300 hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink';
</script>

<template>
  <Transition name="site-menu">
    <div
      v-if="menu.isOpen"
      id="site-menu"
      ref="panel"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      class="site-menu fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-ink text-ivory lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,40%)] lg:overflow-hidden"
    >
      <!-- Left column: bar, oversized links, details -->
      <div class="relative flex min-h-full flex-col lg:static lg:min-h-0">
        <!-- Mirrors the header. On desktop Close moves over the footage, top right. -->
        <div
          class="grid h-[68px] shrink-0 grid-cols-[1fr_auto] items-center gap-6 px-[22px] md:h-[84px] md:px-10 xl:px-14"
        >
          <a
            href="#home"
            class="justify-self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
            aria-label="Turn It Up!, back to top"
            @click="go($event, '#home')"
          >
            <Wordmark size="text-[26px] md:text-[30px]" />
          </a>
          <button
            type="button"
            :class="[barLink, 'group inline-flex items-center gap-2.5 justify-self-end lg:absolute lg:right-10 lg:top-0 lg:z-20 lg:h-[84px] xl:right-14']"
            @click="menu.closeMobileMenu()"
          >
            Close
            <span class="relative block size-2.5 rotate-45" aria-hidden="true">
              <span class="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-pink" />
              <span class="absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-pink" />
            </span>
          </button>
        </div>

        <nav aria-label="Site" class="flex flex-1 items-center px-[22px] py-8 md:px-10 xl:px-14">
          <ol class="group/list flex w-full flex-col">
            <li
              v-for="(item, i) in navItems"
              :key="item.href"
              class="menu-item"
              :style="{ '--d': `${0.18 + i * 0.045}s` }"
            >
              <a
                :href="item.href"
                :data-first="i === 0 ? '' : undefined"
                class="group/link flex items-start gap-4 py-1 font-display font-black uppercase leading-[0.9] tracking-[-0.005em] text-[clamp(48px,12vw,84px)] transition-colors duration-300 group-hover/list:text-ivory/30 hover:!text-ivory focus-visible:!text-ivory focus-visible:outline-none md:gap-6 lg:text-[clamp(64px,8.4vw,128px)]"
                @click="go($event, item.href)"
              >
                <span
                  class="w-7 shrink-0 pt-[0.9em] font-sans text-[11px] font-semibold leading-none tracking-[0.2em] text-muted2 md:w-9 md:text-xs"
                  aria-hidden="true"
                  >{{ pad(i + 1) }}</span
                >
                <span
                  class="bg-[length:0%_3px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out [background-image:linear-gradient(#FF2E8A,#FF2E8A)] group-hover/link:bg-[length:100%_3px] group-focus-visible/link:bg-[length:100%_3px]"
                  >{{ item.name }}</span
                >
              </a>
            </li>
          </ol>
        </nav>

        <div
          class="menu-item flex shrink-0 flex-col gap-5 border-t border-ivory/10 px-[22px] py-7 md:px-10 xl:flex-row xl:items-center xl:justify-between xl:px-14"
          :style="{ '--d': '0.5s' }"
        >
          <a
            :href="bookHref"
            class="group inline-flex items-center gap-3 whitespace-nowrap font-serif text-[28px] leading-none text-ivory transition-colors hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink md:text-[36px]"
            @click="go($event, bookHref)"
          >
            Book us for <em class="text-pink">2026–2027</em>
            <span class="text-pink transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </a>
          <div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted2">
            <span class="whitespace-nowrap">Boston · New England</span>
            <SocialList />
          </div>
        </div>
      </div>

      <!-- Right column (desktop): the live footage, quiet -->
      <div class="menu-media relative hidden overflow-hidden lg:block" aria-hidden="true">
        <video
          v-if="!reduceMotion"
          class="absolute inset-0 size-full object-cover"
          src="/videos/hero-loop.mp4"
          poster="/images/hero-poster.jpg"
          autoplay
          muted
          loop
          playsinline
          disablepictureinpicture
          tabindex="-1"
        />
        <img v-else src="/images/hero-poster.jpg" alt="" class="absolute inset-0 size-full object-cover" />
        <span class="absolute inset-0 bg-ink/55" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  /* Panel wipes down from the bar; links rise as one gentle wave. */
  .site-menu-enter-active {
    transition: clip-path 0.75s var(--ease-in-out);
  }
  .site-menu-leave-active {
    transition: clip-path 0.55s var(--ease-in-out) 0.05s;
  }
  .site-menu-enter-from,
  .site-menu-leave-to {
    clip-path: inset(0 0 100% 0);
  }
  .site-menu-enter-to,
  .site-menu-leave-from {
    clip-path: inset(0 0 0 0);
  }

  .site-menu-enter-active .menu-item {
    transition:
      opacity 0.7s ease var(--d),
      transform 0.9s var(--ease-out) var(--d);
  }
  .site-menu-enter-from .menu-item {
    opacity: 0;
    transform: translateY(28px);
  }
  .site-menu-leave-active .menu-item {
    transition: opacity 0.25s ease;
  }
  .site-menu-leave-to .menu-item {
    opacity: 0;
  }

  .site-menu-enter-active .menu-media {
    transition: opacity 1s ease 0.35s;
  }
  .site-menu-enter-from .menu-media {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .site-menu-enter-active,
    .site-menu-leave-active {
      transition: opacity 0.2s linear;
    }
    .site-menu-enter-from,
    .site-menu-leave-to {
      clip-path: none;
      opacity: 0;
    }
    .site-menu-enter-active .menu-item,
    .site-menu-enter-active .menu-media {
      transition: none;
    }
    .site-menu-enter-from .menu-item {
      transform: none;
      opacity: 1;
    }
  }
</style>
