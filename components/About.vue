<script setup>
  const band = ref([
    {
      name: 'Kelcey',
      position: 'Lead Vocals',
      img: '/images/kelcey.jpg'
    },
    {
      name: 'Bob',
      position: 'Lead Vocals',
      img: '/images/bob.jpeg'
    },
    {
      name: 'Tom',
      position: 'Bass Guitar',
      img: '/images/tom.jpeg'
    },
    {
      name: 'James',
      position: 'Drums',
      img: '/images/james.jpeg'
    },
    {
      name: 'Mark',
      position: 'Lead Guitar',
      img: '/images/mark.jpeg'
    }
  ]);
</script>

<template>
  <div class="relative">
    <div
      class="grid grid-cols-2 gap-4 md:gap-5 place-items-center md:grid-cols-3 lg:grid-cols-5 lg:gap-10"
    >
      <div
        v-for="person in band"
        :key="person.name"
        class="flex flex-col w-full text-center"
      >
        <NuxtImg class="" :src="person.img" />

        <div class="mt-3 border-t-[2px] border-b-[2px] border-pink py-2">
          <p class="font-extrabold text-white uppercase font-mont">
            {{ person.name }}
          </p>
          <p class="font-bold text-white font-display">
            {{ person.position }}
          </p>
        </div>
      </div>
    </div>

    <div class="text-lg text-white mt-9 font-mont">
      <p>
        TURN IT UP! is a Boston area high energy band, covering all of you
        favorite hits from 90's to now (and then some), comprised of experienced
        musicians/performers all with one goal: TO BRING THE PARTY!!!
      </p>
      <p>
        From bars/clubs to corporate events, weddings, house parties, casinos
        and beyond, reach out and let us know where YOU want to see us next.
      </p>
    </div>
  </div>
</template>
