
import vuetify from "vite-plugin-vuetify";
export default defineNuxtConfig({
  ssr: false,
  typescript: {
    shim: false,
  },
  app: {
    head: {
      title:
        "مرحباً بك في لوحة تحكم إدارة الملفات",
        link: [
          { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap' }
        ]
    },
    
  },
  nitro: {
    serveStatic: true,
  },
  sourcemap: { server: false, client: false },
  devServerHandlers: [],
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify'],
  },
  plugins: ['~/plugins/vuetify.ts'],
  modules: [
    '@pinia/nuxt',
  ],
  pinia: {
    autoImports: [
      // تضمن أن المتجر يتم استيراده تلقائيًا
      'defineStore',
      'storeToRefs',
    ],
  },
});
