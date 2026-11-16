// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/images/logo.png' }]
    }
  },

  runtimeConfig: {
    public: {
      igKey: process.env.INSTAGRAM_KEY
    }
  },

  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },

  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt'
  ],

  image: {
    provider: 'ipx'
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  googleFonts: {
    // Keep local startup independent of the Google Fonts download service.
    download: process.env.NODE_ENV === 'production',
    useStylesheet: true,
    display: 'swap',
    preload: true,
    families: {
      'Big+Shoulders+Display': [700, 800, 900],
      'DM+Serif+Display': { wght: [400], ital: [400] },
      Manrope: [400, 500, 600, 700]
    }
  },

  compatibilityDate: '2024-07-30'
});
