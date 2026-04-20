import type { Product, ProductId, ProductSortKey } from "@/types/product.types";
import productsData from "@/data/products.json";

const CATALOG: Product[] = productsData as Product[];

/**
 * Phase 1: reads bundled JSON only. Replace internals with API calls later;
 * keep the same function names for UI and hooks.
 */
export async function listProducts(): Promise<Product[]> {
  return CATALOG.map((p) => ({ ...p, images: [...p.images] }));
}

export async function getProductById(id: ProductId): Promise<Product | null> {
  const product = CATALOG.find((p) => p.id === id);
  if (!product) return null;
  return { ...product, images: [...product.images] };
}

export function filterProducts(
  products: Product[],
  query: {
    search?: string;
    category?: string;
    sort?: ProductSortKey;
  },
): Product[] {
  let next = [...products];

  const q = query.search?.trim().toLowerCase();
  if (q) {
    next = next.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  if (query.category && query.category !== "all") {
    next = next.filter((p) => p.category === query.category);
  }

  const sort = query.sort ?? "newest";
  if (sort === "price-asc") {
    next.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    next.sort((a, b) => b.price - a.price);
  } else {
    next.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return next;
}
