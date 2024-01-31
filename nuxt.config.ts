// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  modules: ['@nuxt/image', '@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  googleFonts: {
    display: 'swap',
    families: {
      Montserrat: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    }
  }
});
