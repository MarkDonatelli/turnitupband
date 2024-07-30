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
  <section id="about" class="scroll-mt-[95px]">
    <div class="py-14 md:py-20 bg-darkgray">
      <div class="container">
        <div class="mb-10 text-center md:relative">
          <NuxtImg
            loading="lazy"
            class="hidden md:block absolute w-[250px] right-5 z-0"
            src="images/hearts-pink--group.svg"
            width=""
            height=""
            alt=""
          />

          <div class="relative inline-block">
            <NuxtImg
              loading="lazy"
              class="md:hidden block absolute w-[65px] -right-[60px] -top-4 z-0"
              src="images/heart-pink.svg"
              width=""
              height=""
              alt=""
            />
            <div class="">
              <h2
                class="z-10 mb-3 text-4xl font-extrabold text-white md:text-5xl"
              >
                About
              </h2>

              <p
                class="mb-10 text-lg font-semibold uppercase md:text-xl text-pink font-barlow"
              >
                THIS IS TURN IT UP!
              </p>
            </div>
          </div>

          <div class="relative">
            <div
              class="grid grid-cols-2 gap-4 md:gap-5 place-items-center md:grid-cols-3 lg:grid-cols-5 lg:gap-10"
            >
              <div
                v-for="person in band"
                :key="person.name"
                class="flex flex-col w-full text-center"
              >
                <NuxtImg
                  class="w-full"
                  :src="person.img"
                  format="webp"
                  width="196"
                  height="196"
                  :alt="`image of ${person.name}`"
                />

                <div
                  class="mt-3 border-t-[2px] border-b-[2px] border-pink py-2"
                >
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
                TURN IT UP! is a Boston area high energy band, covering all of
                you favorite hits from 90's to now (and then some), comprised of
                experienced musicians/performers all with one goal: TO BRING THE
                PARTY!!!
              </p>
              <p>
                From bars/clubs to corporate events, weddings, house parties,
                casinos and beyond, reach out and let us know where YOU want to
                see us next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
