<script setup lang="ts">
import { formatPrice } from '~/utils/product'

const cart = useCartStore()

const paymentMethods = ['Cash on Delivery', 'Bank Transfer', 'E-Wallet']
const payment = ref(paymentMethods[0]!)

const form = reactive({ name: '', phone: '', address: '', note: '' })
const errors = ref<Record<string, string>>({})
const submitting = ref(false)

function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Please enter your full name'
    if (!/^\+?[0-9\s-]{8,15}$/.test(form.phone.trim())) e.phone = 'Please enter a valid phone number'
    if (form.address.trim().length < 10) e.address = 'Please enter your full address'
    return e
}

async function submit() {
    errors.value = validate()
    if (Object.keys(errors.value).length) return

    submitting.value = true
    const order = await cart.placeOrder(
        { name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim(), note: form.note.trim() },
        payment.value,
    )
    submitting.value = false

    if (order) await navigateTo({ path: '/cart', query: { ordered: order.id } })
}
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
                <NuxtLink to="/cart" class="hover:text-ink">Cart</NuxtLink>
                <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                </svg>
                <span class="text-ink">Checkout</span>
            </nav>

            <h1
                class="mt-4 font-display text-3xl font-black uppercase [-webkit-text-stroke:1.5px_currentColor] md:mt-6 md:text-5xl">
                Checkout
            </h1>
        </div>

        <ClientOnly>
            <template #fallback>
                <p class="mt-10 text-muted">Loading...</p>
            </template>

            <p v-if="!cart.loaded" class="mt-10 text-muted">Loading...</p>

            <div v-else-if="!cart.lines.length" class="mt-10 rounded-2xl border border-black/10 px-6 py-16 text-center">
                <p class="text-xl font-bold">Your cart is empty</p>
                <p class="mt-2 text-muted">Add something to your cart before checking out.</p>
                <NuxtLink to="/"
                    class="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-ink px-10 font-medium text-white transition hover:bg-ink/85">
                    Continue shopping
                </NuxtLink>
            </div>

            <form v-else class="mt-5 grid items-start gap-5 md:mt-6 lg:grid-cols-[1.45fr_1fr] lg:gap-6" novalidate
                @submit.prevent="submit">
                <!-- Shipping + payment -->
                <div class="min-w-0 space-y-6 rounded-2xl border border-black/10 p-5 md:p-6">
                    <div>
                        <h2 class="text-xl font-bold md:text-2xl">Shipping details</h2>

                        <div class="mt-5 space-y-4">
                            <div>
                                <label for="name" class="text-sm text-muted md:text-base">Full name</label>
                                <input id="name" v-model="form.name" type="text" autocomplete="name"
                                    class="mt-2 h-12 w-full rounded-full bg-surface px-5 outline-none"
                                    :aria-invalid="!!errors.name">
                                <p v-if="errors.name" class="mt-1 text-sm text-red-500" role="alert">{{ errors.name }}
                                </p>
                            </div>

                            <div>
                                <label for="phone" class="text-sm text-muted md:text-base">Phone number</label>
                                <input id="phone" v-model="form.phone" type="tel" autocomplete="tel"
                                    class="mt-2 h-12 w-full rounded-full bg-surface px-5 outline-none"
                                    :aria-invalid="!!errors.phone">
                                <p v-if="errors.phone" class="mt-1 text-sm text-red-500" role="alert">{{ errors.phone }}
                                </p>
                            </div>

                            <div>
                                <label for="address" class="text-sm text-muted md:text-base">Address</label>
                                <textarea id="address" v-model="form.address" rows="3" autocomplete="street-address"
                                    class="mt-2 w-full resize-none rounded-2xl bg-surface px-5 py-3 outline-none"
                                    :aria-invalid="!!errors.address" />
                                <p v-if="errors.address" class="mt-1 text-sm text-red-500" role="alert">{{
                                    errors.address
                                    }}</p>
                            </div>

                            <div>
                                <label for="note" class="text-sm text-muted md:text-base">Note (optional)</label>
                                <input id="note" v-model="form.note" type="text"
                                    class="mt-2 h-12 w-full rounded-full bg-surface px-5 outline-none">
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-black/10 pt-6">
                        <h2 class="text-xl font-bold md:text-2xl">Payment method</h2>
                        <div class="mt-4 flex flex-wrap gap-2 md:gap-3">
                            <button v-for="m in paymentMethods" :key="m" type="button" :aria-pressed="payment === m"
                                class="rounded-full px-5 py-2.5 text-sm transition md:px-6 md:py-3 md:text-base"
                                :class="payment === m ? 'bg-ink text-white' : 'bg-surface text-black/60 hover:bg-black/10'"
                                @click="payment = m">
                                {{ m }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Summary -->
                <aside class="rounded-2xl border border-black/10 p-5 md:p-6 lg:sticky lg:top-28">
                    <div class="flex items-center justify-between gap-3">
                        <h2 class="text-xl font-bold md:text-2xl">Order Summary</h2>
                        <p v-if="cart.cartId" class="text-xs text-muted md:text-sm">Cart ID: #{{ cart.cartId }}</p>
                    </div>

                    <ul class="mt-5 divide-y divide-black/10">
                        <li v-for="item in cart.lines" :key="item.key" class="flex gap-3 py-3 first:pt-0">
                            <div class="size-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                                <img :src="item.image" :alt="item.name" class="size-full object-contain">
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-bold md:text-base">{{ item.name }}</p>
                                <p class="text-xs text-muted md:text-sm">
                                    <template v-if="item.size">{{ item.size }}, {{ item.color }} · </template>Qty {{
                                        item.qty }}
                                </p>
                            </div>
                            <p class="text-sm font-bold md:text-base">${{ formatPrice(item.price * item.qty) }}</p>
                        </li>
                    </ul>

                    <hr class="my-5 border-black/10">

                    <dl class="space-y-4 text-base md:text-lg">
                        <div class="flex items-center justify-between">
                            <dt class="text-muted">Subtotal</dt>
                            <dd class="font-bold">${{ formatPrice(cart.subtotal) }}</dd>
                        </div>
                        <div v-if="cart.promoPercent" class="flex items-center justify-between">
                            <dt class="text-muted">Discount (-{{ cart.promoPercent }}%)</dt>
                            <dd class="font-bold text-red-500">-${{ formatPrice(cart.discount) }}</dd>
                        </div>
                        <div class="flex items-center justify-between">
                            <dt class="text-muted">Delivery Fee</dt>
                            <dd class="font-bold">${{ cart.deliveryFee }}</dd>
                        </div>
                    </dl>

                    <hr class="my-5 border-black/10">

                    <div class="flex items-center justify-between">
                        <p class="text-base md:text-lg">Total</p>
                        <p class="text-2xl font-bold">${{ formatPrice(cart.total) }}</p>
                    </div>

                    <button type="submit" :disabled="submitting"
                        class="mt-5 inline-flex h-14 w-full items-center justify-center rounded-full bg-ink font-medium text-white transition hover:bg-ink/85 disabled:opacity-60">
                        {{ submitting ? 'Placing order...' : 'Place Order' }}
                    </button>
                </aside>
            </form>
        </ClientOnly>
    </div>
</template>