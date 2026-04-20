export type ProductId = string;

export type Product = {
  id: ProductId;
  name: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  rating: number;
  stock: number;
  /** ISO date for sorting “newest” */
  createdAt: string;
};

export type ProductSortKey = "price-asc" | "price-desc" | "newest";
