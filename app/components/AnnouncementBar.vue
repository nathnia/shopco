<script setup lang="ts">
const visible = ref(true)
</script>

<template>
    <div v-if="visible" class="bg-ink text-white">
        <div class="container-x relative flex h-9 items-center justify-center text-xs md:text-sm">
            <p>
                Sign up and get 20% off to your first order.
                <NuxtLink to="/" class="font-medium underline underline-offset-2">Sign Up Now</NuxtLink>
            </p>

            <button type="button" aria-label="Close announcement" class="absolute right-4 hidden md:block"
                @click="visible = false">
                <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="3"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>