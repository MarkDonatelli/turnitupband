<script setup>
  // Radiating equalizer squares (from the TIU logo), pulsing outward.
  const props = defineProps({
    size: { type: Number, default: 560 },
    rays: { type: Number, default: 36 },
    rings: { type: Number, default: 8 },
    inner: { type: Number, default: 0.2 },
    color: { type: String, default: '#FF2E8A' },
    alt: { type: String, default: '#F3EEE6' }
  });

  const squares = computed(() => {
    const c = props.size / 2;
    const out = [];
    for (let r = 0; r < props.rays; r++) {
      const a = (r / props.rays) * Math.PI * 2;
      const len = props.rings - ((r * 7) % 3);
      for (let k = 0; k < len; k++) {
        const d = c * (props.inner + k * ((0.95 - props.inner) / props.rings));
        const s = props.size * (0.011 + k * 0.0024);
        out.push({
          key: r + '-' + k,
          style: {
            left: c + Math.cos(a) * d - s / 2 + 'px',
            top: c + Math.sin(a) * d - s / 2 + 'px',
            width: s + 'px',
            height: s + 'px',
            background: props.alt && (r + k) % 5 === 0 ? props.alt : props.color,
            transform: 'rotate(' + a + 'rad)',
            animation:
              'tiuPulse 2.6s ease-in-out ' +
              (k * 0.16 + (r % 6) * 0.05).toFixed(2) +
              's infinite'
          }
        });
      }
    }
    return out;
  });
</script>

<template>
  <div
    class="relative pointer-events-none"
    :style="{ width: size + 'px', height: size + 'px' }"
    aria-hidden="true"
  >
    <span
      v-for="sq in squares"
      :key="sq.key"
      class="absolute eq-sq"
      :style="sq.style"
    ></span>
  </div>
</template>
