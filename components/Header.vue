<script setup>
  /*
  imports
  */
  import useScrollIntoView from '~/composables/useScrollIntoView';

  /*
  composables
   */
  const { scrollToElement } = useScrollIntoView();

  /*
  refs
  */
  const header = ref(null);

  const handleScroll = () => {
    if (window.scrollY > 150) {
      header.value.classList.add('scrolled');
    } else {
      header.value.classList.remove('scrolled');
    }
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<template>
  <header ref="header" class="flex header">
    <nav
      class="relative z-50 flex items-center mx-auto justify-between w-full max-w-[1536px] px-4"
    >
      <div class="flex items-center justify-between w-full md:w-auto">
        <NuxtImg
          @click="scrollToElement('#home')"
          class="w-[100px] cursor-pointer"
          alt="Band Logo"
          height="84"
          width="100"
          src="/images/logo.png"
          format="webp"
        />
        <Hamburger />
      </div>
      <NavList class="hidden gap-10 md:flex lg:gap-14" />

      <SocialList class="hidden md:flex" />
    </nav>

    <MobileMenu />
  </header>
</template>

<style scoped>
  .header {
    background-color: rgba(0, 0, 0, 0.5);
    height: 100px;
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 20;
    transition: background-color 0.3s ease;
  }

  .header.scrolled {
    background-color: rgba(0, 0, 0, 1);
  }
</style>
