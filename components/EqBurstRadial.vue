<script setup>
  // Generated radiating equalizer squares, pulsing outward. Square size grows
  // with distance from the center using the TIU logo's proportions.
  // (EqBurst.vue draws the exact logo artwork instead.)
  const props = defineProps({
    size: { type: Number, default: 560 },
    rays: { type: Number, default: 36 },
    rings: { type: Number, default: 8 },
    inner: { type: Number, default: 0.2 },
    color: { type: String, default: '#FF2E8A' },
    alt: { type: String, default: '#F3EEE6' },
    // px per TIU logo SVG unit (logo width / 820). Square sizes follow the
    // logo: ~11.6 units + 0.033 × distance from center.
    scale: { type: Number, default: null }
  });

  const px = (v) => v.toFixed(2) + 'px';

  const squares = computed(() => {
    const c = props.size / 2;
    const out = [];
    for (let r = 0; r < props.rays; r++) {
      const a = (r / props.rays) * Math.PI * 2;
      const len = props.rings - ((r * 7) % 3);
      for (let k = 0; k < len; k++) {
        const d = c * (props.inner + k * ((0.95 - props.inner) / props.rings));
        const unit = props.scale ?? props.size / 1236;
        const s = unit * 11.6 + d * 0.033;
        out.push({
          key: r + '-' + k,
          style: {
            // Rounded so server and browser render identical strings
            // (trig results can differ in the last digit → hydration mismatch).
            left: px(c + Math.cos(a) * d - s / 2),
            top: px(c + Math.sin(a) * d - s / 2),
            width: px(s),
            height: px(s),
            background: props.alt && (r + k) % 5 === 0 ? props.alt : props.color,
            transform: 'rotate(' + a.toFixed(4) + 'rad)',
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
