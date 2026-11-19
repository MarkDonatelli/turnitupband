// Pauses an element's CSS animations while it is off-screen and resumes them,
// from exactly where they stopped, when it comes back. Used by the EQ bursts:
// hundreds of small animations that otherwise keep the main thread busy while
// someone reads the rest of the page.
//
// It only toggles a class (`is-offscreen`); the pause itself is CSS
// (assets/css/main.css), so there is no layout change and nothing restarts.
// With reduced motion the bursts don't animate at all, so nothing is observed.
export default function usePauseOffscreen(el, { margin = '120px' } = {}) {
  let io;
  onMounted(() => {
    const node = el.value;
    if (!node || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    io = new IntersectionObserver(
      ([entry]) => node.classList.toggle('is-offscreen', !entry.isIntersecting),
      // A small margin so it is already moving as it scrolls into view.
      { rootMargin: `${margin} 0px` }
    );
    io.observe(node);
  });
  onBeforeUnmount(() => io?.disconnect());
}
