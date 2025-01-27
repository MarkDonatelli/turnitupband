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
      dateString: 'Sun, May 5 2024 @ 9:00pm',
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
      dateString: 'Fri, Jul 19 2024 @ 8:00pm',
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
      dateString: 'Fri, Aug 9 2024 @ 8:00pm',
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
      dateString: 'Fri, Sep 6 2024 @ 8:00pm',
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
      dateCheckString: '2024-12-14',
      venue: 'Private Event',
      location: 'Hampton, NH'
    },
    {
      dateString: 'Thu, Dec 26 2024 @ 9:00pm',
      dateCheckString: '2024-12-26',
      venue: 'Pickle Barrel',
      location: 'Killington, VT',
      link: 'https://www.picklebarrelnightclub.com/'
    },
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
      dateString: 'Fri, Jun 14 2025 @ 8:00pm',
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
      link: 'https://www.ciscobrewersnewbedford.com/'
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
      dateString: 'Sat, Dec 13 2025 @ 9:00pm',
      dateCheckString: '2025-12-13',
      venue: "McGonagle's",
      location: 'Dorchester, MA',
      link: 'https://www.mcgonagles.com/'
    },
    {
      dateString: 'Fri, Dec 19 2025 @ 9:00pm',
      dateCheckString: '2025-12-19',
      venue: 'The Goat',
      location: 'Manchester, NH',
      link: 'https://goatnh.com/manchester/'
    }
  ];

  const displayCount = ref(5);

  const filteredShows = computed(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return shows.filter((show) => {
      const [year, month, day] = show.dateCheckString.split('-').map(Number);
      const showDate = new Date(year, month - 1, day);

      return currentDate <= showDate;
    });
  });

  const upcomingShows = computed(() => {
    return filteredShows.value.slice(0, displayCount.value);
  });

  const loadMore = () => {
    displayCount.value = filteredShows.value.length;
  };

  const getVenueLink = (show) => {
    return show.link || '#';
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
