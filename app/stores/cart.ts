export interface CartLine {
  key: string;
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  size: string;
  color: string;
  qty: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  note: string;
}

export interface Order {
  id: string;
  cartId: number | null;
  createdAt: string;
  payment: string;
  customer: OrderCustomer;
  items: CartLine[];
  subtotal: number;
  discountPercent: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

export interface CartProductInput {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
}

const CART_KEY = "shopco-cart";
const ORDERS_KEY = "shopco-orders";
const DELIVERY_FEE = 15;
const PROMO_CODES: Record<string, number> = { SHOP20: 20, SHOP30: 30 };

const round2 = (n: number) => Math.round(n * 100) / 100;

export const useCartStore = defineStore("cart", () => {
  // ===== State =====
  const lines = ref<CartLine[]>([]);
  const cartId = ref<number | null>(null);
  const promoPercent = ref(0);
  const orders = ref<Order[]>([]);
  const loaded = ref(false);

  // ===== Getters =====
  const count = computed(() => lines.value.reduce((sum, l) => sum + l.qty, 0));
  const subtotal = computed(() =>
    round2(lines.value.reduce((sum, l) => sum + l.price * l.qty, 0)),
  );
  const discount = computed(() =>
    round2((subtotal.value * promoPercent.value) / 100),
  );
  const deliveryFee = computed(() => (lines.value.length ? DELIVERY_FEE : 0));
  const total = computed(() =>
    round2(subtotal.value - discount.value + deliveryFee.value),
  );

  // ===== localStorage =====
  function load() {
    if (!import.meta.client || loaded.value) return;
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) ?? "null");
      if (saved) {
        lines.value = saved.lines ?? [];
        cartId.value = saved.cartId ?? null;
        promoPercent.value = saved.promoPercent ?? 0;
      }
      orders.value = JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "[]");
    } catch {}
    loaded.value = true;
  }

  function save() {
    if (!import.meta.client || !loaded.value) return;
    try {
      localStorage.setItem(
        CART_KEY,
        JSON.stringify({
          lines: lines.value,
          cartId: cartId.value,
          promoPercent: promoPercent.value,
        }),
      );
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.value));
    } catch {}
  }

  watch([lines, cartId, promoPercent, orders], save, { deep: true });

  // ===== Actions =====
  async function sync() {
    if (!lines.value.length) {
      cartId.value = null;
      return;
    }
    const qtyById = new Map<number, number>();
    for (const l of lines.value)
      qtyById.set(l.id, (qtyById.get(l.id) ?? 0) + l.qty);

    try {
      const res = await $fetch<{ id: number }>(`${API_URL}/carts/add`, {
        method: "POST",
        body: {
          userId: 1,
          products: [...qtyById].map(([id, quantity]) => ({ id, quantity })),
        },
      });
      cartId.value = res.id;
    } catch {}
  }

  function addItem(
    p: CartProductInput,
    opt: { size?: string; color?: string; qty?: number } = {},
  ) {
    const size = opt.size ?? "";
    const color = opt.color ?? "";
    const qty = Math.max(1, opt.qty ?? 1);
    const key = `${p.id}|${size}|${color}`;

    const existing = lines.value.find((l) => l.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      lines.value.push({
        key,
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        oldPrice: p.oldPrice,
        size,
        color,
        qty,
      });
    }
    void sync();
  }

  function changeQty(key: string, delta: number) {
    const line = lines.value.find((l) => l.key === key);
    if (!line) return;
    line.qty = Math.max(1, line.qty + delta);
    void sync();
  }

  function removeItem(key: string) {
    lines.value = lines.value.filter((l) => l.key !== key);
    void sync();
  }

  function applyPromo(code: string) {
    const percent = PROMO_CODES[code.trim().toUpperCase()];
    if (!percent) return "This promo code is not valid";
    promoPercent.value = percent;
    return `Promo applied: ${percent}% off`;
  }

  async function placeOrder(customer: OrderCustomer, payment: string) {
    if (!lines.value.length) return null;
    await sync();

    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      cartId: cartId.value,
      createdAt: new Date().toISOString(),
      payment,
      customer,
      items: lines.value.map((l) => ({ ...l })),
      subtotal: subtotal.value,
      discountPercent: promoPercent.value,
      discount: discount.value,
      deliveryFee: deliveryFee.value,
      total: total.value,
    };

    orders.value.unshift(order);
    lines.value = [];
    cartId.value = null;
    promoPercent.value = 0;
    return order;
  }

  function getOrder(id: string) {
    return orders.value.find((o) => o.id === id);
  }

  return {
    lines,
    cartId,
    promoPercent,
    orders,
    loaded,
    count,
    subtotal,
    discount,
    deliveryFee,
    total,
    load,
    sync,
    addItem,
    changeQty,
    removeItem,
    applyPromo,
    placeOrder,
    getOrder,
  };
});
