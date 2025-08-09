<script setup>
  const songlist = [
    'Life Is A Highway',
    'Everybody Talks',
    'ABCDEFU',
    `Stacy's Mom`,
    'Sk8r Boi',
    '1985',
    'Thanks For The Mmrs',
    'All Star',
    'Aint It Fun',
    'Tonight Tonight',
    `What's My Age Again`,
    'Shut Up & Dance',
    'Dance With Somebody',
    'You Belong With Me',
    'Timber',
    'Zombie',
    'All I Do Is Win',
    `Sugar, We're Goin Down`,
    'Misery Business',
    'The Middle',
    `Driver's License`,
    'Good For U',
    'Dirty Little Secret',
    'Still Into You',
    'I Write Sins, Not Tragedies',
    'Baby',
    'Fireflies',
    'Gimme Gimme Gimme',
    'Sex On Fire',
    'Raise Your Glass',
    'Starships',
    'Wake Me Up',
    'Stick Season',
    'All The Small Things',
    'My Own Worst Enemy',
    'Party In The USA',
    'Anthem',
    'Since U Been Gone',
    'Complicated',
    'Blinding Lights',
    `I'm Good`,
    'Man! I Feel Like A Woman',
    'Sweet Caroline',
    'Love Story',
    'Shipping Up To Boston',
    'Fireball',
    'HOT TO GO!',
    'Red Wine Supernova',
    'Vampire',
    'Obsessed',
    'Beautiful Things',
    'Cruel Summer',
    'I Believe in a Thing Called Love',
    'Face Down',
    'I Gotta Feeling',
    'A Bar Song (Tipsy)',
    `Don't Stop Believing`,
    'Mr. Brightside',
    'My Heart Will Go On',
    'American Girl',
    'Ocean Ave',
    `Jesse's Girl`,
    'Livin On A Prayer',
    'You Shook Me All Night Long',
    'Closer'
  ].sort();

  const query = ref('');
  const filtered = computed(() =>
    songlist.filter((s) =>
      s.toLowerCase().includes(query.value.trim().toLowerCase())
    )
  );
</script>

<template>
  <section id="songs">
    <div class="container">
      <div class="text-center">
        <h2 class="text-4xl font-extrabold text-white md:text-5xl">
          Song List
        </h2>
        <p class="mt-2 text-[#F63D7A] uppercase tracking-widest font-semibold">
          Top 40, dance, pop/rock anthems, 80’s & 90’s hits
        </p>
      </div>

      <!-- Glass panel -->
      <div
        class="p-5 mt-8 border rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm md:p-8"
      >
        <!-- Optional quick filter -->
        <div class="flex items-center gap-3 mb-5 md:mb-6">
          <input
            v-model="query"
            type="search"
            placeholder="Search songs…"
            class="w-full md:max-w-sm rounded-full px-4 py-2.5 bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-[#F63D7A] focus:ring-2 focus:ring-[#F63D7A]/40 outline-none"
            aria-label="Search songs"
          />
        </div>

        <!-- Responsive columns -->
        <ul
          class="grid grid-cols-1 text-left sm:grid-cols-2 lg:grid-cols-3 gap-y-2 md:gap-y-3 gap-x-8 list-disc pl-6 text-white font-barlow text-lg md:text-xl marker:text-[#F63D7A] marker:text-base md:marker:text-lg"
        >
          <li
            v-for="song in filtered"
            :key="song"
            class="leading-7 md:leading-8"
          >
            {{ song }}
          </li>
        </ul>

        <!-- Empty state if filter returns nothing -->
        <p v-if="filtered.length === 0" class="mt-3 text-white/70">
          No songs match your search.
        </p>
      </div>
    </div>
  </section>
</template>
