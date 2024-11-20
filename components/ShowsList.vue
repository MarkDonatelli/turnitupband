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
      dateString: 'Thu, Dec 5 2024 @ 9:00pm',
      dateCheckString: '2024-12-5',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Fri, Dec 6 2024 @ 9:00pm',
      dateCheckString: '2024-12-6',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    },
    {
      dateString: 'Sat, Dec 14 2024 @ 9:00pm',
      dateCheckString: '2024-12-6',
      venue: 'Private Event',
      location: 'Hampton, NH'
    }
  ];

  const getVenueLink = (show) => {
    return show.link;
  };

  const displayCount = ref(5);

  const filteredShows = shows.filter((show) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const [year, month, day] = show.dateCheckString.split('-').map(Number);

    const showDate = new Date(year, month - 1, day);

    return currentDate <= showDate;
  });

  const upcomingShows = computed(() => {
    return filteredShows.slice(0, displayCount.value);
  });

  const loadMore = () => {
    displayCount.value = filteredShows.length;
  };
</script>

<template>
  <div class="shows">
    <div
      class="show-item"
      v-for="show in upcomingShows"
      :key="`${show.venue}-${show.dateCheckString}`"
    >
      <div
        class="relative z-10 justify-center hidden w-full gap-5 mt-5 text-white md:flex"
      >
        <div
          class="bg-gray px-3 md:max-w-[220px] lg:max-w-[245px] flex items-center font-mont w-full text-sm lg:text-base font-semibold"
        >
          <p>{{ show.dateString }}</p>
        </div>

        <div
          class="w-full md:max-w-[347px] lg:max-w-[490px] bg-darkerGray grid grid-cols-[minmax(100px,1fr)_auto_auto] px-5 items-center"
        >
          <p class="font-semibold truncate lg:text-xl font-mont">
            {{ show.venue }}
          </p>

          <p class="font-semibold lg:text-xl font-mont justify-self-end">
            {{ show.location }}
          </p>
        </div>

        <a
          :href="getVenueLink(show)"
          target="_blank"
          :class="{
            'disabled bg-slate-400 text-slate-300 border-none hover:bg-slate-400 hover:text-slate-300 cursor-not-allowed':
              !show.link
          }"
          class="p-3 text-xs font-bold uppercase transition-all duration-200 border lg:text-sm lg:p-5 border-pink font-mont hover:bg-pink"
        >
          Venue Information
        </a>
      </div>

      <div class="relative z-10 md:hidden">
        <div class="flex flex-col mt-10">
          <div
            class="flex items-center justify-center w-full p-5 text-lg font-semibold text-white bg-gray font-mont"
          >
            <p>{{ show.dateString }}</p>
          </div>

          <div
            class="flex flex-col justify-center text-center text-white bg-darkerGray"
          >
            <div class="p-7">
              <p class="text-lg font-semibold truncate font-mont">
                {{ show.venue }}
              </p>

              <p class="text-lg font-semibold font-mont justify-self-center">
                {{ show.location }}
              </p>
            </div>

            <a
              :href="show.link"
              target="_blank"
              :class="{
                'disabled bg-slate-400 text-slate-300 border-none hover:bg-slate-400 hover:text-slate-300 cursor-not-allowed':
                  !show.link
              }"
              class="p-3 text-sm font-bold uppercase transition-all duration-200 border border-pink font-mont hover:bg-pink"
            >
              Venue Information
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-5 button">
      <button
        @click="loadMore"
        v-if="displayCount < filteredShows.length"
        class="relative p-5 mt-5 text-sm font-bold text-white uppercase transition-all duration-200 border border-pink font-mont hover:bg-pink hover:text-white"
      >
        See All Shows!
      </button>
    </div>
  </div>
</template>
