import { useState } from "react";
import type { Product } from "@/types/product.types";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/useToast";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { success, error } = useToast();
  const [busy, setBusy] = useState(false);

  const wishlisted = has(product.id);

  return (
    <article className="card">
      <div className="card-media" style={{ position: "relative" }}>
        <a href={`/product/${product.id}`} aria-label={product.name}>
          <img src={product.images[0]} alt="" loading="lazy" />
        </a>
        <button
          type="button"
          className="btn btn-ghost"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: "rgba(0,0,0,0.45)",
          }}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={async () => {
            const next = await toggle(product.id);
            success(next ? "Saved to wishlist" : "Removed from wishlist");
          }}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>
      <div className="card-body">
        <div className="pill" style={{ alignSelf: "flex-start" }}>
          {product.category}
        </div>
        <a href={`/product/${product.id}`} style={{ fontWeight: 600, fontSize: 18 }}>
          {product.name}
        </a>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 20, fontWeight: 700 }}>{formatMoney(product.price)}</span>
          <span className="muted" style={{ fontSize: 14 }}>
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ width: "100%" }}
          disabled={busy || product.stock === 0}
          onClick={async () => {
            setBusy(true);
            try {
              await addItem(product.id, 1);
              success("Added to cart", product.name);
            } catch (e) {
              error("Could not add to cart", e instanceof Error ? e.message : undefined);
            } finally {
              setBusy(false);
            }
          }}
        >
          {product.stock === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
