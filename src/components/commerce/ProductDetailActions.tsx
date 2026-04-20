import { useState } from "react";
import type { Product } from "@/types/product.types";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/useToast";

type Props = {
  product: Product;
};

export default function ProductDetailActions({ product }: Props) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { success, error } = useToast();
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  const wishlisted = has(product.id);

  return (
    <div className="stack-md" style={{ marginTop: "var(--space-5)" }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 32, fontWeight: 700 }}>{formatMoney(product.price)}</span>
        <span className="pill">★ {product.rating.toFixed(1)}</span>
        <span className="pill">{product.stock} in stock</span>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <label className="field" style={{ minWidth: 120 }}>
          <span>Quantity</span>
          <input
            type="number"
            min={1}
            max={product.stock}
            value={qty}
            onChange={(e) => {
              const next = Number(e.target.value) || 1;
              setQty(Math.min(product.stock, Math.max(1, next)));
            }}
          />
        </label>
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: 22 }}
          disabled={busy || product.stock === 0}
          onClick={async () => {
            setBusy(true);
            try {
              await addItem(product.id, qty);
              success("Added to cart", `${qty} × ${product.name}`);
            } catch (e) {
              error("Could not add to cart", e instanceof Error ? e.message : undefined);
            } finally {
              setBusy(false);
            }
          }}
        >
          Add to cart
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ marginTop: 22 }}
          aria-pressed={wishlisted}
          onClick={async () => {
            const next = await toggle(product.id);
            success(next ? "Saved to wishlist" : "Removed from wishlist");
          }}
        >
          {wishlisted ? "♥ Wishlisted" : "♡ Wishlist"}
        </button>
      </div>
    </div>
  );
}
