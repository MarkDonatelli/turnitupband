<script setup>
  const shows = [
    {
      dateString: 'Sat, Jan 11 2025 @ 9:00pm',
      dateCheckString: '2025-01-11',
      venue: 'Snow Barn',
      location: 'Mount Snow, VT',
      link: 'https://www.mountsnow.com/explore-the-resort/during-your-stay/dining/snow-barn.aspx'
    },
    {
      dateString: 'Fri, Jan 31 2025 @ 9:00pm',
      dateCheckString: '2025-01-31',
      venue: "Bill's Bar",
      location: 'Boston, MA',
      link: 'https://www.billsbarboston.com/'
    },
    {
      dateString: 'Fri, Mar 7 2025 @ 9:00pm',
      dateCheckString: '2025-03-07',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Fri, Mar 21 2025 @ 9:00pm',
      dateCheckString: '2025-03-21',
      venue: 'Lansdowne Pub',
      location: 'Boston, MA',
      link: 'https://www.lansdownepubboston.com/'
    },
    {
      dateString: 'Fri, Apr 25 2025 @ 9:00pm',
      dateCheckString: '2025-04-25',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Sat, Apr 26 2025 @ 9:00pm',
      dateCheckString: '2025-04-26',
      venue: "Bill's Bar",
      location: 'Boston, MA',
      link: 'https://www.billsbarboston.com/'
    },
    {
      dateString: 'Sat, Jun 7 2025 @ 9:00pm',
      dateCheckString: '2025-06-07',
      venue: 'Lansdowne Pub',
      location: 'Boston, MA',
      link: 'https://www.lansdownepubboston.com/'
    },
    {
      dateString: 'Sat, Jun 14 2025 @ 8:00pm',
      dateCheckString: '2025-06-14',
      venue: "Bernie's",
      location: 'Hampton Beach, NH',
      link: 'https://berniesnh.com/'
    },
    {
      dateString: 'Thu, Jun 19 2025 @ 9:00pm',
      dateCheckString: '2025-06-19',
      venue: 'Chicken Box',
      location: 'Nantucket, MA',
      link: 'https://thechickenbox.com/'
    },
    {
      dateString: 'Fri, Jun 20 2025 @ 9:00pm',
      dateCheckString: '2025-06-20',
      venue: 'Chicken Box',
      location: 'Nantucket, MA',
      link: 'https://thechickenbox.com/'
    },
    {
      dateString: 'Sat, Jun 21 2025 @ 9:00pm',
      dateCheckString: '2025-06-21',
      venue: 'Chicken Box',
      location: 'Nantucket, MA',
      link: 'https://thechickenbox.com/'
    },
    {
      dateString: 'Fri, Jul 11 2025 @ 8:00pm',
      dateCheckString: '2025-07-11',
      venue: "Bernie's",
      location: 'Hampton Beach, NH',
      link: 'https://berniesnh.com/'
    },
    {
      dateString: 'Fri, Jul 25 2025 @ 9:00pm',
      dateCheckString: '2025-07-25',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Sat, Jul 26 2025 @ 9:00pm',
      dateCheckString: '2025-07-26',
      venue: 'Lansdowne Pub',
      location: 'Boston, MA',
      link: 'https://www.lansdownepubboston.com/'
    },
    {
      dateString: 'Fri, Aug 1 2025 @ 6:00pm',
      dateCheckString: '2025-08-01',
      venue: 'Cisco Brewery',
      location: 'New Bedford, MA',
      link: 'https://www.ciscokitchenbar.com/'
    },
    {
      dateString: 'Fri, Aug 23 2025 @ 9:00pm',
      dateCheckString: '2025-08-23',
      venue: 'Lansdowne Pub',
      location: 'Boston, MA',
      link: 'https://www.lansdownepubboston.com/'
    },
    {
      dateString: 'Fri, Aug 29 2025 @ 9:00pm',
      dateCheckString: '2025-08-29',
      venue: 'Tipsy Seagull',
      location: 'Fall River, MA',
      link: 'https://www.tipsyseagull.com/'
    },
    {
      dateString: 'Sat, Aug 30 2025 @ 8:00pm',
      dateCheckString: '2025-08-30',
      venue: "Bernie's",
      location: 'Hampton Beach, NH',
      link: 'https://berniesnh.com/'
    },
    {
      dateString: 'Thu, Sep 5 2025 @ 9:00pm',
      dateCheckString: '2025-09-05',
      venue: 'Chicken Box',
      location: 'Nantucket, MA',
      link: 'https://thechickenbox.com/'
    },
    {
      dateString: 'Fri, Sep 6 2025 @ 9:00pm',
      dateCheckString: '2025-09-06',
      venue: 'Chicken Box',
      location: 'Nantucket, MA',
      link: 'https://thechickenbox.com/'
    },
    {
      dateString: 'Sat, Sep 13 2025 @ 9:00pm',
      dateCheckString: '2025-09-13',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Sat, Sep 27 2025 @ 9:00pm',
      dateCheckString: '2025-09-27',
      venue: 'Yellow Kittens',
      location: 'Block Island, RI',
      link: 'https://www.yellowkittens.com/'
    },
    {
      dateString: 'Sat, Oct 4 2025 @ 9:00pm',
      dateCheckString: '2025-10-04',
      venue: "McGonagle's",
      location: 'Dorchester, MA',
      link: 'https://www.mcgonagles.com/'
    },
    {
      dateString: 'Fri, Oct 24 2025 @ 9:00pm',
      dateCheckString: '2025-10-24',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Wed, Nov 26 2025 @ 9:00pm',
      dateCheckString: '2025-11-26',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Fri, Dec 19 2025 @ 9:00pm',
      dateCheckString: '2025-12-19',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    }
  ];

  const showsSorted = computed(() =>
    [...shows].sort((a, b) =>
      a.dateCheckString.localeCompare(b.dateCheckString)
    )
  );

  const PAGE = 15;
  const displayCount = ref(PAGE);

  const visibleShows = computed(() =>
    showsSorted.value.slice(0, displayCount.value)
  );

  const loadMore = () => {
    displayCount.value = Math.min(
      displayCount.value + PAGE,
      showsSorted.value.length
    );
  };

  const showAll = () => (displayCount.value = showsSorted.value.length);

  const getVenueLink = (show) => show.link;
</script>

<template>
  <section id="shows" class="py-16 bg-black md:py-24 overflow-x-clip">
    <div class="container">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-4xl font-extrabold text-white md:text-5xl">
          Upcoming Shows
        </h2>
        <p class="mt-2 text-[#F63D7A] uppercase tracking-widest font-semibold">
          We bring the party, you bring the noise!
        </p>
      </div>

      <!-- List -->
      <ul class="mt-8 space-y-3">
        <li
          v-for="show in visibleShows"
          :key="`${show.venue}-${show.dateCheckString}-${show.dateString}`"
          class="p-4 overflow-hidden border rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm md:p-5"
        >
          <div
            class="grid gap-3 items-stretch md:grid-cols-[minmax(200px,1fr)_minmax(260px,1.2fr)] lg:grid-cols-[minmax(220px,1fr)_minmax(260px,1.2fr)_auto] xl:grid-cols-[280px_1fr_240px_auto]"
          >
            <!-- Date -->
            <div
              class="min-w-0 px-3 py-2 text-sm font-semibold text-white rounded-xl bg-black/40 md:text-base"
            >
              <p class="truncate">{{ show.dateString }}</p>
            </div>

            <!-- Venue -->
            <div
              class="min-w-0 px-4 py-2 font-semibold text-white rounded-xl bg-black/40"
            >
              <p class="truncate md:text-lg">{{ show.venue }}</p>
            </div>

            <!-- Location -->
            <div
              class="min-w-0 px-4 py-2 font-semibold text-white rounded-xl bg-black/40 md:col-start-2 md:row-start-2 lg:col-start-auto lg:row-start-auto"
            >
              <p class="truncate md:text-lg">{{ show.location }}</p>
            </div>

            <!-- CTA -->
            <a
              :href="getVenueLink(show)"
              target="_blank"
              class="shrink-0 justify-self-stretch md:justify-self-start inline-flex items-center justify-center px-5 py-3 rounded-full border border-[#F63D7A] text-white font-semibold uppercase tracking-wide hover:bg-black hover:text-white hover:border-white transition-colors text-xs lg:text-sm"
            >
              Venue Information
            </a>
          </div>
        </li>
      </ul>

      <!-- Load more -->
      <div class="flex justify-center mt-8">
        <button
          v-if="displayCount < showsSorted.length"
          @click="loadMore"
          class="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#F63D7A] text-black font-semibold uppercase tracking-wide shadow-md hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F63D7A] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Show More
          <svg
            class="size-4 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12.293 4.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L14.586 10H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            />
          </svg>
        </button>
        <p v-else class="text-sm text-white/60">All shows loaded</p>
      </div>
    </div>
  </section>
</template>
