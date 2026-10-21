<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { formatDate, formatPrice } from '~/utils/product'

const route = useRoute()
const cart = useCartStore()

const id = computed(() => String(route.params.id))
const order = computed(() => cart.getOrder(id.value))
const justPlaced = computed(() => route.query.placed === '1')
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
                <NuxtLink to="/orders" class="hover:text-ink">My Orders</NuxtLink>
                <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                </svg>
                <span class="text-ink">{{ id }}</span>
            </nav>
        </div>

        <p v-if="!cart.loaded" class="mt-10 text-muted">Loading order...</p>

        <div v-else-if="!order" class="mt-10 rounded-2xl border border-black/10 px-6 py-16 text-center">
            <p class="text-xl font-bold">Order not found</p>
            <p class="mt-2 text-muted">We could not find an order with this ID on this device.</p>
            <NuxtLink to="/orders"
                class="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-ink px-10 font-medium text-white transition hover:bg-ink/85">
                View my orders
            </NuxtLink>
        </div>

        <template v-else>
            <div v-if="justPlaced" class="mt-5 flex items-center gap-4 rounded-2xl bg-surface p-5 md:p-6" role="status">
                <svg viewBox="0 0 24 24" class="size-10 shrink-0 text-green-500" aria-hidden="true">
                    <circle cx="12" cy="12" r="12" fill="currentColor" />
                    <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
                <div>
                    <p class="text-lg font-bold md:text-xl">Thank you, your order has been placed</p>
                    <p class="text-sm text-muted md:text-base">We saved it in My Orders.</p>
                </div>
            </div>

            <h1
                class="mt-5 font-display text-3xl font-black uppercase [-webkit-text-stroke:1.5px_currentColor] md:mt-6 md:text-5xl">
                {{ order.id }}
            </h1>
            <p class="mt-2 text-sm text-muted md:text-base">
                Placed on {{ formatDate(order.createdAt) }}
                <template v-if="order.cartId"> · Cart ID #{{ order.cartId }}</template>
            </p>

            <div class="mt-5 grid items-start gap-5 md:mt-6 lg:grid-cols-[1.45fr_1fr] lg:gap-6">
                <!-- Items -->
                <ul class="min-w-0 divide-y divide-black/10 rounded-2xl border border-black/10 p-4 md:p-6">
                    <li v-for="item in order.items" :key="item.key"
                        class="flex gap-4 py-4 first:pt-0 last:pb-0 md:gap-5 md:py-5">
                        <NuxtLink :to="`/product/${item.id}`"
                            class="size-20 shrink-0 overflow-hidden rounded-xl bg-surface md:size-28">
                            <img :src="item.image" :alt="item.name" class="size-full object-contain">
                        </NuxtLink>
                        <div class="flex min-w-0 flex-1 flex-col">
                            <h2 class="text-base font-bold md:text-xl">{{ item.name }}</h2>
                            <p v-if="item.size" class="mt-1 text-xs md:text-sm">Size: <span class="text-muted">{{
                                item.size }}</span></p>
                            <p v-if="item.color" class="text-xs md:text-sm">Color: <span class="text-muted">{{
                                item.color }}</span></p>
                            <div class="mt-auto flex items-end justify-between pt-2">
                                <p class="text-sm text-muted md:text-base">Qty {{ item.qty }}</p>
                                <p class="text-lg font-bold md:text-2xl">${{ formatPrice(item.price * item.qty) }}</p>
                            </div>
                        </div>
                    </li>
                </ul>

                <div class="space-y-5">
                    <!-- Customer -->
                    <section class="rounded-2xl border border-black/10 p-5 md:p-6">
                        <h2 class="text-xl font-bold md:text-2xl">Shipping details</h2>
                        <dl class="mt-4 space-y-3 text-sm md:text-base">
                            <div>
                                <dt class="text-muted">Name</dt>
                                <dd class="font-medium">{{ order.customer.name }}</dd>
                            </div>
                            <div>
                                <dt class="text-muted">Phone</dt>
                                <dd class="font-medium">{{ order.customer.phone }}</dd>
                            </div>
                            <div>
                                <dt class="text-muted">Address</dt>
                                <dd class="font-medium">{{ order.customer.address }}</dd>
                            </div>
                            <div v-if="order.customer.note">
                                <dt class="text-muted">Note</dt>
                                <dd class="font-medium">{{ order.customer.note }}</dd>
                            </div>
                            <div>
                                <dt class="text-muted">Payment</dt>
                                <dd class="font-medium">{{ order.payment }}</dd>
                            </div>
                        </dl>
                    </section>

                    <!-- Totals -->
                    <section class="rounded-2xl border border-black/10 p-5 md:p-6">
                        <h2 class="text-xl font-bold md:text-2xl">Order Summary</h2>
                        <dl class="mt-4 space-y-4 text-base md:text-lg">
                            <div class="flex items-center justify-between">
                                <dt class="text-muted">Subtotal</dt>
                                <dd class="font-bold">${{ formatPrice(order.subtotal) }}</dd>
                            </div>
                            <div v-if="order.discountPercent" class="flex items-center justify-between">
                                <dt class="text-muted">Discount (-{{ order.discountPercent }}%)</dt>
                                <dd class="font-bold text-red-500">-${{ formatPrice(order.discount) }}</dd>
                            </div>
                            <div class="flex items-center justify-between">
                                <dt class="text-muted">Delivery Fee</dt>
                                <dd class="font-bold">${{ order.deliveryFee }}</dd>
                            </div>
                        </dl>
                        <hr class="my-4 border-black/10">
                        <div class="flex items-center justify-between">
                            <p class="text-base md:text-lg">Total</p>
                            <p class="text-2xl font-bold">${{ formatPrice(order.total) }}</p>
                        </div>
                    </section>

                    <NuxtLink to="/"
                        class="inline-flex h-12 w-full items-center justify-center rounded-full border border-black/10 font-medium transition hover:bg-surface">
                        Continue shopping
                    </NuxtLink>
                </div>
            </div>
        </template>
    </div>
</template>