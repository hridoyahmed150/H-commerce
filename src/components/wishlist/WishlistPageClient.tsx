import { useMemo } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import * as wishlistService from "@/services/wishlist.service";
import ProductCard from "@/components/commerce/ProductCard";
import ProductSkeleton from "@/components/commerce/ProductSkeleton";

export default function WishlistPageClient() {
  const { ids } = useWishlist();
  const { status, data } = useProductCatalog();

  const items = useMemo(
    () => data.filter((product) => ids.includes(product.id)),
    [data, ids],
  );

  return (
    <div className="container stack-lg" style={{ paddingBlock: "var(--space-8)" }}>
      <header className="stack-md">
        <div className="pill">Wishlist</div>
        <h1 style={{ margin: 0 }}>Saved products</h1>
        <p className="muted" style={{ margin: 0 }}>
          Saved IDs live in localStorage via the wishlist service. Swap that module in Phase 2 when you add a backend.
        </p>
      </header>

      {status === "loading" || status === "idle" ? (
        <div className="grid-responsive">
          {Array.from({ length: 3 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: 24, boxShadow: "none", transform: "none" }}>
          <p>Nothing saved yet.</p>
          <a className="btn btn-primary" href="/products">
            Explore products
          </a>
        </div>
      ) : (
        <div className="stack-md">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-ghost" onClick={() => void wishlistService.clearWishlist()}>
              Clear wishlist
            </button>
          </div>
          <div className="grid-responsive">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
