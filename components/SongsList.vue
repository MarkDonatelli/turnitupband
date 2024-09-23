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
    'Closer',
    'I Had Some Help'
  ];

  const listSorted = songlist.sort();
</script>

<template>
  <div class="relative z-10">
    <ul
      class="grid grid-cols-2 mt-5 text-lg font-normal text-white md:mt-10 md:grid-cols-3 md:text-xl lg:text-2xl font-barlow"
    >
      <li class="pb-3" v-for="song in listSorted">{{ song }}</li>
    </ul>
  </div>
</template>
