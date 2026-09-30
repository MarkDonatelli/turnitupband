<script setup>
  const songlist = [
    'Life Is A Highway', 'Everybody Talks', 'ABCDEFU', `Stacy's Mom`, 'Sk8r Boi', '1985',
    'Thanks For The Mmrs', 'All Star', 'Aint It Fun', 'Tonight Tonight', `What's My Age Again`,
    'Shut Up & Dance', 'Dance With Somebody', 'You Belong With Me', 'Timber', 'Zombie',
    'All I Do Is Win', `Sugar, We're Goin Down`, 'Misery Business', 'The Middle', `Driver's License`,
    'Good For U', 'Dirty Little Secret', 'Still Into You', 'I Write Sins, Not Tragedies', 'Baby',
    'Fireflies', 'Gimme Gimme Gimme', 'Sex On Fire', 'Raise Your Glass', 'Starships', 'Wake Me Up',
    'Stick Season', 'All The Small Things', 'My Own Worst Enemy', 'Party In The USA', 'Anthem',
    'Since U Been Gone', 'Complicated', 'Blinding Lights', `I'm Good`, 'Man! I Feel Like A Woman',
    'Sweet Caroline', 'Love Story', 'Shipping Up To Boston', 'Fireball', 'HOT TO GO!',
    'Red Wine Supernova', 'Vampire', 'Obsessed', 'Beautiful Things', 'Cruel Summer',
    'I Believe in a Thing Called Love', 'Face Down', 'I Gotta Feeling', 'A Bar Song (Tipsy)',
    `Don't Stop Believing`, 'Mr. Brightside', 'My Heart Will Go On', 'American Girl', 'Ocean Ave',
    `Jesse's Girl`, 'Livin On A Prayer', 'You Shook Me All Night Long', 'Closer', 'I Had Some Help',
    'Titanium', 'Somebody That I Used To Know', 'Somebody Told Me', 'Your Love', 'Unwritten',
    'Valerie', 'A Thousand Miles'
  ].sort();

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
