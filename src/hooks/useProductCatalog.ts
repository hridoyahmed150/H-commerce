import { useCallback, useEffect, useState } from "react";
import * as productsService from "@/services/products.service";
import type { Product } from "@/types/product.types";

type State =
  | { status: "idle" | "loading"; data: Product[]; error?: undefined }
  | { status: "ready"; data: Product[]; error?: undefined }
  | { status: "error"; data: Product[]; error: string };

export function useProductCatalog() {
  const [state, setState] = useState<State>({
    status: "idle",
    data: [],
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ status: "loading", data: prev.data }));
    try {
      const data = await productsService.listProducts();
      setState({ status: "ready", data });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unable to load products";
      setState((prev) => ({ status: "error", data: prev.data, error: message }));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}
