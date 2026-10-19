export const API_URL = "https://dummyjson.com";

export interface ApiReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

export interface ApiProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  brand?: string;
  availabilityStatus?: string;
  shippingInformation?: string;
  warrantyInformation?: string;
  returnPolicy?: string;
  reviews?: ApiReview[];
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: ApiProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url: string;
}

export interface CardProduct {
  id: number;
  name: string;
  image: string;
  rating: number;
  price: number;
  oldPrice?: number;
  discount?: number;
}

export const CLOTHING_CATEGORIES = [
  "mens-shirts",
  "tops",
  "womens-dresses",
  "womens-shoes",
  "mens-shoes",
];

export const FASHION_CATEGORIES = [
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "womens-dresses",
  "womens-shoes",
  "womens-bags",
  "womens-jewellery",
  "womens-watches",
  "tops",
  "sunglasses",
  "sports-accessories",
];

export const dressStyles = [
  { slug: "casual", name: "Casual", category: "tops" },
  { slug: "formal", name: "Formal", category: "mens-shirts" },
  { slug: "party", name: "Party", category: "womens-dresses" },
  { slug: "gym", name: "Gym", category: "sports-accessories" },
];

export function priceAfterDiscount(p: ApiProduct) {
  return Math.round(p.price * (1 - p.discountPercentage / 100) * 100) / 100;
}

export function toCard(p: ApiProduct): CardProduct {
  const discount = Math.round(p.discountPercentage);
  return {
    id: p.id,
    name: p.title,
    image: p.thumbnail,
    rating: p.rating,
    price: priceAfterDiscount(p),
    ...(discount > 0 ? { oldPrice: p.price, discount } : {}),
  };
}

export function formatPrice(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
