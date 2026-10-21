<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { formatDate, formatPrice } from '~/utils/product'

const cart = useCartStore()
</script>

<template>
    <div class="mx-auto w-full max-w-337.5 px-4 pb-12 md:px-6 md:pb-20">
        <div class="border-t border-black/10 pt-5">
            <!-- Breadcrumb -->
            <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-muted md:text-base">
                <NuxtLink to="/" class="hover:text-ink">Home</NuxtLink>
                <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                </svg>
                <span class="text-ink">My Orders</span>
            </nav>

            <h1
                class="mt-4 font-display text-3xl font-black uppercase [-webkit-text-stroke:1.5px_currentColor] md:mt-6 md:text-5xl">
                My orders
            </h1>
        </div>

        <p v-if="!cart.loaded" class="mt-10 text-muted">Loading your orders...</p>

        <div v-else-if="!cart.orders.length" class="mt-10 rounded-2xl border border-black/10 px-6 py-16 text-center">
            <p class="text-xl font-bold">No orders yet</p>
            <p class="mt-2 text-muted">Your orders will show up here after you check out.</p>
            <NuxtLink to="/"
                class="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-ink px-10 font-medium text-white transition hover:bg-ink/85">
                Start shopping
            </NuxtLink>
        </div>

        <ul v-else class="mt-5 space-y-4 md:mt-6">
            <li v-for="o in cart.orders" :key="o.id">
                <NuxtLink :to="`/orders/${o.id}`"
                    class="block rounded-2xl border border-black/10 p-5 transition hover:bg-surface md:p-6">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p class="text-lg font-bold md:text-xl">{{ o.id }}</p>
                            <p class="text-sm text-muted">{{ formatDate(o.createdAt) }}</p>
                        </div>
                        <p class="text-xl font-bold md:text-2xl">${{ formatPrice(o.total) }}</p>
                    </div>

                    <div class="mt-4 flex items-center gap-2">
                        <div v-for="item in o.items.slice(0, 4)" :key="item.key"
                            class="size-14 overflow-hidden rounded-lg bg-surface md:size-16">
                            <img :src="item.image" :alt="item.name" class="size-full object-contain">
                        </div>
                        <p v-if="o.items.length > 4" class="text-sm text-muted">+{{ o.items.length - 4 }} more</p>
                    </div>
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>