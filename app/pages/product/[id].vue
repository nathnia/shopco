<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { formatPrice } from '~/utils/product'
import type { ApiReview } from '~/utils/product'

const route = useRoute()
const id = Number(route.params.id)

if (!Number.isInteger(id) || id < 1) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })
}

const store = useProductStore()
const { error } = await useAsyncData(`product-${id}`, () => store.fetchProduct(id).then(() => true))

if (error.value || !store.detail || store.detail.id !== id) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })
}

const api = store.detail
const discount = Math.round(api.discountPercentage)

const hasVariants = CLOTHING_CATEGORIES.includes(api.category)
const isShoes = api.category.includes('shoes')

const product = {
    name: api.title,
    rating: api.rating,
    price: priceAfterDiscount(api),
    oldPrice: discount > 0 ? api.price : undefined,
    discount,
    description: api.description,
    images: api.images?.length ? api.images : [api.thumbnail],
    colors: [
        { name: 'Olive', hex: '#4F4631' },
        { name: 'Green', hex: '#314F4A' },
        { name: 'Navy', hex: '#31344F' },
    ],
    sizes: isShoes ? ['39', '40', '41', '42', '43'] : ['Small', 'Medium', 'Large', 'X-Large'],
    hasVariants,
    reviewCount: api.reviews?.length ?? 0,
    details: [
        { label: 'Brand', value: api.brand },
        { label: 'Category', value: api.category.replace(/-/g, ' ') },
        { label: 'Availability', value: api.availabilityStatus },
        { label: 'Shipping', value: api.shippingInformation },
        { label: 'Warranty', value: api.warrantyInformation },
        { label: 'Returns', value: api.returnPolicy },
    ].filter((d): d is { label: string, value: string } => !!d.value),
}

const categoryLabel = api.category.replace(/-/g, ' ')

const selectedImage = ref(0)
const selectedColor = ref(product.colors[0]!.name)
const selectedSize = ref(product.sizes[2] ?? '')
const qty = ref(1)

const cart = useCartStore()
const added = ref(false)
function addToCart() {
    cart.addItem(
        {
            id: api.id,
            name: product.name,
            image: product.images[0] ?? api.thumbnail,
            price: product.price,
            oldPrice: product.oldPrice,
        },
        {
            size: product.hasVariants ? selectedSize.value : '',
            color: product.hasVariants ? selectedColor.value : '',
            qty: qty.value,
        },
    )
    added.value = true
    setTimeout(() => (added.value = false), 1500)
}

// Tabs
type Tab = 'details' | 'reviews' | 'faqs'
const tabs: { key: Tab, label: string }[] = [
    { key: 'details', label: 'Product Details' },
    { key: 'reviews', label: 'Rating & Reviews' },
    { key: 'faqs', label: 'FAQs' },
]
const activeTab = ref<Tab>('reviews')

const faqs = [
    { q: 'How does the size run?', a: 'The fit is relaxed. If you are between sizes, pick the smaller one for a closer fit.' },
    { q: 'How long does delivery take?', a: 'Orders usually arrive within 3 to 7 working days, depending on your location.' },
    { q: 'Can I return it?', a: 'Yes. Unworn items in their original condition can be returned within 30 days.' },
]

const reviews = (api.reviews ?? []).map((r: ApiReview) => ({
    name: r.reviewerName,
    rating: r.rating,
    time: new Date(r.date).getTime(),
    date: formatDate(r.date),
    text: r.comment,
}))

const starPath = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

const reviewSort = ref('latest')
const sortedReviews = computed(() =>
    reviewSort.value === 'highest'
        ? [...reviews].sort((a, b) => b.rating - a.rating)
        : [...reviews].sort((a, b) => b.time - a.time),
)

const showAll = ref(false)

const related = store.related
</script>

<template>
    <div class="mx-auto w-full max-w-337.5 px-4 pb-8 md:px-6 md:pb-12">
        <div class="border-t border-black/10 pt-5">
            <!-- Breadcrumb -->
            <nav aria-label="Breadcrumb"
                class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted md:text-base">
                <NuxtLink to="/" class="hover:text-ink">Home</NuxtLink>
                <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                </svg>
                <NuxtLink to="/category/casual" class="hover:text-ink">Shop</NuxtLink>
                <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                </svg>
                <span class="capitalize">{{ categoryLabel }}</span>
                <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                </svg>
                <span class="max-w-40 truncate text-ink md:max-w-xs">{{ product.name }}</span>
            </nav>
        </div>

        <!-- Gallery + info -->
        <div class="mt-5 grid gap-5 lg:grid-cols-2 lg:gap-10">
            <div class="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
                <div class="relative aspect-5/4 overflow-hidden rounded-2xl bg-surface lg:aspect-auto lg:flex-1">
                    <img :src="product.images[selectedImage]" :alt="product.name"
                        class="absolute inset-0 size-full object-contain p-4 md:p-8">
                </div>

                <div v-if="product.images.length > 1"
                    class="grid grid-cols-3 gap-3 lg:h-full lg:w-36 lg:grid-cols-1 lg:grid-rows-[repeat(var(--thumbs),minmax(0,1fr))] xl:w-40"
                    :style="{ '--thumbs': product.images.length }">
                    <button v-for="(img, i) in product.images" :key="img" type="button"
                        :aria-label="`Show photo ${i + 1}`" :aria-pressed="selectedImage === i"
                        class="relative aspect-5/4 overflow-hidden rounded-xl border-2 bg-surface lg:aspect-auto"
                        :class="selectedImage === i ? 'border-ink' : 'border-transparent'" @click="selectedImage = i">
                        <img :src="img" alt="" class="absolute inset-0 size-full object-contain p-1">
                    </button>
                </div>
            </div>

            <!-- Info -->
            <div>
                <h1
                    class="font-display text-2xl leading-tight font-black uppercase [-webkit-text-stroke:1px_currentColor] md:text-4xl">
                    {{ product.name }}
                </h1>

                <div class="mt-3 flex items-center gap-3">
                    <div class="relative flex w-max" role="img" :aria-label="`Rating ${product.rating} out of 5`">
                        <div class="flex text-black/15">
                            <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" class="size-5 md:size-6"
                                fill="currentColor" aria-hidden="true">
                                <path :d="starPath" />
                            </svg>
                        </div>
                        <div class="absolute inset-y-0 left-0 flex overflow-hidden text-amber-400"
                            :style="{ width: (product.rating / 5) * 100 + '%' }">
                            <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" class="size-5 md:size-6 shrink-0"
                                fill="currentColor" aria-hidden="true">
                                <path :d="starPath" />
                            </svg>
                        </div>
                    </div>
                    <p class="text-sm md:text-base">{{ product.rating.toFixed(1) }}<span class="text-muted">/5</span>
                    </p>
                </div>

                <div class="mt-3 flex flex-wrap items-center gap-3">
                    <p class="text-2xl font-bold md:text-3xl">${{ formatPrice(product.price) }}</p>
                    <template v-if="product.oldPrice">
                        <p class="text-2xl font-bold text-black/30 line-through md:text-3xl">${{
                            formatPrice(product.oldPrice) }}</p>
                        <span class="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-500 md:text-sm">
                            -{{ product.discount }}%
                        </span>
                    </template>
                </div>

                <p class="mt-4 text-sm text-muted md:text-base">{{ product.description }}</p>

                <!-- Colors -->
                <div v-if="product.hasVariants" class="mt-5 border-t border-black/10 pt-5">
                    <p class="text-sm text-muted md:text-base">Select Colors</p>
                    <div class="mt-3 flex gap-3">
                        <button v-for="c in product.colors" :key="c.name" type="button" :aria-label="c.name"
                            :aria-pressed="selectedColor === c.name"
                            class="grid size-9 place-items-center rounded-full md:size-10"
                            :style="{ backgroundColor: c.hex }" @click="selectedColor = c.name">
                            <svg v-if="selectedColor === c.name" viewBox="0 0 24 24" class="size-4 text-white"
                                fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round" aria-hidden="true">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Size -->
                <div v-if="product.hasVariants" class="mt-5 border-t border-black/10 pt-5">
                    <p class="text-sm text-muted md:text-base">Choose Size</p>
                    <div class="mt-3 flex flex-wrap gap-2 md:gap-3">
                        <button v-for="s in product.sizes" :key="s" type="button" :aria-pressed="selectedSize === s"
                            class="rounded-full px-5 py-2.5 text-sm transition md:px-6 md:py-3 md:text-base"
                            :class="selectedSize === s ? 'bg-ink text-white' : 'bg-surface text-black/60 hover:bg-black/10'"
                            @click="selectedSize = s">
                            {{ s }}
                        </button>
                    </div>
                </div>

                <!-- Quantity + add to cart -->
                <div class="mt-5 flex gap-3 border-t border-black/10 pt-5 md:gap-5">
                    <div
                        class="inline-flex h-12 items-center gap-5 rounded-full bg-surface px-4 md:h-14 md:gap-8 md:px-5">
                        <button type="button" aria-label="Decrease quantity" class="disabled:opacity-30"
                            :disabled="qty <= 1" @click="qty--">
                            <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" aria-hidden="true">
                                <path d="M5 12h14" />
                            </svg>
                        </button>
                        <span class="min-w-4 text-center">{{ qty }}</span>
                        <button type="button" aria-label="Increase quantity" @click="qty++">
                            <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" aria-hidden="true">
                                <path d="M5 12h14M12 5v14" />
                            </svg>
                        </button>
                    </div>

                    <button type="button"
                        class="h-12 flex-1 rounded-full bg-ink font-medium text-white transition hover:bg-ink/85 md:h-14"
                        @click="addToCart">
                        {{ added ? 'Added to Cart' : 'Add to Cart' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <section class="mt-10 md:mt-14">
            <div role="tablist" class="flex justify-between border-b border-black/10">
                <button v-for="t in tabs" :key="t.key" type="button" role="tab" :aria-selected="activeTab === t.key"
                    class="-mb-px border-b-2 pb-4 text-sm whitespace-nowrap transition md:flex-1 md:text-xl"
                    :class="activeTab === t.key ? 'border-ink font-medium text-ink' : 'border-transparent text-muted hover:text-ink'"
                    @click="activeTab = t.key">
                    {{ t.label }}
                </button>
            </div>

            <!-- Product details -->
            <dl v-if="activeTab === 'details'" class="mt-6 grid gap-4 md:mt-8 md:grid-cols-2">
                <div v-for="d in product.details" :key="d.label" class="rounded-2xl border border-black/10 p-5 md:p-6">
                    <dt class="text-sm text-muted">{{ d.label }}</dt>
                    <dd class="mt-1 font-medium md:text-lg">{{ d.value }}</dd>
                </div>
            </dl>

            <!-- Reviews -->
            <div v-else-if="activeTab === 'reviews'" class="mt-6 md:mt-8">
                <div class="flex items-center justify-between gap-3">
                    <h2 class="text-xl font-bold md:text-2xl">
                        All Reviews <span class="text-sm font-normal text-muted md:text-base">({{ product.reviewCount
                            }})</span>
                    </h2>

                    <div class="flex items-center gap-2 md:gap-3">
                        <button type="button" aria-label="Filter reviews"
                            class="inline-flex size-10 items-center justify-center rounded-full bg-surface md:size-12">
                            <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />
                            </svg>
                        </button>
                        <div class="relative hidden md:block">
                            <select v-model="reviewSort" aria-label="Sort reviews"
                                class="h-12 appearance-none rounded-full bg-surface pr-12 pl-5 font-medium outline-none">
                                <option value="latest">Latest</option>
                                <option value="highest">Highest rating</option>
                            </select>
                            <svg viewBox="0 0 24 24"
                                class="pointer-events-none absolute top-1/2 right-5 size-4 -translate-y-1/2" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                aria-hidden="true">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                        <button type="button"
                            class="h-10 rounded-full bg-ink px-5 text-sm font-medium text-white transition hover:bg-ink/85 md:h-12 md:px-6 md:text-base">
                            Write a Review
                        </button>
                    </div>
                </div>

                <p v-if="!sortedReviews.length" class="mt-6 text-muted">No reviews yet.</p>

                <div class="mt-5 grid gap-4 md:mt-6 md:grid-cols-2 md:gap-5">
                    <article v-for="(r, i) in sortedReviews" :key="`${r.name}-${i}`"
                        class="rounded-2xl border border-black/10 p-5 md:p-7"
                        :class="i >= 3 && !showAll ? 'hidden md:block' : ''">
                        <div class="flex items-start justify-between">
                            <div class="relative flex w-max" role="img" :aria-label="`Rating ${r.rating} out of 5`">
                                <div class="flex text-black/15">
                                    <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" class="size-5 md:size-6"
                                        fill="currentColor" aria-hidden="true">
                                        <path :d="starPath" />
                                    </svg>
                                </div>
                                <div class="absolute inset-y-0 left-0 flex overflow-hidden text-amber-400"
                                    :style="{ width: (r.rating / 5) * 100 + '%' }">
                                    <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" class="size-5 md:size-6 shrink-0"
                                        fill="currentColor" aria-hidden="true">
                                        <path :d="starPath" />
                                    </svg>
                                </div>
                            </div>
                            <button type="button" aria-label="More options" class="text-black/40 hover:text-ink">
                                <svg viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true">
                                    <circle cx="5" cy="12" r="1.6" />
                                    <circle cx="12" cy="12" r="1.6" />
                                    <circle cx="19" cy="12" r="1.6" />
                                </svg>
                            </button>
                        </div>

                        <p class="mt-3 flex items-center gap-1 text-lg font-bold md:text-xl">
                            {{ r.name }}
                            <svg viewBox="0 0 24 24" class="size-5 text-green-500 md:size-6" aria-hidden="true">
                                <circle cx="12" cy="12" r="12" fill="currentColor" />
                                <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="white" stroke-width="2.5"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </p>

                        <p class="mt-2 text-sm text-muted md:text-base">"{{ r.text }}"</p>
                        <p class="mt-4 text-sm font-medium text-black/60 md:mt-6 md:text-base">Posted on {{ r.date }}
                        </p>
                    </article>
                </div>

                <div v-if="sortedReviews.length > 3 && !showAll" class="mt-6 text-center md:mt-8">
                    <button type="button"
                        class="h-12 rounded-full border border-black/10 px-10 font-medium transition hover:bg-surface md:px-14"
                        @click="showAll = true">
                        Load More Reviews
                    </button>
                </div>
            </div>

            <!-- FAQs -->
            <div v-else class="mt-6 space-y-3 md:mt-8">
                <details v-for="f in faqs" :key="f.q" class="group rounded-2xl border border-black/10 p-5 md:p-6">
                    <summary
                        class="flex cursor-pointer list-none items-center justify-between gap-4 font-medium md:text-lg">
                        {{ f.q }}
                        <svg viewBox="0 0 24 24" class="size-5 shrink-0 transition group-open:rotate-180" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </summary>
                    <p class="mt-3 text-muted">{{ f.a }}</p>
                </details>
            </div>
        </section>

        <!-- You might also like -->
        <section v-if="related.length" class="mt-14 pb-16 md:mt-20 md:pb-0">
            <h2
                class="text-center font-display text-3xl font-black uppercase [-webkit-text-stroke:1.5px_currentColor] md:text-5xl">
                You might <br class="md:hidden">also like
            </h2>

            <div
                class="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 scroll-px-4 scrollbar-none [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-14 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
                <ProductCard v-for="p in related" :key="p.id" :product="p"
                    class="w-[72%] shrink-0 snap-start md:w-auto" />
            </div>
        </section>
    </div>
</template>