import type { Product, ProductId } from "./product.types";

export type CartLineId = string;

export type CartLine = {
  id: CartLineId;
  productId: ProductId;
  quantity: number;
  /** Snapshot for display; refreshed when product catalog updates */
  product: Pick<Product, "id" | "name" | "price" | "images">;
};

export type Cart = {
  lines: CartLine[];
  updatedAt: string;
};

export type CartTotals = {
  subtotal: number;
  itemCount: number;
  lineCount: number;
};
