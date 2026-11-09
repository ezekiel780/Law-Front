const zendeskWidgetKey =
  process.env.ZENDESK_WIDGET_KEY || '9260bd42-a47b-47b8-b580-2ad44ee594a7'

export default {
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'NWLR Online',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Most Authoritative, Consistent, Exhaustive Law Reports in Nigeria',
      },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon_new.ico',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/icon_new.png',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css',
      },
    ],
    script: [
      ...(zendeskWidgetKey
        ? [
            {
              src: `https://static.zdassets.com/ekr/snippet.js?key=${encodeURIComponent(
                zendeskWidgetKey
              )}`,
              id: 'ze-snippet',
              defer: true,
            },
          ]
        : []),
    ],
  },

  // Avoid eager route-chunk bursts on dashboards with many visible links.
  // This prevents infrastructure rate limits from being consumed by speculative requests.
  router: {
    prefetchLinks: false,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main.css',
    'vue-slick-carousel/dist/vue-slick-carousel.css',
    'vue-slick-carousel/dist/vue-slick-carousel-theme.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/vue-slick-carousel.js' },
    { src: '@/plugins/api-factory.js' },
    { src: '@/plugins/app-user.js' },
    { src: '@/plugins/auth-token-guard.client.js', mode: 'client' },
    { src: '@/plugins/helper.js' },
    { src: '@/plugins/error-handler.js' },
    { src: '@/plugins/notifications.js' },
    { src: '@/plugins/validate.js' },
    { src: '@/plugins/vuex-persister.js' },
    { src: '@/plugins/auth-session-sync.client.js', mode: 'client' },
    { src: '@/plugins/ip-auth.client.js', mode: 'client' },
    { src: '@/plugins/flip.js', ssr: false },
    { src: '@/plugins/service-worker-cleanup.client.js', mode: 'client' },
    { src: '@/plugins/chunk-load-recovery.client.js', mode: 'client' },
    { src: '@/plugins/entitlement-redirect.client.js', mode: 'client' },
    { src: '@/plugins/zendesk.client.js', mode: 'client' },
  ],

  env: {
    BASE_URL: process.env.BASE_URL,
    LARAVEL_API_BASE_URL:
      process.env.LARAVEL_API_BASE_URL ||
      process.env.NUXT_ENV_LARAVEL_API_BASE_URL,
    APP_URL: process.env.APP_URL,
    PORT: process.env.PORT,
    PDF_TRON_KEY: process.env.PDF_TRON_KEY,
    ZENDESK_WIDGET_KEY: zendeskWidgetKey,
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/moment'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/moment',
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap',
    '@nuxtjs/google-gtag',
  ],

  'google-gtag': {
    id: process.env.GTAG_ID || 'G-T1NERHK473',
    debug: process.env.NODE_ENV !== 'production',
    config: {
      anonymize_ip: true,
      send_page_view: true,
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.BASE_URL,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    // Disable runtime service-worker caching. Old cached Nuxt chunks caused
    // stale deployments and repeated chunk fetch failures.
    workbox: false,
    icon: {
      source: '@/static/icon_new.png',
      fileName: 'icon_new.png',
    },
    meta: {
      name: 'NWLR Online',
      author: 'Joel Okoromi',
      description: 'Nigeria Weekly Law Reports Online',
      theme_color: '#08085E',
      ogHost: 'https://app.nwlronline.com',
    },
    manifest: {
      lang: 'en',
      name: 'NWLR Online',
      short_name: 'NWLR',
      description: 'Nigeria Weekly Law Reports Online',
    },
  },

  sitemap: {
    hostname: 'https://nwlronline.com',
    gzip: true,
    exclude: [
      '/body-of-benchers',
      '/court-of-appeal',
      '/editorial-board',
      '/feedback',
      '/supreme-court',
      '/webinar',
      '/auth/registration-successful',
      '/dashboard/**',
    ],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
}
