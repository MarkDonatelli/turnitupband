<script setup>
  defineProps({ size: { type: String, default: 'text-[34px]' } });
</script>

<template>
  <span
    class="inline-flex items-end font-display font-black uppercase leading-none tracking-[0.01em] text-ivory"
    :class="size"
  >
    Turn It Up<span class="ml-[0.12em] text-pink">!</span>
  </span>
</template>
