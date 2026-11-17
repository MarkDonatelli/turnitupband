<script setup>
  // The equalizer burst from the TIU logo, drawn with the logo's exact square
  // shapes and pulsing outward from the center.
  import squares from '~/data/eqBurstSquares.js';

  defineProps({
    // Rendered width in px (the burst is 915 × 872 logo units).
    size: { type: Number, default: 560 },
    color: { type: String, default: '#FF2E8A' },
    // Optional logo image, placed where it sits in the original artwork.
    logo: { type: String, default: '' },
    logoAlt: { type: String, default: 'Turn It Up!' },
    logoClass: { type: String, default: '' },
    // Fill the parent's width instead of a fixed pixel size, so one instance
    // can scale across breakpoints.
    fluid: { type: Boolean, default: false }
  });
</script>

<template>
  <div
    class="relative pointer-events-none"
    :style="fluid ? { width: '100%', aspectRatio: '915 / 872' } : { width: size + 'px', height: (size * 872) / 915 + 'px' }"
  >
    <svg
      viewBox="0 0 915 872"
      class="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <path
        v-for="(sq, i) in squares"
        :key="i"
        class="eq-sq"
        :d="sq.d"
        :transform="sq.rot ? `rotate(${sq.rot} 444.08 439)` : undefined"
        :fill="color"
        :style="{ animation: `tiuPulse 2.6s ease-in-out ${sq.delay}s infinite` }"
      />
    </svg>
    <!-- Logo artwork spans x 73–893, y 86–796 in the same coordinate space -->
    <img
      v-if="logo"
      :src="logo"
      :alt="logoAlt"
      class="absolute max-w-none"
      :class="logoClass"
      :style="{
        left: (73 / 915) * 100 + '%',
        top: (86 / 872) * 100 + '%',
        width: (820 / 915) * 100 + '%'
      }"
    />
  </div>
</template>
