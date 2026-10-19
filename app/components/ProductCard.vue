<script setup lang="ts">
import { formatPrice } from '~/utils/product';

interface Product {
    id: number
    name: string
    image: string
    rating: number
    price: number
    oldPrice?: number
    discount?: number
}

const props = defineProps<{ product: Product }>()

const href = computed(() => `/product/${props.product.id}`)

const starPath = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
</script>

<template>
    <NuxtLink :to="href" class="@container block">
        <div class="aspect-square overflow-hidden rounded-2xl bg-surface">
            <img :src="product.image" :alt="product.name" class="size-full object-contain">
        </div>

        <h3
            class="mt-2 truncate text-sm font-bold @min-[240px]:mt-3 @min-[240px]:text-base @min-[300px]:mt-4 @min-[300px]:overflow-visible @min-[300px]:text-xl @min-[300px]:whitespace-normal">
            {{ product.name }}</h3>

        <div class="mt-1 flex items-center gap-2 @min-[300px]:gap-3">
            <div class="relative flex w-max" role="img" :aria-label="`Rating ${product.rating} out of 5`">
                <div class="flex text-black/15">
                    <svg v-for="n in 5" :key="n" viewBox="0 0 24 24"
                        class="size-3.5 @min-[240px]:size-4 @min-[300px]:size-5" fill="currentColor" aria-hidden="true">
                        <path :d="starPath" />
                    </svg>
                </div>
                <div class="absolute inset-y-0 left-0 flex overflow-hidden text-amber-400"
                    :style="{ width: (product.rating / 5) * 100 + '%' }">
                    <svg v-for="n in 5" :key="n" viewBox="0 0 24 24"
                        class="size-3.5 shrink-0 @min-[240px]:size-4 @min-[300px]:size-5" fill="currentColor"
                        aria-hidden="true">
                        <path :d="starPath" />
                    </svg>
                </div>
            </div>
            <p class="text-xs @min-[240px]:text-sm @min-[300px]:text-base">
                {{ product.rating.toFixed(1) }}<span class="text-muted">/5</span>
            </p>
        </div>

        <div class="mt-1 flex flex-wrap items-center gap-x-2 @min-[300px]:gap-x-3">
            <p class="text-base font-bold @min-[240px]:text-xl @min-[300px]:text-2xl">${{ formatPrice(product.price) }}
            </p>
            <template v-if="product.oldPrice">
                <p class="text-base font-bold text-black/30 line-through @min-[240px]:text-xl @min-[300px]:text-2xl">${{
                    formatPrice(product.oldPrice) }}</p>
                <span
                    class="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-500 @min-[240px]:px-3 @min-[240px]:py-1 @min-[240px]:text-xs">
                    -{{ product.discount }}%
                </span>
            </template>
        </div>
    </NuxtLink>
</template>