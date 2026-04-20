import type { ProductId } from "@/types/product.types";

const STORAGE_KEY = "h-commerce:wishlist:v1";

function readIds(): ProductId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is ProductId => typeof id === "string");
  } catch {
    return [];
  }
}

function writeIds(ids: ProductId[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

let ids: ProductId[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function initWishlistFromStorage(): void {
  if (hydrated) return;
  hydrated = true;
  ids = readIds();
  notify();
}

export function getWishlistSnapshot(): ProductId[] {
  return ids;
}

export function subscribeWishlist(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function replaceWishlist(next: ProductId[]): void {
  ids = [...next];
  writeIds(ids);
  notify();
}

export function onWishlistStorageEvent(): void {
  ids = readIds();
  notify();
}
