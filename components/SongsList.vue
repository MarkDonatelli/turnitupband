<script setup>
  import { songs as songlist } from '~/data/songs.js';

  const query = ref('');
  const filtered = computed(() =>
    songlist.filter((s) => s.toLowerCase().includes(query.value.trim().toLowerCase()))
  );
</script>

<template>
  <div class="flex flex-col gap-6 p-5 border rounded-md md:p-8 border-ivory/15 bg-ink2">
    <input
      v-model="query"
      type="search"
      placeholder="Search songs…"
      aria-label="Search songs"
      class="w-full md:max-w-sm h-12 px-5 rounded-full bg-ivory/5 text-ivory placeholder-ivory/40 border border-ivory/15 focus:border-pink outline-none"
    />
    <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2 text-[15px] md:text-base text-[#D9D3C9]">
      <li v-for="song in filtered" :key="song">{{ song }}</li>
    </ul>
    <p v-if="!filtered.length" class="text-muted">No songs match your search.</p>
  </div>
</template>
