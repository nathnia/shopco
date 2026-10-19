<script setup lang="ts">
import type { ProductsResponse } from '~/utils/product'

const route = useRoute()
const q = computed(() => String(route.query.q ?? '').trim())
const input = ref(q.value)
watch(q, v => (input.value = v))

const { data, error } = await useAsyncData(
    'search',
    () => q.value
        ? $fetch<ProductsResponse>(`${API_URL}/products/search`, { query: { q: q.value, limit: 30 } })
        : Promise.resolve(null),
    { watch: [q] },
)

const items = computed(() =>
    (data.value?.products ?? [])
        .filter(p => FASHION_CATEGORIES.includes(p.category))
        .map(toCard),
)
const total = computed(() => items.value.length)

function submit() {
    navigateTo({ path: '/search', query: { q: input.value.trim() } })
}
</script>

<template>
    <div class="mx-auto w-full max-w-337.5 px-4 pb-16 md:px-6 md:pb-24">
        <div class="border-t border-black/10 pt-5">
            <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm text-muted md:text-base">
                <NuxtLink to="/" class="hover:text-ink">Home</NuxtLink>
                <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                </svg>
                <span class="text-ink">Search</span>
            </nav>
        </div>

        <h1 class="mt-5 text-2xl font-bold md:text-4xl">Search</h1>

        <form class="mt-4 flex max-w-xl gap-3 md:hidden" role="search" @submit.prevent="submit">
            <label class="flex h-12 flex-1 items-center gap-3 rounded-full bg-surface px-4">
                <svg viewBox="0 0 24 24" class="size-6 shrink-0 text-[#999999]" fill="none" stroke="currentColor"
                    stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="7.5" />
                    <path d="M16.5 16.5L21.5 21.5" />
                </svg>
                <input v-model="input" type="search" name="q" aria-label="Search for products"
                    placeholder="Search for products..."
                    class="w-full bg-transparent outline-none placeholder:text-muted">
            </label>
            <button type="submit"
                class="h-12 rounded-full bg-ink px-8 font-medium text-white transition hover:bg-ink/85">
                Search
            </button>
        </form>

        <p v-if="!q" class="mt-6 text-muted md:mt-10">Type a product name to start searching.</p>

        <p v-else-if="error" class="mt-10 rounded-2xl border border-black/10 px-6 py-16 text-center text-muted">
            Could not load results. Please try again later.
        </p>

        <template v-else>
            <p class="mt-6 text-sm text-muted md:text-base">
                {{ total }} {{ total === 1 ? 'result' : 'results' }} for "{{ q }}"
            </p>

            <div v-if="items.length" class="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 md:gap-x-4 lg:grid-cols-4 lg:gap-5">
                <ProductCard v-for="p in items" :key="p.id" :product="p" />
            </div>
            <p v-else class="mt-6 rounded-2xl border border-black/10 px-6 py-16 text-center text-muted">
                No products found. Try a different keyword.
            </p>
        </template>
    </div>
</template>