export default function useScrollIntoView() {
  const route = useRoute();
  const scrollToElement = (selector, options = {}) => {
    if (route.path !== '/') {
      return navigateTo(`/${selector}`);
    }
    const element = document.querySelector(selector);
    if (element) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        ...options
      });
    }
  };

  return {
    scrollToElement
  };
}
