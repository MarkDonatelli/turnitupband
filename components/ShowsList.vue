<script setup>
  const shows = [
    {
      dateString: 'Fri, May 29 2026 @ 10:30pm',
      dateCheckString: '2026-05-29',
      venue: 'Chicken Box',
      location: 'Nantucket, MA',
      link: 'https://thechickenbox.com/'
    },
    {
      dateString: 'Sat, May 30 2026 @ 10:30pm',
      dateCheckString: '2026-05-30',
      venue: 'Chicken Box',
      location: 'Nantucket, MA',
      link: 'https://thechickenbox.com/'
    },
    {
      dateString: 'Sat, Jun 27 2026 @ 10:30pm',
      dateCheckString: '2026-06-27',
      venue: 'Lansdowne Pub',
      location: 'Boston, MA',
      link: 'https://www.lansdownepubboston.com/'
    },
    {
      dateString: 'Sun, Jul 5 2026 @ 2:00pm',
      dateCheckString: '2026-07-05',
      venue: 'Ballards Beach Bar',
      location: 'Block Island, RI',
      link: 'https://ballardsbi.com/'
    },
    {
      dateString: 'Mon, Jul 6 2026 @ 2:00pm',
      dateCheckString: '2026-07-06',
      venue: 'Ballards Beach Bar',
      location: 'Block Island, RI',
      link: 'https://ballardsbi.com/'
    },
    {
      dateString: 'Sat, Jul 18 2026 @ 8:15pm',
      dateCheckString: '2026-07-18',
      venue: "Bernie's",
      location: 'Hampton Beach, NH',
      link: 'https://berniesnh.com/'
    },
    {
      dateString: 'Sat, Jul 25 2026',
      dateCheckString: '2026-07-25',
      venue: 'Private event',
      location: '',
      link: ''
    },
    {
      dateString: 'Fri, Jul 31 2026 @ 10:30pm',
      dateCheckString: '2026-07-31',
      venue: "Bill's Bar",
      location: 'Boston, MA',
      link: 'https://www.billsbarboston.com/'
    },
    {
      dateString: 'Sun, Aug 2 2026 @ 4:00pm',
      dateCheckString: '2026-08-02',
      venue: 'Bonnet Shores',
      location: 'Narragansett, RI',
      link: 'https://www.bonnetshoresbeachclub.com/'
    },
    {
      dateString: 'Fri, Aug 7 2026 @ 9:00pm',
      dateCheckString: '2026-08-07',
      venue: 'Yellow Kittens',
      location: 'Block Island, RI',
      link: 'https://www.yellowkittens.com/'
    },
    {
      dateString: 'Sat, Aug 8 2026 @ 9:00pm',
      dateCheckString: '2026-08-08',
      venue: 'Yellow Kittens',
      location: 'Block Island, RI',
      link: 'https://www.yellowkittens.com/'
    },
    {
      dateString: 'Sat, Aug 29 2026 @ 8:15pm',
      dateCheckString: '2026-08-29',
      venue: "Bernie's",
      location: 'Hampton Beach, NH',
      link: 'https://berniesnh.com/'
    },
    {
      dateString: 'Fri, Sep 11 2026 @ 10:30pm',
      dateCheckString: '2026-09-11',
      venue: 'Chicken Box',
      location: 'Nantucket, MA',
      link: 'https://thechickenbox.com/'
    },
    {
      dateString: 'Sat, Sep 12 2026 @ 10:30pm',
      dateCheckString: '2026-09-12',
      venue: 'Chicken Box',
      location: 'Nantucket, MA',
      link: 'https://thechickenbox.com/'
    },
    {
      dateString: 'Sat, Sep 26 2026 @ 10:30pm',
      dateCheckString: '2026-09-26',
      venue: 'Lansdowne Pub',
      location: 'Boston, MA',
      link: 'https://www.lansdownepubboston.com/'
    },
    {
      dateString: 'Fri, Nov 13 2026 @ 10:30pm',
      dateCheckString: '2026-11-13',
      venue: "Bill's Bar",
      location: 'Boston, MA',
      link: 'https://www.billsbarboston.com/'
    },
    {
      dateString: 'Fri, Dec 18 2026 @ 10:30pm',
      dateCheckString: '2026-12-18',
      venue: 'Lansdowne Pub',
      location: 'Boston, MA',
      link: 'https://www.lansdownepubboston.com/'
    }
  ];

  const showsSorted = computed(() =>
    [...shows].sort((a, b) =>
      a.dateCheckString.localeCompare(b.dateCheckString)
    )
  );

  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const todayString = getLocalDateString(new Date());

  const nextShowDate = computed(
    () =>
      showsSorted.value.find(
        (show) => show.dateCheckString >= todayString
      )?.dateCheckString
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

  const isToday = (show) => show.dateCheckString === todayString;

  const isNextShow = (show) => show.dateCheckString === nextShowDate.value;
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
          class="p-4 overflow-hidden border rounded-2xl backdrop-blur-sm md:p-5"
          :class="
            isToday(show)
              ? 'border-[#F63D7A]/70 bg-[#F63D7A]/8 shadow-[inset_4px_0_0_rgba(246,61,122,0.85)]'
              : isNextShow(show)
                ? 'border-[#F63D7A]/70 bg-[#F63D7A]/8 shadow-[inset_4px_0_0_rgba(246,61,122,0.85)]'
                : 'border-white/10 bg-white/5'
          "
        >
          <div
            v-if="isToday(show) || isNextShow(show)"
            class="mb-3 flex flex-wrap gap-2"
          >
            <span
              v-if="isToday(show)"
              class="rounded-full bg-[#F63D7A] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-black"
            >
              Today
            </span>
            <span
              v-if="isNextShow(show)"
              class="rounded-full border border-[#F63D7A]/70 bg-[#F63D7A]/15 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#F63D7A]"
            >
              Next Show
            </span>
          </div>

          <div
            class="grid gap-3 items-start md:grid-cols-[minmax(200px,1fr)_minmax(260px,1.2fr)] lg:grid-cols-[minmax(220px,1fr)_minmax(260px,1.2fr)_auto] xl:grid-cols-[280px_1fr_240px_auto]"
          >
            <!-- Date -->
            <div
              class="min-w-0 px-3 py-2 text-sm font-semibold text-white rounded-xl border md:text-base"
              :class="
                isToday(show) || isNextShow(show)
                  ? 'border-white/15 bg-black/80'
                  : 'border-transparent bg-black/40'
              "
            >
              <p class="truncate">{{ show.dateString }}</p>
            </div>

            <!-- Venue -->
            <div
              class="min-w-0 px-4 py-2 font-semibold text-white rounded-xl border"
              :class="
                isToday(show) || isNextShow(show)
                  ? 'border-white/15 bg-black/80'
                  : 'border-transparent bg-black/40'
              "
            >
              <p class="truncate md:text-lg">{{ show.venue }}</p>
            </div>

            <!-- Location -->
            <div
              v-if="show.location"
              class="min-w-0 px-4 py-2 font-semibold text-white rounded-xl border md:col-start-2 md:row-start-2 lg:col-start-auto lg:row-start-auto"
              :class="
                isToday(show) || isNextShow(show)
                  ? 'border-white/15 bg-black/80'
                  : 'border-transparent bg-black/40'
              "
            >
              <p class="truncate md:text-lg">{{ show.location }}</p>
            </div>

            <!-- CTA -->
            <a
              v-if="show.link"
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
