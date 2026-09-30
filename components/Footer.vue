<template>
  <footer
    class="flex flex-col items-center gap-6 px-[22px] py-10 md:flex-row md:justify-between md:px-[72px] md:pt-10 md:pb-12 text-sm text-muted2"
  >
    <Wordmark size="text-[30px]" />
    <SocialList />
    <span>© {{ new Date().getFullYear() }} Turn It Up! · Boston, MA</span>
  </footer>
</template>
