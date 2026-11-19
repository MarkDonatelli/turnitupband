<script setup>
  // A setlist, not a catalog: a handful of songs in running order, three tiers of
  // scale. `lib` must match a title in data/songs.js; anything that doesn't
  // is dropped, so this preview can never feature a song the band doesn't play.
  import { songs } from '~/data/songs.js';

  const setlist = [
    { lib: 'Livin On A Prayer', title: 'Livin’ on a Prayer', artist: 'Bon Jovi', era: '’80s', size: 'xl' },
    { lib: 'Everybody Wants To Rule The World', title: 'Everybody Wants to Rule the World', artist: 'Tears for Fears', era: '’80s', size: 'trio' },
    { lib: 'Gimme Gimme Gimme', title: 'Gimme! Gimme! Gimme!', artist: 'ABBA', era: '’70s', size: 'trio' },
    { lib: 'Since U Been Gone', title: 'Since U Been Gone', artist: 'Kelly Clarkson', era: '’00s', size: 'trio' },
    { lib: 'Mr. Brightside', title: 'Mr. Brightside', artist: 'The Killers', era: '’00s', size: 'xl', flip: true },
    { lib: 'All The Small Things', title: 'All the Small Things', artist: 'blink-182', era: 'Y2K', size: 'pair' },
    { lib: "Sugar, We're Goin Down", title: 'Sugar, We’re Goin Down', artist: 'Fall Out Boy', era: '’00s', size: 'pair' },
    { lib: 'Unwritten', title: 'Unwritten', artist: 'Natasha Bedingfield', era: '’00s', size: 'trio' },
    { lib: 'Fireball', title: 'Fireball', artist: 'Pitbull', era: '’10s', size: 'trio' },
    { lib: 'Man I Need', title: 'Man I Need', artist: 'Olivia Dean', era: 'Now', size: 'trio' },
    { lib: "Choosin' Texas", title: 'Choosin’ Texas', artist: 'Ella Langley', era: 'Now', size: 'closer', note: 'Last call' }
  ]
    .filter(s => songs.includes(s.lib))
    .map((s, i) => ({ ...s, n: String(i + 1).padStart(2, '0') }));

  const showAll = ref(false);

  // Only the big titles move: each rises out of its own mask as it enters.
  const root = ref(null);
  const animated = ref(false);
  let io;
  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    animated.value = true;
    io = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.2 }
    );
    root.value.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  });
  onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <section
    id="songs"
    ref="root"
    class="songs section-y scroll-mt-[95px]"
    :class="{ 'is-animated': animated }"
    aria-labelledby="songs-title"
  >
    <div class="container">
      <header>
        <h2 id="songs-title" class="font-serif text-[44px] leading-[1] tracking-[-0.01em] md:text-[64px] xl:text-[72px]">
          Every era.<br />
          <em>Every guest.</em>
        </h2>
        <p class="mt-5 max-w-[36ch] text-base leading-relaxed text-muted md:text-[17px]">
          A taste of the setlist. ABBA to Ella Langley without losing the floor.
        </p>
      </header>

      <ol class="setlist mt-10 grid border-t border-ivory/15 md:mt-14 md:grid-cols-12">
        <li
          v-for="s in setlist"
          :key="s.lib"
          class="song relative border-b border-ivory/15"
          :class="[`is-${s.size}`, s.flip && 'is-flip']"
        >
          <!-- Headliners: the songs people scream back at you -->
          <template v-if="s.size === 'xl' || s.size === 'closer'">
            <div
              class="grid gap-x-6 gap-y-3 py-7 md:grid-cols-[48px_1fr_auto] md:items-end md:py-9"
              :class="s.flip && 'md:grid-cols-[auto_1fr_48px]'"
            >
              <span
                class="num text-[11px] font-semibold tracking-[0.2em] text-muted2 md:self-start md:pt-3"
                :class="s.flip && 'md:order-3 md:text-right'"
                aria-hidden="true"
                >{{ s.n }}</span
              >
              <div :class="s.flip && 'md:order-2 md:text-right'">
                <p
                  v-if="s.note"
                  class="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-pink md:text-[11px]"
                >
                  {{ s.note }}
                </p>
                <span data-reveal class="mask block">
                  <span
                    class="title block font-serif tracking-[-0.02em]"
                    :class="[
                      s.size === 'xl'
                        ? 'text-[clamp(46px,8.4vw,132px)] leading-[0.92]'
                        : 'text-[clamp(38px,5.6vw,84px)] leading-[0.95]',
                      s.flip && 'italic'
                    ]"
                    >{{ s.title }}</span
                  >
                </span>
              </div>
              <span
                class="meta flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] md:pb-3 md:text-[12px]"
                :class="s.flip && 'md:order-1'"
              >
                <span class="text-ivory"><span class="sr-only">by </span>{{ s.artist }}</span>
                <span :class="['normal-case tracking-[0.12em]', s.era === 'Now' ? 'text-pink' : 'text-muted2']">{{ s.era }}</span>
              </span>
            </div>
          </template>

          <!-- Supporting songs: the deep bench -->
          <template v-else>
            <div class="flex h-full items-baseline gap-4 py-5 md:flex-col md:gap-3 md:py-7">
              <span class="num w-6 shrink-0 text-[11px] font-semibold tracking-[0.2em] text-muted2" aria-hidden="true">{{
                s.n
              }}</span>
              <div class="flex min-w-0 flex-col gap-1.5">
                <span class="font-serif text-[24px] leading-[1.1] md:text-[28px] xl:text-[32px]">{{ s.title }}</span>
                <span class="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  <span class="text-ivory/85"><span class="sr-only">by </span>{{ s.artist }}</span>
                  <span :class="['normal-case tracking-[0.12em]', s.era === 'Now' ? 'text-pink' : 'text-muted2']">{{ s.era }}</span>
                </span>
              </div>
            </div>
          </template>
        </li>
      </ol>

      <!-- The full library, one tap away -->
      <div class="mt-8 flex justify-end md:mt-10">
        <button
          type="button"
          class="group/all inline-flex min-h-[44px] items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:text-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
          :aria-expanded="showAll ? 'true' : 'false'"
          aria-controls="full-songlist"
          @click="showAll = !showAll"
        >
          {{ showAll ? 'Hide the full list' : 'See the full song list' }}
          <span
            class="arrow inline-block text-pink transition-transform duration-500"
            :class="showAll ? 'rotate-180' : 'group-hover/all:translate-y-1'"
            aria-hidden="true"
            >↓</span
          >
        </button>
      </div>

      <div id="full-songlist" class="mt-6">
        <Transition name="fade">
          <SongsList v-if="showAll" />
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
  /* Grid spans: headliners take the row, the bench shares it. */
  @media (min-width: 768px) {
    .song.is-xl,
    .song.is-closer {
      grid-column: span 12;
    }
    .song.is-pair {
      grid-column: span 6;
    }
    .song.is-trio {
      grid-column: span 4;
    }
    /* Hairline between neighbours on the same row. */
    .song.is-pair + .song.is-pair,
    .song.is-trio + .song.is-trio {
      border-left: 1px solid rgb(243 238 230 / 0.15);
      padding-left: 1.5rem;
    }
  }

  .mask {
    overflow: hidden;
    padding-bottom: 0.22em;
    margin-bottom: -0.22em;
  }
  .is-animated .mask .title {
    transform: translateY(105%);
    transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .is-animated .mask.is-in .title {
    transform: none;
  }
  .arrow {
    transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  }
</style>
