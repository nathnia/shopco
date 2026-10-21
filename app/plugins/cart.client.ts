// Membaca cart dan order dari localStorage setelah aplikasi tampil di browser.

import { useCartStore } from "~/stores/cart";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    useCartStore().load();
  });
});
