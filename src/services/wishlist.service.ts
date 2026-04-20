import type { ProductId } from "@/types/product.types";
import {
  getWishlistSnapshot,
  replaceWishlist,
} from "@/store/wishlist-store";

/**
 * Client-side wishlist today; swap internals for your API in Phase 2.
 * without touching UI modules.
 */
export async function listWishlistIds(): Promise<ProductId[]> {
  return getWishlistSnapshot();
}

export async function isInWishlist(productId: ProductId): Promise<boolean> {
  return getWishlistSnapshot().includes(productId);
}

export async function addToWishlist(productId: ProductId): Promise<void> {
  const ids = getWishlistSnapshot();
  if (ids.includes(productId)) return;
  replaceWishlist([...ids, productId]);
}

export async function removeFromWishlist(productId: ProductId): Promise<void> {
  const ids = getWishlistSnapshot();
  replaceWishlist(ids.filter((id) => id !== productId));
}

export async function toggleWishlist(productId: ProductId): Promise<boolean> {
  const ids = getWishlistSnapshot();
  if (ids.includes(productId)) {
    await removeFromWishlist(productId);
    return false;
  }
  await addToWishlist(productId);
  return true;
}

export async function clearWishlist(): Promise<void> {
  replaceWishlist([]);
}
