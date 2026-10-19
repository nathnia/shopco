<script setup lang="ts">
const stats = [
    { value: '200+', label: 'International Brands' },
    { value: '2,000+', label: 'High-Quality Products' },
    { value: '30,000+', label: 'Happy Customers' },
]

const brands = [
    { name: 'Versace', src: '/images/brands/versace.svg', },
    { name: 'Zara', src: '/images/brands/zara.svg', },
    { name: 'Gucci', src: '/images/brands/gucci.svg', },
    { name: 'Prada', src: '/images/brands/prada.svg', },
    { name: 'Calvin Klein', src: '/images/brands/calvin.svg', },
]

const newArrivals = [
    { name: 'T-shirt with Tape Details', image: '/images/products/tshirt-tape.png', rating: 4.5, price: 120 },
    { name: 'Skinny Fit Jeans', image: '/images/products/skinny-jeans.png', rating: 3.5, price: 240, oldPrice: 260, discount: 20 },
    { name: 'Checkered Shirt', image: '/images/products/checkered-shirt.png', rating: 4.5, price: 180 },
    { name: 'Sleeve Striped T-shirt', image: '/images/products/striped-tshirt.png', rating: 4.5, price: 130, oldPrice: 160, discount: 30 },
]

const topSelling = [
    { name: 'Vertical Striped Shirt', image: '/images/products/striped-shirt.png', rating: 5, price: 212, oldPrice: 232, discount: 20 },
    { name: 'Courage Graphic T-shirt', image: '/images/products/graphic-tshirt.png', rating: 4, price: 145 },
    { name: 'Loose Fit Bermuda Shorts', image: '/images/products/bermuda-shorts.png', rating: 3, price: 80 },
    { name: 'Faded Skinny Jeans', image: '/images/products/faded-jeans.png', rating: 4.5, price: 210 },
]

const productSections = [
    { title: 'New Arrivals', products: newArrivals },
    { title: 'Top Selling', products: topSelling },
]

const styles = [
    { name: 'Casual', to: '/category/casual', image: '/images/styles/casual.png', span: 'md:col-span-1' },
    { name: 'Formal', to: '/category/formal', image: '/images/styles/formal.png', span: 'md:col-span-2' },
    { name: 'Party', to: '/category/party', image: '/images/styles/party.png', span: 'md:col-span-2' },
    { name: 'Gym', to: '/category/gym', image: '/images/styles/gym.png', span: 'md:col-span-1' },
]
const reviews = [
    { name: 'Sarah M.', text: 'I\'m blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I\'ve bought has exceeded my expectations.' },
    { name: 'Alex K.', text: 'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.' },
    { name: 'James L.', text: 'Great range of cuts and colors. My order arrived quickly and the quality held up after several washes.' },
    { name: 'Maya D.', text: 'Easy to browse, easy to order. The sizing guide was accurate and nothing needed to be returned.' },
    { name: 'Rafi A.', text: 'Good basics that are actually well made. I wear the jeans almost every week and they still look new.' },
    { name: 'Dewi P.', text: 'Fast delivery and the clothes look just like the photos. I will definitely shop here again.' },
]

const starPath = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

const scroller = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)

function updateEdges() {
    const el = scroller.value
    if (!el) return
    atStart.value = el.scrollLeft < 8
    atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
}

function scrollReviews(dir: 1 | -1) {
    const el = scroller.value
    const card = el?.firstElementChild as HTMLElement | undefined
    if (!el || !card) return
    el.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: 'smooth' })
}

const blurSteps = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4]

function edgeMask(side: 'left' | 'right', i: number) {
    const step = 100 / blurSteps.length
    const start = i * step
    const stops = [`transparent ${start}%`, `black ${start + step}%`]
    if (start + 2 * step <= 100) stops.push(`black ${start + 2 * step}%`)
    if (start + 3 * step <= 100) stops.push(`transparent ${start + 3 * step}%`)
    return `linear-gradient(${side === 'right' ? 'to right' : 'to left'}, ${stops.join(', ')})`
}

function layerStyle(side: 'left' | 'right', i: number) {
    const blur = `blur(${blurSteps[i]}px)`
    const mask = edgeMask(side, i)
    return { backdropFilter: blur, webkitBackdropFilter: blur, maskImage: mask, webkitMaskImage: mask }
}

onMounted(updateEdges)
</script>

<template>
    <div>
        <!-- Hero -->
        <section class="bg-surface">
            <div class="mx-auto grid w-full max-w-337.5 px-4 md:grid-cols-2 md:px-6">
                <div class="self-center py-10 md:py-20">
                    <h1
                        class="font-display origin-left scale-x-100 text-[clamp(30px,8.4vw,44px)] leading-[1.1] font-black tracking-normal uppercase [-webkit-text-stroke:1.5px_currentColor] md:scale-x-110 md:text-5xl md:leading-[1.15] md:tracking-wide md:[-webkit-text-stroke:3px_currentColor] xl:text-[56px]">
                        Find clothes <br>
                        that matches <br>
                        your style
                    </h1>

                    <p class="mt-5 max-w-md text-sm text-muted md:mt-6">
                        Browse through our diverse range of meticulously crafted garments, designed to bring out your
                        individuality and cater to your sense of style.
                    </p>

                    <NuxtLink to="/"
                        class="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-14 font-medium text-white transition hover:bg-ink/85 md:mt-8 md:w-auto">
                        Shop Now
                    </NuxtLink>

                    <ul class="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-4 md:mt-12 md:justify-start md:gap-x-8">
                        <li v-for="(s, i) in stats" :key="s.label" class="md:pr-8"
                            :class="i < stats.length - 1 ? 'md:border-r md:border-black/10' : ''">
                            <p class="text-2xl font-bold md:text-4xl">{{ s.value }}</p>
                            <p class="text-xs text-muted md:text-base">{{ s.label }}</p>
                        </li>
                    </ul>
                </div>

                <div class="relative -mx-4 -mt-8 h-128 overflow-hidden md:mx-0 md:mt-0 md:h-auto md:overflow-visible">
                    <img src="/images/hero.jpg" alt="Two models wearing denim jackets"
                        class="absolute inset-0 size-full origin-top scale-[1.2] object-cover object-top md:scale-100">

                    <svg viewBox="0 0 56 56" class="absolute top-10 right-2 w-10 md:top-16 md:right-6 md:w-19"
                        fill="currentColor" aria-hidden="true">
                        <path
                            d="M28 0C28 15.46 40.54 28 56 28 40.54 28 28 40.54 28 56 28 40.54 15.46 28 0 28 15.46 28 28 15.46 28 0Z" />
                    </svg>
                    <svg viewBox="0 0 56 56" class="absolute top-1/2 left-0 w-6 md:top-1/3 md:w-11" fill="currentColor"
                        aria-hidden="true">
                        <path
                            d="M28 0C28 15.46 40.54 28 56 28 40.54 28 28 40.54 28 56 28 40.54 15.46 28 0 28 15.46 28 28 15.46 28 0Z" />
                    </svg>
                </div>
            </div>
        </section>

        <!-- Brands -->
        <section class="relative z-10 -mt-16 bg-ink text-white md:mt-0">
            <ul
                class="mx-auto flex w-full max-w-337.5 flex-wrap items-center justify-center gap-x-10 gap-y-6 px-4 py-8 md:justify-between md:px-6 md:py-10">
                <li v-for="b in brands" :key="b.name" class="flex items-center">
                    <img :src="b.src" :alt="b.name" class="h-6 w-auto object-contain brightness-0 invert md:h-7">
                </li>
            </ul>
        </section>

        <!-- Products -->
        <div class="mx-auto w-full max-w-337.5 px-4 md:px-6">
            <section v-for="(sec, i) in productSections" :key="sec.title" class="py-12 md:py-16"
                :class="i > 0 ? 'border-t border-black/10' : ''">
                <h2
                    class="text-center font-display text-3xl font-black uppercase [-webkit-text-stroke:1.5px_currentColor] md:text-5xl">
                    {{ sec.title }}
                </h2>

                <div
                    class="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 scroll-px-4 scrollbar-none [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-14 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
                    <ProductCard v-for="p in sec.products" :key="p.name" :product="p"
                        class="w-[72%] shrink-0 snap-start md:w-auto" />
                </div>

                <div class="mt-8 text-center md:mt-9">
                    <NuxtLink to="/"
                        class="inline-flex h-12 w-full items-center justify-center rounded-full border border-black/10 px-14 font-medium transition hover:bg-surface md:w-auto">
                        View All
                    </NuxtLink>
                </div>
            </section>
        </div>

        <!-- Dress style -->
        <section class="mx-auto w-full max-w-337.5 px-4 md:px-6">
            <div class="rounded-[28px] bg-surface px-4 py-10 md:rounded-[40px] md:px-16 md:py-18">
                <h2
                    class="text-center font-display text-3xl font-black uppercase [-webkit-text-stroke:1.5px_currentColor] md:text-5xl">
                    Browse by dress style
                </h2>

                <div class="mt-8 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
                    <NuxtLink v-for="st in styles" :key="st.name" :to="st.to"
                        class="relative block h-48 overflow-hidden rounded-3xl bg-white md:h-72" :class="st.span">
                        <img :src="st.image" :alt="st.name"
                            class="absolute inset-0 size-full object-cover object-top-right">
                        <span class="relative z-10 block p-6 text-2xl font-bold md:p-9 md:text-4xl">{{ st.name }}</span>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- Reviews -->
        <section class="pt-16 pb-16 md:pt-20 md:pb-10">
            <div class="mx-auto flex w-full max-w-337.5 items-end justify-between gap-4 px-4 md:px-6">
                <h2
                    class="font-display text-3xl font-black uppercase [-webkit-text-stroke:1.5px_currentColor] md:text-5xl">
                    Our happy <br class="md:hidden">customers
                </h2>

                <div class="flex gap-4">
                    <button type="button" aria-label="Previous reviews" class="hover:opacity-60"
                        @click="scrollReviews(-1)">
                        <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2.5"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button type="button" aria-label="Next reviews" class="hover:opacity-60" @click="scrollReviews(1)">
                        <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2.5"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="relative mt-5 md:mt-7">
                <div ref="scroller"
                    class="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-(--edge) scroll-pl-(--edge) [--edge:1rem] md:[--edge:max(1.5rem,calc((100%-84.375rem)/2+1.5rem))] scrollbar-none [&::-webkit-scrollbar]:hidden"
                    @scroll.passive="updateEdges">
                    <article v-for="r in reviews" :key="r.name"
                        class="w-full shrink-0 snap-start rounded-3xl border border-black/10 p-5 md:w-[calc((100%-2.5rem)/3)] md:px-8 md:py-7">
                        <div class="flex gap-1 text-amber-400" role="img" aria-label="5 out of 5 stars">
                            <svg v-for="n in 5" :key="n" viewBox="0 0 24 24" class="size-5 md:size-6"
                                fill="currentColor" aria-hidden="true">
                                <path :d="starPath" />
                            </svg>
                        </div>

                        <p class="mt-3 flex items-center gap-1 text-lg font-bold md:mt-4 md:text-xl">
                            {{ r.name }}
                            <svg viewBox="0 0 24 24" class="size-5 text-green-500 md:size-6" aria-hidden="true">
                                <circle cx="12" cy="12" r="12" fill="currentColor" />
                                <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="white" stroke-width="2.5"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </p>

                        <p class="mt-2 text-sm text-muted md:text-base">"{{ r.text }}"</p>
                    </article>
                </div>

                <div class="pointer-events-none absolute inset-y-0 left-0 hidden w-20 transition-opacity duration-200 md:block md:w-64"
                    :class="atStart ? 'opacity-0' : 'opacity-100'" aria-hidden="true">
                    <div v-for="(_, i) in blurSteps" :key="i" class="absolute inset-0" :style="layerStyle('left', i)" />
                </div>
                <div class="pointer-events-none absolute inset-y-0 right-0 hidden w-20 transition-opacity duration-200 md:block md:w-64"
                    :class="atEnd ? 'opacity-0' : 'opacity-100'" aria-hidden="true">
                    <div v-for="(_, i) in blurSteps" :key="i" class="absolute inset-0"
                        :style="layerStyle('right', i)" />
                </div>
            </div>
        </section>
    </div>
</template>