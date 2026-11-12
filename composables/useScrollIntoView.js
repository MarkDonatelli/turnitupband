export default function useScrollIntoView() {
  const route = useRoute();
  const scrollToElement = (selector, options = {}) => {
    if (route.path !== '/') {
      return navigateTo(`/${selector}`);
    }
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        ...options
      });
    }
  };

  return {
    scrollToElement
  };
}
