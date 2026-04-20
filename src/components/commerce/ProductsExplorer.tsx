import { useEffect, useMemo, useState } from "react";
import type { ProductSortKey } from "@/types/product.types";
import { filterProducts } from "@/services/products.service";
import { listCategoryFilterOptions } from "@/services/categories.service";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import ProductCard from "@/components/commerce/ProductCard";
import ProductSkeleton from "@/components/commerce/ProductSkeleton";

type Props = {
  initialSearch?: string;
  initialCategory?: string;
  initialSort?: ProductSortKey;
};

export default function ProductsExplorer({
  initialSearch = "",
  initialCategory = "all",
  initialSort = "newest",
}: Props) {
  const { status, data, error, refresh } = useProductCatalog();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<ProductSortKey>(initialSort);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSort(initialSort);
  }, [initialSort]);

  const categoryOptions = useMemo(() => listCategoryFilterOptions(), []);

  const visible = useMemo(
    () => filterProducts(data, { search, category, sort }),
    [data, search, category, sort],
  );

  return (
    <div className="container stack-lg" style={{ paddingBlock: "var(--space-8)" }}>
      <header className="stack-md">
        <div className="pill">Catalog</div>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 2.6rem)" }}>All products</h1>
        <p className="muted" style={{ margin: 0, maxWidth: 640 }}>
          Search, filter, and sort in the browser. Catalog data is loaded from local JSON via the products service.
        </p>
      </header>

      <section
        className="card"
        style={{
          padding: "var(--space-5)",
          boxShadow: "none",
          transform: "none",
          display: "grid",
          gap: "var(--space-4)",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <label className="field">
          <span>Search</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Try “lamp” or “kitchen”" />
        </label>
        <label className="field">
          <span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categoryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as ProductSortKey)}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button type="button" className="btn btn-ghost" onClick={() => void refresh()}>
            Reload catalog
          </button>
        </div>
      </section>

      {status === "error" ? (
        <div className="card" style={{ padding: 24, boxShadow: "none", transform: "none" }}>
          <strong>We couldn’t load products.</strong>
          <p className="muted">{error}</p>
          <button type="button" className="btn btn-primary" onClick={() => void refresh()}>
            Try again
          </button>
        </div>
      ) : null}

      {status === "loading" || status === "idle" ? (
        <div className="grid-responsive">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid-responsive">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {status === "ready" && visible.length === 0 ? (
        <p className="muted">No matches for that combination.</p>
      ) : null}
    </div>
  );
}
