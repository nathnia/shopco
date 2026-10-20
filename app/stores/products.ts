import {
  API_URL,
  CLOTHING_CATEGORIES,
  FASHION_CATEGORIES,
  toCard,
  type ApiProduct,
  type CardProduct,
  type CategoryItem,
  type ProductsResponse,
} from "~/utils/product";

export type SortKey = "popular" | "price-asc" | "price-desc";

export const useProductStore = defineStore("products", () => {
  // ===== State =====
  const categories = ref<CategoryItem[]>([]);
  const homeProducts = ref<CardProduct[]>([]);
  const listItems = ref<CardProduct[]>([]);
  const listTotal = ref(0);
  const searchItems = ref<CardProduct[]>([]);
  const detail = ref<ApiProduct | null>(null);
  const related = ref<CardProduct[]>([]);

  // ===== Getters =====
  const fashionCategories = computed(() =>
    categories.value.filter((c) => FASHION_CATEGORIES.includes(c.slug)),
  );
  const newArrivals = computed(() =>
    [...homeProducts.value].sort((a, b) => b.id - a.id).slice(0, 4),
  );
  const topSelling = computed(() =>
    [...homeProducts.value].sort((a, b) => b.rating - a.rating).slice(0, 4),
  );
  const searchTotal = computed(() => searchItems.value.length);

  async function fetchCategories() {
    if (categories.value.length) return;
    categories.value = await $fetch<CategoryItem[]>(
      `${API_URL}/products/categories`,
    );
  }

  async function fetchHome() {
    const responses = await Promise.all(
      CLOTHING_CATEGORIES.map((c) =>
        $fetch<ProductsResponse>(`${API_URL}/products/category/${c}`),
      ),
    );
    homeProducts.value = responses.flatMap((r) => r.products).map(toCard);
  }

  async function fetchByCategory(opts: {
    category: string;
    page: number;
    limit: number;
    sort: SortKey;
  }) {
    const sortBy = opts.sort === "popular" ? "rating" : "price";
    const order = opts.sort === "price-asc" ? "asc" : "desc";
    const res = await $fetch<ProductsResponse>(
      `${API_URL}/products/category/${opts.category}`,
      {
        query: {
          limit: opts.limit,
          skip: (opts.page - 1) * opts.limit,
          sortBy,
          order,
        },
      },
    );
    listItems.value = res.products.map(toCard);
    listTotal.value = res.total;
  }

  async function searchProducts(q: string) {
    if (!q) {
      searchItems.value = [];
      return;
    }
    const res = await $fetch<ProductsResponse>(`${API_URL}/products/search`, {
      query: { q, limit: 30 },
    });
    searchItems.value = res.products
      .filter((p) => FASHION_CATEGORIES.includes(p.category))
      .map(toCard);
  }

  async function fetchProduct(id: number) {
    const product = await $fetch<ApiProduct>(`${API_URL}/products/${id}`);
    detail.value = product;
    const res = await $fetch<ProductsResponse>(
      `${API_URL}/products/category/${product.category}`,
    );
    related.value = res.products
      .filter((p) => p.id !== product.id)
      .slice(0, 4)
      .map(toCard);
  }

  return {
    categories,
    homeProducts,
    listItems,
    listTotal,
    searchItems,
    detail,
    related,
    fashionCategories,
    newArrivals,
    topSelling,
    searchTotal,
    fetchCategories,
    fetchHome,
    fetchByCategory,
    searchProducts,
    fetchProduct,
  };
});
