<script setup>
  import useScrollIntoView from '~/composables/useScrollIntoView';
  import { useMobileMenuStore } from '~/store/mobileMenu';

  const { closeMobileMenu } = useMobileMenuStore();
  const { scrollToElement } = useScrollIntoView();

  const navItems = [
    { name: 'Events', scrollTo: 'events' },
    { name: 'Shows', scrollTo: 'shows' },
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
        class="w-full py-5 text-left text-lg font-medium lg:py-0 lg:text-sm text-[#D9D3C9] hover:text-pink transition-colors"
      >
        {{ item.name }}
      </button>
    </li>
  </ul>
</template>
