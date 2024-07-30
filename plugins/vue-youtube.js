import { createManager } from '@vue-youtube/core';

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    const manager = createManager();
    nuxtApp.vueApp.use(manager);
  }
});
