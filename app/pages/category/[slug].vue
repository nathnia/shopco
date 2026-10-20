<script setup lang="ts">
import type { SortKey } from '~/stores/products'
import { dressStyles, type CardProduct } from '~/utils/product'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const style = computed(() => dressStyles.find(d => d.slug === slug.value))
const styleName = computed(() => style.value?.name ?? '')

if (!style.value) {
    throw createError({ statusCode: 404, statusMessage: 'Style not found', fatal: true })
}

const LIMIT = 9
const page = ref(1)
const sort = ref('popular')
const activeCategory = ref(style.value?.category ?? '')

const store = useProductStore()

const { error } = await useAsyncData(
    'category-products',
    () => store.fetchByCategory({
        category: activeCategory.value,
        page: page.value,
        limit: LIMIT,
        sort: sort.value as SortKey,
    }).then(() => true),
    { watch: [activeCategory, page, sort] },
)

await useAsyncData('categories', () => store.fetchCategories().then(() => true))
const categoryList = computed(() => store.fashionCategories)

const items = computed(() => store.listItems)
const total = computed(() => store.listTotal)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / LIMIT)))
const firstShown = computed(() => (total.value ? (page.value - 1) * LIMIT + 1 : 0))
const lastShown = computed(() => (page.value - 1) * LIMIT + items.value.length)

watch([sort, activeCategory], () => {
    page.value = 1
})
watch(slug, () => {
    activeCategory.value = style.value?.category ?? ''
    page.value = 1
})

function goPage(n: number) {
    page.value = n
    if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

const pages = computed(() => {
    const n = totalPages.value
    const c = page.value
    if (n <= 5) return Array.from({ length: n }, (_, i) => i + 1)
    const nums = [...new Set([1, n, c - 1, c, c + 1].filter(p => p >= 1 && p <= n))].sort((a, b) => a - b)
    const out: (number | string)[] = []
    nums.forEach((p, i) => {
        if (i && p - nums[i - 1]! > 1) out.push('...')
        out.push(p)
    })
    return out
})

const sizes = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large']
const colors = [
    { name: 'Green', hex: '#00C12B' },
    { name: 'Red', hex: '#F50606' },
    { name: 'Yellow', hex: '#F5DD06' },
    { name: 'Orange', hex: '#F57906' },
    { name: 'Cyan', hex: '#06CAF5' },
    { name: 'Blue', hex: '#063AF5' },
    { name: 'Purple', hex: '#7D06F5' },
    { name: 'Pink', hex: '#F506A4' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
]

// Filter
const showFilters = ref(false)

watch(showFilters, (open) => {
    if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})
onBeforeUnmount(() => {
    if (import.meta.client) document.body.style.overflow = ''
})
const selectedColor = ref('')
const selectedSize = ref('Large')

const PRICE_MIN = 0
const PRICE_MAX = 200
const priceMin = ref(PRICE_MIN)
const priceMax = ref(PRICE_MAX)
const applied = ref({ min: PRICE_MIN, max: PRICE_MAX })

const fillLeft = computed(() => ((priceMin.value - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100)
const fillRight = computed(() => 100 - ((priceMax.value - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100)

function onMin(e: Event) {
    const input = e.target as HTMLInputElement
    priceMin.value = Math.min(Number(input.value), priceMax.value - 10)
    input.value = String(priceMin.value)
}

function onMax(e: Event) {
    const input = e.target as HTMLInputElement
    priceMax.value = Math.max(Number(input.value), priceMin.value + 10)
    input.value = String(priceMax.value)
}

function applyFilter() {
    applied.value = { min: priceMin.value, max: priceMax.value }
    showFilters.value = false
}

const list = computed(() =>
    items.value.filter((p: CardProduct) => p.price >= applied.value.min && p.price <= applied.value.max),
)
</script>

<template>
    <div class="mx-auto w-full max-w-337.5 px-4 pb-16 md:px-6 md:pb-24">
        <div class="border-t border-black/10 pt-5">
            <!-- Breadcrumb -->
            <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-muted md:text-base">
                <NuxtLink to="/" class="hover:text-ink">Home</NuxtLink>
                <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                </svg>
                <span class="text-ink">{{ styleName }}</span>
            </nav>
        </div>

        <div class="mt-5 grid items-start gap-5 lg:grid-cols-[295px_1fr]">
            <!-- Sidebar filter -->
            <div v-if="showFilters" class="fixed inset-0 z-50 bg-black/50 lg:hidden" @click="showFilters = false" />

            <aside
                class="fixed inset-x-0 top-20 bottom-0 z-60 overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 lg:static lg:z-auto lg:overflow-visible lg:rounded-2xl lg:border lg:border-black/10 lg:pb-5"
                :class="showFilters ? 'block' : 'hidden lg:block'">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-bold">Filters</h2>
                    <button type="button" class="text-black/40 lg:hidden" aria-label="Close filters"
                        @click="showFilters = false">
                        <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                    <svg viewBox="0 0 24 24" class="hidden size-5 text-black/40 lg:block" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        aria-hidden="true">
                        <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />
                    </svg>
                </div>

                <ul class="mt-5 border-t border-black/10 pt-5">
                    <li v-for="c in categoryList" :key="c.slug">
                        <button type="button" class="flex w-full items-center justify-between py-2 hover:text-ink"
                            :class="c.slug === activeCategory ? 'font-bold text-ink' : 'text-black/60'"
                            @click="activeCategory = c.slug">
                            {{ c.name }}
                            <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </li>
                </ul>

                <div class="mt-5 border-t border-black/10 pt-5">
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-bold">Price</h3>
                        <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                    </div>

                    <div class="relative mx-2 mt-6 mb-9 h-4">
                        <div class="absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full bg-surface" />
                        <div class="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink"
                            :style="{ left: fillLeft + '%', right: fillRight + '%' }" />
                        <input type="range" :min="PRICE_MIN" :max="PRICE_MAX" step="5" :value="priceMin"
                            aria-label="Minimum price" class="range absolute inset-0 w-full" @input="onMin">
                        <input type="range" :min="PRICE_MIN" :max="PRICE_MAX" step="5" :value="priceMax"
                            aria-label="Maximum price" class="range absolute inset-0 w-full" @input="onMax">

                        <span class="absolute top-full mt-1.5 -translate-x-1/2 text-sm font-medium"
                            :style="{ left: fillLeft + '%' }">${{ priceMin }}</span>
                        <span class="absolute top-full mt-1.5 -translate-x-1/2 text-sm font-medium"
                            :style="{ left: (100 - fillRight) + '%' }">${{ priceMax }}</span>
                    </div>
                </div>

                <!-- Colors -->
                <div class="mt-5 border-t border-black/10 pt-5">
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-bold">Colors</h3>
                        <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                    </div>
                    <div class="mt-5 flex flex-wrap gap-3">
                        <button v-for="c in colors" :key="c.name" type="button" :aria-label="c.name"
                            :aria-pressed="selectedColor === c.name"
                            class="grid size-9 place-items-center rounded-full border border-black/20"
                            :style="{ backgroundColor: c.hex }"
                            @click="selectedColor = selectedColor === c.name ? '' : c.name">
                            <svg v-if="selectedColor === c.name" viewBox="0 0 24 24" class="size-4"
                                :class="c.name === 'White' || c.name === 'Yellow' ? 'text-black' : 'text-white'"
                                fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round" aria-hidden="true">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Size -->
                <div class="mt-5 border-t border-black/10 pt-5">
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-bold">Size</h3>
                        <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                    </div>
                    <div class="mt-5 flex flex-wrap gap-2">
                        <button v-for="s in sizes" :key="s" type="button" :aria-pressed="selectedSize === s"
                            class="rounded-full px-5 py-2.5 text-sm transition"
                            :class="selectedSize === s ? 'bg-ink text-white' : 'bg-surface text-black/60 hover:bg-black/10'"
                            @click="selectedSize = s">
                            {{ s }}
                        </button>
                    </div>
                </div>

                <!-- Dress style -->
                <div class="mt-5 border-t border-black/10 pt-5">
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-bold">Dress Style</h3>
                        <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                    </div>
                    <ul class="mt-3">
                        <li v-for="d in dressStyles" :key="d.slug">
                            <NuxtLink :to="`/category/${d.slug}`"
                                class="flex w-full items-center justify-between py-2 hover:text-ink"
                                :class="d.slug === slug ? 'font-bold text-ink' : 'text-black/60'">
                                {{ d.name }}
                                <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div class="mt-5 border-t border-black/10 pt-5 lg:hidden">
                    <label class="flex items-center justify-between gap-3">
                        <span class="text-xl font-bold">Sort by</span>
                        <select v-model="sort"
                            class="rounded-full bg-surface px-4 py-2 text-sm font-medium outline-none">
                            <option value="popular">Most Popular</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </label>
                </div>

                <button type="button"
                    class="mt-5 h-12 w-full rounded-full bg-ink font-medium text-white transition hover:bg-ink/85"
                    @click="applyFilter">
                    Apply Filter
                </button>
            </aside>

            <!-- Products -->
            <section>
                <div class="flex items-center justify-between gap-3">
                    <div class="flex min-w-0 items-baseline gap-3">
                        <h1 class="text-2xl font-bold md:text-4xl">
                            {{ styleName }}
                        </h1>
                        <p class="truncate text-xs text-muted md:text-sm lg:hidden">
                            Showing {{ firstShown }}-{{ lastShown }} of {{ total }} Products
                        </p>
                    </div>

                    <button type="button"
                        class="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-surface lg:hidden"
                        aria-label="Toggle filters" :aria-expanded="showFilters" @click="showFilters = !showFilters">
                        <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />
                        </svg>
                    </button>

                    <div class="hidden items-center gap-3 text-base lg:flex">
                        <p class="text-muted">Showing {{ firstShown }}-{{ lastShown }} of {{ total }} Products</p>
                        <label class="flex items-center gap-1">
                            <span class="text-muted">Sort by:</span>
                            <select v-model="sort" class="bg-transparent font-medium outline-none">
                                <option value="popular">Most Popular</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div v-if="list.length"
                    class="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-5 md:gap-x-4 lg:grid-cols-3 lg:gap-5">
                    <ProductCard v-for="p in list" :key="p.id" :product="p" />
                </div>
                <p v-else-if="error" class="mt-10 rounded-2xl border border-black/10 px-6 py-16 text-center text-muted">
                    Could not load products. Please try again later.
                </p>
                <p v-else class="mt-10 rounded-2xl border border-black/10 px-6 py-16 text-center text-muted">
                    No products in this price range. Try widening the price filter.
                </p>

                <!-- Pagination -->
                <nav v-if="totalPages > 1" aria-label="Pagination"
                    class="mt-8 flex items-center justify-between gap-1 border-t border-black/10 pt-4 md:mt-10 md:gap-2 md:pt-5">
                    <button type="button"
                        class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/10 px-2.5 text-xs font-medium hover:bg-surface disabled:opacity-40 md:h-10 md:gap-2 md:px-4 md:text-sm"
                        :disabled="page === 1" @click="goPage(page - 1)">
                        <svg viewBox="0 0 24 24" class="size-3.5 md:size-4" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </button>

                    <ul class="flex items-center text-xs md:gap-1 md:text-sm">
                        <li v-for="(n, i) in pages" :key="i">
                            <span v-if="n === '...'" class="px-1.5 text-muted md:px-2">...</span>
                            <button v-else type="button" class="size-8 rounded-lg font-medium md:size-10"
                                :class="page === n ? 'bg-surface' : 'text-black/50 hover:bg-surface'"
                                :aria-current="page === n ? 'page' : undefined" @click="goPage(n as number)">
                                {{ n }}
                            </button>
                        </li>
                    </ul>

                    <button type="button"
                        class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/10 px-2.5 text-xs font-medium hover:bg-surface disabled:opacity-40 md:h-10 md:gap-2 md:px-4 md:text-sm"
                        :disabled="page === totalPages" @click="goPage(page + 1)">
                        Next
                        <svg viewBox="0 0 24 24" class="size-3.5 md:size-4" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </nav>
            </section>
        </div>
    </div>
</template>

<style scoped>
/* Slider harga dua titik: input saling menumpuk, hanya bulatannya yang bisa ditarik */
.range {
    pointer-events: none;
    appearance: none;
    background: transparent;
    height: 100%;
}

.range::-webkit-slider-runnable-track {
    background: transparent;
}

.range::-moz-range-track {
    background: transparent;
}

.range::-webkit-slider-thumb {
    pointer-events: auto;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    background: #000;
    cursor: pointer;
}

.range::-moz-range-thumb {
    pointer-events: auto;
    width: 16px;
    height: 16px;
    border: 0;
    border-radius: 9999px;
    background: #000;
    cursor: pointer;
}
</style>