<script setup>
  // Data + date logic unchanged from main. Only the template is restyled.
  const shows = [
    { dateString: 'Fri, May 29 2026 @ 10:30pm', dateCheckString: '2026-05-29', venue: 'Chicken Box', location: 'Nantucket, MA', link: 'https://thechickenbox.com/' },
    { dateString: 'Sat, May 30 2026 @ 10:30pm', dateCheckString: '2026-05-30', venue: 'Chicken Box', location: 'Nantucket, MA', link: 'https://thechickenbox.com/' },
    { dateString: 'Sun, Jul 5 2026 @ 2:00pm', dateCheckString: '2026-07-05', venue: 'Ballards Beach Bar', location: 'Block Island, RI', link: 'https://ballardsbi.com/' },
    { dateString: 'Mon, Jul 6 2026 @ 2:00pm', dateCheckString: '2026-07-06', venue: 'Ballards Beach Bar', location: 'Block Island, RI', link: 'https://ballardsbi.com/' },
    { dateString: 'Sat, Jul 18 2026 @ 8:15pm', dateCheckString: '2026-07-18', venue: "Bernie's", location: 'Hampton Beach, NH', link: 'https://berniesnh.com/' },
    { dateString: 'Fri, Jul 24 2026', dateCheckString: '2026-07-24', venue: 'Private event', location: 'Danvers, MA', link: '' },
    { dateString: 'Sat, Jul 25 2026', dateCheckString: '2026-07-25', venue: 'Private event', location: 'Revere, MA', link: '' },
    { dateString: 'Fri, Jul 31 2026 @ 10:30pm', dateCheckString: '2026-07-31', venue: "Bill's Bar", location: 'Boston, MA', link: 'https://www.billsbarboston.com/' },
    { dateString: 'Sun, Aug 2 2026 @ 4:00pm', dateCheckString: '2026-08-02', venue: 'Bonnet Shores', location: 'Narragansett, RI', link: 'https://www.bonnetshoresbeachclub.com/' },
    { dateString: 'Fri, Aug 7 2026 @ 9:00pm', dateCheckString: '2026-08-07', venue: 'Yellow Kittens', location: 'Block Island, RI', link: 'https://www.yellowkittens.com/' },
    { dateString: 'Sat, Aug 8 2026 @ 9:00pm', dateCheckString: '2026-08-08', venue: 'Yellow Kittens', location: 'Block Island, RI', link: 'https://www.yellowkittens.com/' },
    { dateString: 'Sat, Aug 29 2026 @ 8:15pm', dateCheckString: '2026-08-29', venue: "Bernie's", location: 'Hampton Beach, NH', link: 'https://berniesnh.com/' },
    { dateString: 'Fri, Sep 11 2026 @ 10:30pm', dateCheckString: '2026-09-11', venue: 'Chicken Box', location: 'Nantucket, MA', link: 'https://thechickenbox.com/' },
    { dateString: 'Sat, Sep 12 2026 @ 10:30pm', dateCheckString: '2026-09-12', venue: 'Chicken Box', location: 'Nantucket, MA', link: 'https://thechickenbox.com/' },
    { dateString: 'Sat, Sep 26 2026 @ 10:30pm', dateCheckString: '2026-09-26', venue: 'Lansdowne Pub', location: 'Boston, MA', link: 'https://www.lansdownepubboston.com/' },
    { dateString: 'Fri, Nov 13 2026 @ 10:30pm', dateCheckString: '2026-11-13', venue: "Bill's Bar", location: 'Boston, MA', link: 'https://www.billsbarboston.com/' },
    { dateString: 'Fri, Dec 18 2026 @ 10:30pm', dateCheckString: '2026-12-18', venue: 'Lansdowne Pub', location: 'Boston, MA', link: 'https://www.lansdownepubboston.com/' }
  ];

  const SHOW_TIME_ZONE = 'America/New_York';

  const getShowDateString = (date) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: SHOW_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date);
    const p = Object.fromEntries(
      parts.filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value])
    );
    return `${p.year}-${p.month}-${p.day}`;
  };

  const todayString = ref('');
  let todayTimer;
  const setTodayString = () => (todayString.value = getShowDateString(new Date()));
  const scheduleTodayRefresh = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 1, 0);
    todayTimer = window.setTimeout(() => {
      setTodayString();
      scheduleTodayRefresh();
    }, tomorrow.getTime() - now.getTime());
  };
  onMounted(() => {
    setTodayString();
    scheduleTodayRefresh();
  });
  onUnmounted(() => window.clearTimeout(todayTimer));

  // Upcoming only (past shows hidden once "today" is known)
  const upcoming = computed(() =>
    [...shows]
      .sort((a, b) => a.dateCheckString.localeCompare(b.dateCheckString))
      .filter((s) => !todayString.value || s.dateCheckString >= todayString.value)
  );

  const PAGE = 5;
  const displayCount = ref(PAGE);
  const visibleShows = computed(() => upcoming.value.slice(0, displayCount.value));
  const loadMore = () => (displayCount.value += PAGE);

  const isToday = (s) => s.dateCheckString === todayString.value;
  const isNext = (s) => s.dateCheckString === upcoming.value[0]?.dateCheckString;

  const parse = (s) => {
    const d = new Date(s.dateCheckString + 'T12:00:00');
    const time = s.dateString.split('@')[1]?.trim().toUpperCase() || '';
    return {
      dow: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time
    };
  };
</script>

<template>
  <div class="flex flex-col">
    <p v-if="!upcoming.length" class="py-6 text-muted">
      New dates coming soon. Follow us on Instagram for announcements.
    </p>

    <component
      :is="show.link ? 'a' : 'div'"
      v-for="show in visibleShows"
      :key="`${show.venue}-${show.dateCheckString}`"
      :href="show.link || undefined"
      :target="show.link ? '_blank' : undefined"
      class="grid grid-cols-[84px_1fr] md:grid-cols-[120px_1fr_auto] gap-[18px] md:gap-8 items-center py-[18px] md:py-[26px] border-b border-ivory/15 transition-all"
      :class="show.link ? 'md:hover:pl-3.5 hover:text-pink' : ''"
    >
      <div class="flex flex-col gap-0.5">
        <span class="hidden md:block text-xs uppercase tracking-[0.18em] text-muted2">{{
          parse(show).dow
        }}</span>
        <span class="font-serif text-[30px] md:text-[40px] leading-none">{{
          parse(show).date
        }}</span>
      </div>
      <div class="flex flex-col gap-1 min-w-0">
        <span class="flex items-center gap-2.5 text-base font-bold md:text-xl md:font-semibold">
          {{ show.venue }}
          <span
            v-if="isToday(show) || isNext(show)"
            class="px-2 py-0.5 rounded-full bg-pink text-ink text-[10px] font-extrabold uppercase tracking-wide"
            >{{ isToday(show) ? 'Tonight' : 'Next' }}</span
          >
        </span>
        <span class="text-[13px] md:text-sm text-muted2"
          >{{ show.location }}<template v-if="parse(show).time"> · {{ parse(show).time }}</template></span
        >
      </div>
      <span
        class="hidden md:inline-flex px-[18px] py-2.5 text-[13px] font-semibold border rounded-full"
        :class="show.link ? 'border-ivory/25' : 'border-ivory/10 text-ivory/40'"
        >{{ show.link ? 'Details' : 'Private' }}</span
      >
    </component>

    <button
      v-if="displayCount < upcoming.length"
      @click="loadMore"
      class="self-start mt-6 text-sm font-semibold text-pink"
    >
      More dates →
    </button>
  </div>
</template>
