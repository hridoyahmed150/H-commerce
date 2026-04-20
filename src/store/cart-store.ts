import type { Cart } from "@/types/cart.types";

const STORAGE_KEY = "h-commerce:cart:v1";

function nowIso(): string {
  return new Date().toISOString();
}

function emptyCart(): Cart {
  return { lines: [], updatedAt: nowIso() };
}

function readFromStorage(): Cart {
  if (typeof window === "undefined") return emptyCart();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCart();
    const parsed = JSON.parse(raw) as Cart;
    if (!parsed || !Array.isArray(parsed.lines)) return emptyCart();
    return { lines: parsed.lines, updatedAt: parsed.updatedAt ?? nowIso() };
  } catch {
    return emptyCart();
  }
}

function writeToStorage(cart: Cart): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

let state: Cart = emptyCart();
let hydrated = false;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function initCartStoreFromStorage(): void {
  if (hydrated) return;
  hydrated = true;
  state = readFromStorage();
  notify();
}

export function getCartSnapshot(): Cart {
  return state;
}

export function subscribeCart(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function replaceCart(next: Cart): void {
  state = {
    lines: next.lines.map((line) => ({
      ...line,
      product: { ...line.product },
    })),
    updatedAt: nowIso(),
  };
  writeToStorage(state);
  notify();
}

export function onStorageEvent(): void {
  state = readFromStorage();
  notify();
}
