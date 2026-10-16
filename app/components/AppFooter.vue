<script setup lang="ts">
const columns = [
    { title: 'Company', links: ['About', 'Features', 'Works', 'Career'] },
    { title: 'Help', links: ['Customer Support', 'Delivery Details', 'Terms & Conditions', 'Privacy Policy'] },
    { title: 'FAQ', links: ['Account', 'Manage Deliveries', 'Orders', 'Payments'] },
    { title: 'Resources', links: ['Free eBooks', 'Development Tutorial', 'How to - Blog', 'Youtube Playlist'] },
]

const socials = ['lucide:twitter', 'lucide:facebook', 'lucide:instagram', 'lucide:github']
const payments = [
    { name: 'Visa', icon: 'logos:visa', w: 37, h: 12 },
    { name: 'Mastercard', icon: 'logos:mastercard', w: 24, h: 19 },
    { name: 'PayPal', icon: 'logos:paypal', w: 16, h: 19 },
    { name: 'Apple Pay', icon: 'logos:apple-pay', w: 34, h: 14 },
    { name: 'Google Pay', icon: 'logos:google-pay', w: 35, h: 14 },
]
</script>

<template>
    <footer class="relative mt-32 bg-surface">
        <div class="mx-auto w-full max-w-337.5 px-4 md:px-6">
            <div
                class="-translate-y-1/2 flex flex-col gap-6 rounded-3xl bg-ink px-6 py-8 text-white md:flex-row md:items-center md:justify-between md:px-16 md:py-9">
                <h2 class="font-display text-3xl leading-tight uppercase md:text-4xl lg:max-w-none">
                    Stay upto date about <br class="hidden lg:block">our latest offers
                </h2>

                <form class="flex w-full flex-col gap-3 md:max-w-sm" @submit.prevent>
                    <label class="flex h-12 items-center gap-3 rounded-full bg-white px-4">
                        <Icon name="lucide:mail" class="size-5 text-muted" />
                        <input type="email" placeholder="Enter your email address"
                            class="w-full bg-transparent text-base text-ink outline-none placeholder:text-muted">
                    </label>
                    <button type="submit"
                        class="h-12 rounded-full bg-white font-medium text-ink transition hover:bg-white/90">
                        Subscribe to Newsletter
                    </button>
                </form>
            </div>
        </div>

        <div class="mx-auto -mt-16 w-full max-w-337.5 px-4 pb-20 md:-mt-8 md:px-6">
            <div class="grid grid-cols-2 gap-10 md:flex md:justify-between md:gap-8">
                <!-- Brand -->
                <div class="col-span-2 max-w-xs md:col-auto">
                    <p class="logo font-display text-[32px] leading-none">SHOP.CO</p>
                    <p class="mt-6 text-base text-muted">
                        We have clothes that suits your style and which you're proud to wear. From women to men.
                    </p>
                    <div class="mt-8 flex gap-3">
                        <a v-for="icon in socials" :key="icon" href="#"
                            class="grid size-7 place-items-center rounded-full border border-black/20 bg-white hover:bg-ink hover:text-white">
                            <Icon :name="icon" class="size-4" />
                        </a>
                    </div>
                </div>

                <!-- Link columns -->
                <div v-for="col in columns" :key="col.title">
                    <h3 class="cap-trim text-base font-medium tracking-[0.2em] uppercase">{{ col.title }}</h3>
                    <ul class="mt-6 space-y-4 text-base text-muted">
                        <li v-for="item in col.links" :key="item">
                            <NuxtLink to="/" class="hover:text-ink">{{ item }}</NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>

            <hr class="mt-12 border-black/10">

            <div class="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
                <p class="text-sm text-muted">Shop.co &copy; 2000-2023, All Rights Reserved</p>
                <ul class="flex gap-3">
                    <li v-for="p in payments" :key="p.name" :title="p.name"
                        class="grid h-7.5 w-11.5 place-items-center rounded-md border border-black/10 bg-white">
                        <Icon :name="p.icon" :style="{ width: p.w + 'px', height: p.h + 'px' }" />
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>