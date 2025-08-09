<script setup>
  const shows = [
    {
      dateString: 'Fri, Jan 5 2024 @ 10:00pm',
      dateCheckString: '2024-01-05',
      venue: 'Nashbar',
      location: 'Boston, MA',
      link: 'https://www.nashbarboston.com/'
    },
    {
      dateString: 'Fri, Jan 12 2024 @ 9:30pm',
      dateCheckString: '2024-01-12',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Sat, Mar 2 2024 @ 10:30pm',
      dateCheckString: '2024-03-02',
      venue: 'Lansdowne Pub',
      location: 'Boston, MA',
      link: 'https://www.lansdownepubboston.com/'
    },
    {
      dateString: 'Fri, Mar 8 2024 @ 10:00pm',
      dateCheckString: '2024-03-08',
      venue: 'Nashbar',
      location: 'Boston, MA',
      link: 'https://www.nashbarboston.com/'
    },
    {
      dateString: 'Fri, Mar 22 2024 @ 9:30pm',
      dateCheckString: '2024-03-22',
      venue: `Wally's`,
      location: 'Hampton Beach, NH',
      link: 'https://wallysnh.com/'
    },
    {
      dateString: 'Fri, Apr 5 2024 @ 9:45pm',
      dateCheckString: '2024-04-05',
      venue: 'Six String',
      location: 'Foxborough, MA',
      link: 'https://www.sixstringfoxborough.com/'
    },
    {
      dateString: 'Sat, Apr 6 2024 @ 9:30pm',
      dateCheckString: '2024-04-06',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Sun, May 5 2024 @ TBD',
      dateCheckString: '2024-05-05',
      venue: 'Veterans Memorial Stadium',
      location: 'Quincy, MA',
      link: 'https://discoverquincy.com/sports_and_rec/veterans-memorial-stadium/'
    },
    {
      dateString: 'Fri, May 17 2024 @ 10:30pm',
      dateCheckString: '2024-05-17',
      venue: 'Lansdowne Pub',
      location: 'Boston, MA',
      link: 'https://www.lansdownepubboston.com/'
    },
    {
      dateString: 'Fri, Jun 7 2024 @ 9:45pm',
      dateCheckString: '2024-06-07',
      venue: 'Six String',
      location: 'Foxborough, MA',
      link: 'https://www.sixstringfoxborough.com/'
    },
    {
      dateString: 'Sat, Jun 8 2024 @ 10:00pm',
      dateCheckString: '2024-06-08',
      venue: 'Nashbar',
      location: 'Boston, MA',
      link: 'https://www.nashbarboston.com/'
    },
    {
      dateString: 'Sat, Jun 15 2024 @ 9:30pm',
      dateCheckString: '2024-06-15',
      venue: `Wally's`,
      location: 'Hampton Beach, NH',
      link: 'https://wallysnh.com/'
    },
    {
      dateString: 'Fri, Jul 12 2024 @ 9:30pm',
      dateCheckString: '2024-07-12',
      venue: `Wally's`,
      location: 'Hampton Beach, NH',
      link: 'https://wallysnh.com/'
    },
    {
      dateString: 'Fri, Jul 19 2024 @ 9:30pm',
      dateCheckString: '2024-07-19',
      venue: `Bernie's`,
      location: 'Hampton Beach, NH',
      link: 'https://berniesnh.com/'
    },
    {
      dateString: 'Sat, Jul 20 2024 @ 10:00pm',
      dateCheckString: '2024-07-20',
      venue: 'Nashbar',
      location: 'Boston, MA',
      link: 'https://www.nashbarboston.com/'
    },
    {
      dateString: 'Fri, Aug 9 2024 @ 9:30pm',
      dateCheckString: '2024-08-09',
      venue: `Bernie's`,
      location: 'Hampton Beach, NH',
      link: 'https://berniesnh.com/'
    },
    {
      dateString: 'Sat, Aug 31 2024 @ 9:30pm',
      dateCheckString: '2024-08-31',
      venue: `Wally's`,
      location: 'Hampton Beach, NH',
      link: 'https://wallysnh.com/'
    },
    {
      dateString: 'Fri, Sep 6 2024 @ 9:30pm',
      dateCheckString: '2024-09-06',
      venue: `Bernie's`,
      location: 'Hampton Beach, NH',
      link: 'https://berniesnh.com/'
    },
    {
      dateString: 'Sat, Sep 14 2024 @ 9:30pm',
      dateCheckString: '2024-09-14',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Fri, Sep 20 2024 @ 9:30pm',
      dateCheckString: '2024-09-20',
      venue: 'The Chicken Box',
      location: 'Nantucket, MA',
      link: 'https://thechickenbox.com/'
    },
    {
      dateString: 'Sat, Sep 21 2024 @ 9:30pm',
      dateCheckString: '2024-09-21',
      venue: 'The Chicken Box',
      location: 'Nantucket, MA',
      link: 'https://thechickenbox.com/'
    },
    {
      dateString: 'Thu, Oct 3 2024 @ 9:30pm',
      dateCheckString: '2024-10-03',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Sat, Oct 5 2024 @ 1pm',
      dateCheckString: '2024-10-05',
      venue: 'Harpoon Brewery',
      location: 'Boston, MA',
      link: 'https://www.harpoonbrewery.com/event/harpoon-octoberfest-3/'
    },
    {
      dateString: 'Sat, Nov 9 2024 @ 9:30pm',
      dateCheckString: '2024-11-09',
      venue: `Wally's`,
      location: 'Hampton Beach, NH',
      link: 'https://wallysnh.com/'
    },
    {
      dateString: 'Wed, Nov 27 2024 @ 9:30pm',
      dateCheckString: '2024-11-27',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Thu, Dec 12 2024 @ 9:30pm',
      dateCheckString: '2025-12-12',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },

    {
      dateString: 'Thu, Dec 12 2024 @ 9:30pm',
      dateCheckString: '2025-12-12',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },

    {
      dateString: 'Thu, Dec 12 2024 @ 9:30pm',
      dateCheckString: '2025-12-12',
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
