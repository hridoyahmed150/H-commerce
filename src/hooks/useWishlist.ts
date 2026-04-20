import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  getWishlistSnapshot,
  initWishlistFromStorage,
  onWishlistStorageEvent,
  subscribeWishlist,
} from "@/store/wishlist-store";
import * as wishlistService from "@/services/wishlist.service";
import type { ProductId } from "@/types/product.types";

function subscribe(listener: () => void): () => void {
  return subscribeWishlist(listener);
}

function getServerSnapshot(): ProductId[] {
  return [];
}

export function useWishlist() {
  const ids = useSyncExternalStore(
    subscribe,
    getWishlistSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    initWishlistFromStorage();
    const handler = (): void => {
      onWishlistStorageEvent();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const set = useMemo(() => new Set(ids), [ids]);

  const has = useCallback((id: ProductId) => set.has(id), [set]);

  const add = useCallback(async (id: ProductId) => {
    await wishlistService.addToWishlist(id);
  }, []);

  const remove = useCallback(async (id: ProductId) => {
    await wishlistService.removeFromWishlist(id);
  }, []);

  const toggle = useCallback(async (id: ProductId) => {
    return wishlistService.toggleWishlist(id);
  }, []);

  return { ids, has, add, remove, toggle };
}
