<script setup>
  // Era highlights; full searchable list lives in SongsList.vue
  const eras = [
    { era: '80s & 90s', songs: ['Livin On A Prayer', 'Jesse’s Girl', 'All Star'] },
    { era: '00s', songs: ['Mr. Brightside', 'All The Small Things', 'I Gotta Feeling'] },
    { era: '10s', songs: ['Shut Up & Dance', 'Timber', 'Wake Me Up'] },
    { era: 'Now', songs: ['HOT TO GO!', 'A Bar Song (Tipsy)', 'Espresso'] }
  ];
  const showAll = ref(false);
</script>

<template>
  <section id="songs" class="scroll-mt-[95px] pb-16 md:pb-[120px]">
    <div class="container flex flex-col gap-6 md:gap-11">
      <div class="flex flex-col gap-4 md:flex-row md:justify-between md:items-end">
        <div class="flex flex-col gap-4">
          <p class="eyebrow">The songs</p>
          <h2 class="font-serif text-[36px] md:text-[56px] leading-[1.02]">
            Every era. <em>Every guest.</em>
          </h2>
        </div>
        <button
          @click="showAll = !showAll"
          class="hidden md:inline-flex px-[22px] py-3.5 text-sm font-semibold border rounded-full border-ivory/25 hover:border-pink hover:text-pink transition-colors"
        >
          {{ showAll ? 'Hide full list' : 'Full song list →' }}
        </button>
      </div>

      <div class="grid grid-cols-2 gap-x-[18px] gap-y-7 md:grid-cols-4 md:gap-6">
        <div
          v-for="e in eras"
          :key="e.era"
          class="flex flex-col gap-2.5 md:gap-5 pt-3.5 md:pt-6 border-t border-ivory/20"
        >
          <span class="font-serif italic text-[32px] md:text-[48px] leading-none text-pink">{{
            e.era
          }}</span>
          <ul class="flex flex-col gap-1.5 md:gap-2.5 text-sm md:text-[17px] text-[#D9D3C9]">
            <li v-for="s in e.songs" :key="s">{{ s }}</li>
          </ul>
        </div>
      </div>

      <button
        @click="showAll = !showAll"
        class="md:hidden h-12 text-sm font-semibold border rounded-full border-ivory/25"
      >
        {{ showAll ? 'Hide full list' : 'Full song list →' }}
      </button>

      <Transition name="fade">
        <SongsList v-if="showAll" />
      </Transition>
    </div>
  </section>
</template>
