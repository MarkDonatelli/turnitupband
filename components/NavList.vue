<script setup>
  import useScrollIntoView from '~/composables/useScrollIntoView';
  import { useMobileMenuStore } from '~/store/mobileMenu';

  const { closeMobileMenu } = useMobileMenuStore();
  const { scrollToElement } = useScrollIntoView();

  const navItems = [
    { name: 'Shows', scrollTo: 'shows' },
    { name: 'Events', scrollTo: 'events' },
    { name: 'Songs', scrollTo: 'songs' },
    { name: 'The Band', scrollTo: 'about' },
    { name: 'FAQ', scrollTo: 'faq' }
  ];
</script>

<template>
  <ul>
    <li
      v-for="item in navItems"
      :key="item.name"
      class="border-b border-ivory/10 lg:border-none"
    >
      <button
        @click="scrollToElement(`#${item.scrollTo}`), closeMobileMenu()"
        class="group relative w-full py-5 text-left text-lg font-medium lg:py-1.5 lg:text-sm text-[#D9D3C9] hover:text-ivory lg:hover:text-ivory transition-colors duration-300 focus-visible:outline-none focus-visible:text-pink"
      >
        {{ item.name }}
        <!-- Underline draws in from the left on hover (desktop only) -->
        <span
          class="absolute inset-x-0 bottom-0 hidden h-px origin-left scale-x-0 bg-pink transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 lg:block"
          aria-hidden="true"
        />
      </button>
    </li>
  </ul>
</template>
