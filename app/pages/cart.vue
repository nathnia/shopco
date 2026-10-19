<script setup lang="ts">
interface CartItem {
    id: number
    name: string
    image: string
    size: string
    color: string
    price: number
    qty: number
}

const items = ref<CartItem[]>([
    { id: 1, name: 'Gradient Graphic T-shirt', image: '/images/products/graphic-tshirt.png', size: 'Large', color: 'White', price: 145, qty: 1 },
    { id: 2, name: 'Checkered Shirt', image: '/images/products/checkered-shirt.png', size: 'Medium', color: 'Red', price: 180, qty: 1 },
    { id: 3, name: 'Skinny Fit Jeans', image: '/images/products/skinny-jeans.png', size: 'Large', color: 'Blue', price: 240, qty: 1 },
])

const deliveryFee = 15
const discountPercent = ref(20)

const subtotal = computed(() => items.value.reduce((sum, i) => sum + i.price * i.qty, 0))
const discount = computed(() => Math.round(subtotal.value * discountPercent.value / 100))
const total = computed(() => subtotal.value - discount.value + (items.value.length ? deliveryFee : 0))

function changeQty(item: CartItem, delta: number) {
    item.qty = Math.max(1, item.qty + delta)
}

function removeItem(id: number) {
    items.value = items.value.filter(i => i.id !== id)
}

const promoCodes: Record<string, number> = { SHOP20: 20, SHOP30: 30 }
const promo = ref('')
const promoMessage = ref('')

function applyPromo() {
    const percent = promoCodes[promo.value.trim().toUpperCase()]
    if (percent) {
        discountPercent.value = percent
        promoMessage.value = `Promo applied: ${percent}% off`
    } else {
        promoMessage.value = 'This promo code is not valid'
    }
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
                <span class="text-ink">Cart</span>
            </nav>

            <h1
                class="mt-4 font-display text-3xl font-black uppercase [-webkit-text-stroke:1.5px_currentColor] md:mt-6 md:text-5xl">
                Your cart
            </h1>
        </div>

        <!-- Cart kosong -->
        <div v-if="!items.length" class="mt-10 rounded-2xl border border-black/10 px-6 py-16 text-center">
            <p class="text-xl font-bold">Your cart is empty</p>
            <p class="mt-2 text-muted">Add something you like and it will show up here.</p>
            <NuxtLink to="/"
                class="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-ink px-10 font-medium text-white transition hover:bg-ink/85">
                Continue shopping
            </NuxtLink>
        </div>

        <div v-else class="mt-5 grid items-start gap-5 md:mt-6 lg:grid-cols-[1.45fr_1fr] lg:gap-6">
            <!-- Items -->
            <ul class="min-w-0 divide-y divide-black/10 rounded-2xl border border-black/10 p-4 md:p-6">
                <li v-for="item in items" :key="item.id" class="flex gap-4 py-4 first:pt-0 last:pb-0 md:gap-5 md:py-5">
                    <div class="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface md:h-32 md:w-32">
                        <img :src="item.image" :alt="item.name" class="h-full w-full object-contain">
                    </div>

                    <div class="flex min-w-0 flex-1 flex-col">
                        <div class="flex items-start justify-between gap-3">
                            <h2 class="text-base font-bold md:text-xl">{{ item.name }}</h2>
                            <button type="button" :aria-label="`Remove ${item.name}`"
                                class="shrink-0 text-red-500 hover:opacity-70" @click="removeItem(item.id)">
                                <svg viewBox="0 0 24 24" class="size-5 md:size-6" fill="currentColor"
                                    aria-hidden="true">
                                    <rect x="9" y="2" width="6" height="3" rx="1.2" />
                                    <rect x="3" y="4.5" width="18" height="3" rx="1.2" />
                                    <path d="M5 9h14v10a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 19z" />
                                    <path d="M9.5 12v6M14.5 12v6" fill="none" stroke="white" stroke-width="1.8"
                                        stroke-linecap="round" />
                                </svg>
                            </button>
                        </div>

                        <p class="mt-1 text-xs md:text-sm">Size: <span class="text-muted">{{ item.size }}</span></p>
                        <p class="text-xs md:text-sm">Color: <span class="text-muted">{{ item.color }}</span></p>

                        <div class="mt-auto flex items-end justify-between pt-2">
                            <p class="text-xl font-bold md:text-2xl">${{ item.price }}</p>

                            <div
                                class="inline-flex h-9 items-center gap-4 rounded-full bg-surface px-3 md:h-11 md:gap-5 md:px-4">
                                <button type="button" aria-label="Decrease quantity" class="disabled:opacity-30"
                                    :disabled="item.qty <= 1" @click="changeQty(item, -1)">
                                    <svg viewBox="0 0 24 24" class="size-4 md:size-5" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" aria-hidden="true">
                                        <path d="M5 12h14" />
                                    </svg>
                                </button>
                                <span class="min-w-4 text-center text-sm md:text-base">{{ item.qty }}</span>
                                <button type="button" aria-label="Increase quantity" @click="changeQty(item, 1)">
                                    <svg viewBox="0 0 24 24" class="size-4 md:size-5" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" aria-hidden="true">
                                        <path d="M5 12h14M12 5v14" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <!-- Order summary -->
            <aside class="rounded-2xl border border-black/10 p-5 md:p-6 lg:sticky lg:top-28">
                <h2 class="text-xl font-bold md:text-2xl">Order Summary</h2>

                <dl class="mt-5 space-y-4 text-base md:text-lg">
                    <div class="flex items-center justify-between">
                        <dt class="text-muted">Subtotal</dt>
                        <dd class="font-bold">${{ subtotal }}</dd>
                    </div>
                    <div class="flex items-center justify-between">
                        <dt class="text-muted">Discount (-{{ discountPercent }}%)</dt>
                        <dd class="font-bold text-red-500">-${{ discount }}</dd>
                    </div>
                    <div class="flex items-center justify-between">
                        <dt class="text-muted">Delivery Fee</dt>
                        <dd class="font-bold">${{ deliveryFee }}</dd>
                    </div>
                </dl>

                <hr class="my-5 border-black/10">

                <div class="flex items-center justify-between">
                    <p class="text-base md:text-lg">Total</p>
                    <p class="text-2xl font-bold">${{ total }}</p>
                </div>

                <form class="mt-5 flex gap-3" @submit.prevent="applyPromo">
                    <label class="flex h-12 flex-1 items-center gap-3 rounded-full bg-surface px-4">
                        <svg viewBox="0 0 24 24" class="size-5 shrink-0 text-black/40" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path
                                d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                            <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                        </svg>
                        <input v-model="promo" type="text" placeholder="Add promo code" aria-label="Promo code"
                            class="w-full bg-transparent outline-none placeholder:text-muted">
                    </label>
                    <button type="submit"
                        class="h-12 rounded-full bg-ink px-8 font-medium text-white transition hover:bg-ink/85 md:px-10">
                        Apply
                    </button>
                </form>
                <p v-if="promoMessage" class="mt-2 text-sm text-muted" role="status">{{ promoMessage }}</p>

                <button type="button"
                    class="mt-5 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ink font-medium text-white transition hover:bg-ink/85">
                    Go to Checkout
                    <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </aside>
        </div>
    </div>
</template>