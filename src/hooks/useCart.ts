import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  getCartSnapshot,
  initCartStoreFromStorage,
  onStorageEvent,
  subscribeCart,
} from "@/store/cart-store";
import * as cartService from "@/services/cart.service";
import type { Cart } from "@/types/cart.types";

function subscribe(listener: () => void): () => void {
  return subscribeCart(listener);
}

function getServerSnapshot(): Cart {
  return { lines: [], updatedAt: new Date(0).toISOString() };
}

export function useCart() {
  const cart = useSyncExternalStore(
    subscribe,
    getCartSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    initCartStoreFromStorage();
    const handler = (): void => {
      onStorageEvent();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const totals = useMemo(() => cartService.getCartTotals(cart), [cart]);

  const addItem = useCallback(
    (productId: string, quantity = 1) => cartService.addToCart(productId, quantity),
    [],
  );
  const removeLine = useCallback((lineId: string) => {
    cartService.removeLine(lineId);
  }, []);
  const increment = useCallback((lineId: string) => {
    cartService.incrementLine(lineId);
  }, []);
  const decrement = useCallback((lineId: string) => {
    cartService.decrementLine(lineId);
  }, []);
  const clear = useCallback(() => {
    cartService.clearCart();
  }, []);

  return {
    cart,
    totals,
    addItem,
    removeLine,
    increment,
    decrement,
    clear,
  };
}
