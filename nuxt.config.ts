// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      // TIU logo + EQ burst on a dark tile. SVG for modern browsers, PNG fallback,
      // and a larger PNG for iOS home screens.
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      // Everything under `public` is serialized into every page's HTML.
      // Never put API keys or tokens here.
      //
      // Netlify sets CONTEXT at build time (production, deploy-preview,
      // branch-deploy). The booking form only sends inquiries from production.
      deployContext: process.env.CONTEXT || 'local',
      // Netlify's URL is the site's primary production address in every
      // context, so previews still point canonical/OG at the live site.
      siteUrl: (process.env.URL || 'http://localhost:3000').replace(/\/$/, '')
    }
  },

  // Static files with per-context content (previews are disallowed).
  nitro: {
    prerender: { routes: ['/robots.txt', '/sitemap.xml'] }
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
