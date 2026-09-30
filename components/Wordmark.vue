<script setup>
  defineProps({ size: { type: String, default: 'text-[34px]' } });
  const bars = [0.55, 1, 0.75];
</script>

<template>
  <span
    class="inline-flex items-end gap-[7px] font-display font-black uppercase leading-none tracking-[0.01em] text-ivory"
    :class="size"
  >
    Turn It Up
    <span class="inline-flex items-end gap-[3px] h-[0.7em]" aria-hidden="true">
      <span
        v-for="(s, i) in bars"
        :key="i"
        class="w-[5px] bg-pink"
        :style="{ height: s * 100 + '%' }"
      ></span>
    </span>
  </span>
</template>
