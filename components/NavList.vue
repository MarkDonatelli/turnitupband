<script setup>
  /*
  imports
  */
  import useScrollIntoView from '~/composables/useScrollIntoView';
  import { useMobileMenuStore } from '~/store/mobileMenu';
  const mobileMenuStore = useMobileMenuStore();
  const { closeMobileMenu } = useMobileMenuStore();

  /*
  composables
   */
  const { scrollToElement } = useScrollIntoView();

  /*
   nav items
    */
  const navItems = ref([
    { name: 'Home', scrollTo: 'home' },
    { name: 'Shows', scrollTo: 'shows' },
    { name: 'The Band', scrollTo: 'about' },
    { name: 'Songs', scrollTo: 'songs' },
    { name: 'Contact', scrollTo: 'contact' }
  ]);
</script>

<template>
  <ul>
    <li
      v-for="item in navItems"
      :key="item.name"
      class="p-5 border-b md:p-0 border-gray md:border-none initial-timeline-item"
    >
      <button
        @click="scrollToElement(`#${item.scrollTo}`), closeMobileMenu()"
        class="text-lg font-extrabold text-white transition-all duration-200 md:text-base hover:text-pink font-mont lg:text-lg"
      >
        {{ item.name }}
      </button>
    </li>
  </ul>
</template>
