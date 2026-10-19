<script setup lang="ts">
const menuOpen = ref(false)

const links = [
    { label: 'Shop', to: '/', hasDropdown: true },
    { label: 'On Sale', to: '/' },
    { label: 'New Arrivals', to: '/' },
    { label: 'Brands', to: '/' },
]

watch(menuOpen, (open) => {
    if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
    <header class="sticky top-0 z-40 bg-white">
        <div class="mx-auto flex h-16 w-full max-w-337.5 items-center gap-4 px-4 md:h-24 md:gap-10 md:px-6">
            <button type="button" class="md:hidden" aria-label="Open menu" @click="menuOpen = true">
                <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <NuxtLink to="/"
                class="logo font-display font-black [-webkit-text-stroke:1px_currentColor] text-2xl leading-none md:text-[32px]">
                SHOP.CO
            </NuxtLink>

            <nav class="hidden items-center gap-8 md:flex">
                <NuxtLink v-for="link in links" :key="link.label" :to="link.to"
                    class="flex items-center gap-1 text-lg hover:opacity-70">
                    {{ link.label }}
                    <svg v-if="link.hasDropdown" viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </NuxtLink>
            </nav>

            <label class="hidden h-12 flex-1 items-center gap-3 rounded-full bg-surface px-4 md:flex">
                <svg viewBox="0 0 24 24" class="size-6 shrink-0 text-olive-400 olive-500" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                    aria-hidden="true">
                    <circle cx="11" cy="11" r="7.5" />
                    <path d="M16.5 16.5L21.5 21.5" />
                </svg>
                <input type="text" placeholder="Search for products..."
                    class="w-full bg-transparent text-lg text-olive-700 olive-500 outline-none ">
            </label>

            <div class="ml-auto flex items-center gap-3 md:ml-0">
                <button type="button" class="md:hidden" aria-label="Search">
                    <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="7.5" />
                        <path d="M16.5 16.5L21.5 21.5" />
                    </svg>
                </button>
                <NuxtLink to="/cart" aria-label="Cart">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M3 3h2l.5 3m0 0L7 15h11l3-9z" />
                        <circle cx="8" cy="20" r="1" />
                        <circle cx="17" cy="20" r="1" />
                    </svg>
                </NuxtLink>
                <button type="button" aria-label="Account">
                    <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M6.2 18.5c1.1-2 3-3.1 5.8-3.1s4.7 1.1 5.8 3.1" />
                    </svg>
                </button>
            </div>
        </div>

        <Teleport to="body">
            <Transition enter-active-class="transition-opacity duration-200"
                leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
                leave-to-class="opacity-0">
                <div v-if="menuOpen" class="fixed inset-0 z-50 bg-black/50 md:hidden" @click="menuOpen = false" />
            </Transition>

            <Transition enter-active-class="transition-transform duration-300"
                leave-active-class="transition-transform duration-300" enter-from-class="-translate-x-full"
                leave-to-class="-translate-x-full">
                <aside v-if="menuOpen" class="fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 md:hidden">
                    <div class="mb-8 flex items-center justify-between">
                        <span
                            class="font-display font-black [-webkit-text-stroke:1px_currentColor] text-2xl leading-none">SHOP.CO</span>
                        <button type="button" aria-label="Close menu" @click="menuOpen = false">
                            <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav class="flex flex-col gap-5">
                        <NuxtLink v-for="link in links" :key="link.label" :to="link.to"
                            class="flex items-center justify-between text-lg" @click="menuOpen = false">
                            {{ link.label }}
                            <svg v-if="link.hasDropdown" viewBox="0 0 24 24" class="size-5" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                aria-hidden="true">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </NuxtLink>
                    </nav>
                </aside>
            </Transition>
        </Teleport>
    </header>
</template>