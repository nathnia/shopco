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
                <Icon name="lucide:menu" class="size-6" />
            </button>

            <NuxtLink to="/" class="logo font-display text-2xl leading-none md:text-[32px]">
                SHOP.CO
            </NuxtLink>

            <nav class="hidden items-center gap-8 md:flex">
                <NuxtLink v-for="link in links" :key="link.label" :to="link.to"
                    class="flex items-center gap-1 text-lg hover:opacity-70">
                    {{ link.label }}
                    <Icon v-if="link.hasDropdown" name="lucide:chevron-down" class="size-5" />
                </NuxtLink>
            </nav>

            <label class="hidden h-12 flex-1 items-center gap-3 rounded-full bg-surface px-4 md:flex">
                <Icon name="lucide:search" class="size-5 text-muted" />
                <input type="text" placeholder="Search for products..."
                    class="w-full bg-transparent text-lg outline-none placeholder:text-muted">
            </label>

            <div class="ml-auto flex items-center gap-3 md:ml-0">
                <button type="button" class="md:hidden" aria-label="Search">
                    <Icon name="lucide:search" class="size-5" />
                </button>
                <button type="button" aria-label="Cart">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M3 3h2l.5 3m0 0L7 15h11l3-9z" />
                        <circle cx="8" cy="20" r="1" />
                        <circle cx="17" cy="20" r="1" />
                    </svg>
                </button>
                <button type="button" aria-label="Account">
                    <Icon name="ph:user-circle-bold" size="24" />
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
                        <span class="font-display text-2xl leading-none">SHOP.CO</span>
                        <button type="button" aria-label="Close menu" @click="menuOpen = false">
                            <Icon name="lucide:x" class="size-6" />
                        </button>
                    </div>

                    <nav class="flex flex-col gap-5">
                        <NuxtLink v-for="link in links" :key="link.label" :to="link.to"
                            class="flex items-center justify-between text-lg" @click="menuOpen = false">
                            {{ link.label }}
                            <Icon v-if="link.hasDropdown" name="lucide:chevron-down" class="size-5" />
                        </NuxtLink>
                    </nav>
                </aside>
            </Transition>
        </Teleport>
    </header>
</template>