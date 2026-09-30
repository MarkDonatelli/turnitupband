<script setup>
  // TODO: confirm answers
  const faqs = [
    { q: 'Will you learn our first dance?', a: 'Yes. Send it with your booking and we’ll play it live, arranged for the band. Parent dances and entrance songs too.' },
    { q: 'Can you cover ceremony and cocktail hour?', a: 'We offer acoustic ceremony and cocktail sets, plus curated playlists during breaks so the room never goes quiet.' },
    { q: 'Do you bring sound and lighting?', a: 'Full professional PA and dance-floor lighting are included, sized to your venue. We coordinate load-in with your planner.' },
    { q: 'How loud is it, really?', a: 'As loud as you want. Dinner sets stay conversational; after the cake cutting we open it up. You set the ceiling.' },
    { q: 'How far do you travel?', a: 'All of New England as standard. Destination events are quoted on request.' }
  ];
  const open = ref(0);
  const toggle = (i) => (open.value = open.value === i ? null : i);
</script>

<template>
  <section id="faq" class="scroll-mt-[95px] pb-16 md:pb-[120px]">
    <div class="container grid gap-4 md:grid-cols-[380px_1fr] md:gap-[72px]">
      <div class="flex flex-col gap-5">
        <p class="hidden md:block eyebrow">FAQ</p>
        <h2 class="font-serif text-[36px] md:text-[56px] leading-[1.02]">
          <span class="md:hidden">FAQ</span>
          <span class="hidden md:inline">Planner <em>questions.</em></span>
        </h2>
      </div>
      <div class="flex flex-col md:border-t border-ivory/15">
        <div v-for="(f, i) in faqs" :key="f.q" class="border-b border-ivory/15">
          <button
            @click="toggle(i)"
            :aria-expanded="open === i"
            class="flex items-center justify-between w-full gap-4 md:gap-6 min-h-[60px] md:py-[26px] text-left text-base md:text-xl font-semibold hover:text-pink transition-colors"
          >
            {{ f.q }}
            <span class="text-[22px] md:text-[26px] font-normal text-pink">{{
              open === i ? '–' : '+'
            }}</span>
          </button>
          <Transition name="fade">
            <p
              v-if="open === i"
              class="max-w-[640px] mb-5 md:mb-7 text-[15px] md:text-base leading-relaxed text-muted"
            >
              {{ f.a }}
            </p>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>
