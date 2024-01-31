<script setup>
  const header = ref(null);

  onMounted(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        header.value.classList.add('scrolled');
      } else {
        header.value.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });
  });
</script>

<template>
  <header ref="header" class="flex header">
    <nav
      class="relative z-20 flex items-center mx-auto justify-between w-full max-w-[1536px] px-4"
    >
      <div class="text-6xl text-white">
        <NuxtImg
          class="w-[100px]"
          alt=""
          height=""
          width=""
          src="/images/logo.png"
        />
      </div>
      <ul class="flex gap-5">
        <li class="text-white">Home</li>
        <li class="text-white">Shows</li>
        <li class="text-white">About</li>
        <li class="text-white">Gallery</li>
      </ul>

      <ul class="flex gap-5">
        <li class="text-white">Instagram</li>
        <li class="text-white">Facebook</li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
  .header {
    background-color: rgba(0, 0, 0, 0.75);
    box-shadow: 0 0 20px 1px rgba(255, 255, 255, 0.05);
    height: 100px;
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 10;
    transition: background-color 0.5s;
  }

  .header.scrolled {
    background-color: rgba(0, 0, 0, 1);
  }
</style>
