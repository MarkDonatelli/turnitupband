<script setup></script>

<template>
  <div class="hidden grid-cols-2 md:grid">
    <NuxtImg
      alt="TIU Logo"
      height="810"
      width=""
      src="/images/logo.png"
      format="webp"
    />

    <NuxtImg
      class="object-cover w-full h-full"
      alt=""
      height="810"
      width=""
      src="/images/group-1.jpg"
    />
  </div>

  <div class="relative md:hidden">
    <NuxtImg
      class=""
      alt="band picture"
      height=""
      width=""
      src="/images/group-1.jpg"
    />
    <NuxtImg
      class="absolute bottom-0 right-0 z-10 w-[150px]"
      alt="TIU Logo"
      height=""
      width=""
      src="/images/logo.png"
      format="webp"
    />
  </div>
</template>
