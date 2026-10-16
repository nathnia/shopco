import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/4.x/api/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxt/image", "@nuxt/fonts", "@nuxt/icon"],

  css: ["~/assets/css/main.css"],

  icon: {
    cssLayer: "base",
  },

  fonts: {
    families: [
      { name: "Satoshi", provider: "fontshare", weights: [400, 500, 700] },
      { name: "Archivo Black", provider: "google", weights: [400] },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      title: "SHOP.CO - Find Clothes That Matches Your Style",
      meta: [
        {
          name: "description",
          content:
            "Browse through our diverse range of meticulously crafted garments.",
        },
      ],
    },
  },
});
