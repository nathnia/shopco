export interface ProductSummary {
  name: string;
  image: string;
  rating: number;
  price: number;
  oldPrice?: number;
  discount?: number;
}

export const products: ProductSummary[] = [
  {
    name: "T-shirt with Tape Details",
    image: "/images/products/tshirt-tape.png",
    rating: 4.5,
    price: 120,
  },
  {
    name: "Skinny Fit Jeans",
    image: "/images/products/skinny-jeans.png",
    rating: 3.5,
    price: 240,
    oldPrice: 260,
    discount: 20,
  },
  {
    name: "Checkered Shirt",
    image: "/images/products/checkered-shirt.png",
    rating: 4.5,
    price: 180,
  },
  {
    name: "Sleeve Striped T-shirt",
    image: "/images/products/striped-tshirt.png",
    rating: 4.5,
    price: 130,
    oldPrice: 160,
    discount: 30,
  },
  {
    name: "Vertical Striped Shirt",
    image: "/images/products/striped-shirt.png",
    rating: 5,
    price: 212,
    oldPrice: 232,
    discount: 20,
  },
  {
    name: "Courage Graphic T-shirt",
    image: "/images/products/graphic-tshirt.png",
    rating: 4,
    price: 145,
  },
  {
    name: "Loose Fit Bermuda Shorts",
    image: "/images/products/bermuda-shorts.png",
    rating: 3,
    price: 80,
  },
  {
    name: "Faded Skinny Jeans",
    image: "/images/products/faded-jeans.png",
    rating: 4.5,
    price: 210,
  },
  {
    name: "Gradient Graphic T-shirt",
    image: "/images/products/gradient-tshirt.png",
    rating: 3.5,
    price: 145,
  },
  {
    name: "Polo with Tipping Details",
    image: "/images/products/polo-tipping.png",
    rating: 4.5,
    price: 180,
  },
  {
    name: "Black Striped T-shirt",
    image: "/images/products/black-striped-tshirt.png",
    rating: 5,
    price: 120,
    oldPrice: 150,
    discount: 30,
  },
  {
    name: "Polo with Contrast Trims",
    image: "/images/products/polo-contrast.png",
    rating: 4,
    price: 212,
    oldPrice: 242,
    discount: 20,
  },
];
