import { useEffect, useMemo, useRef, useState } from "react";
import type { ProductSortKey } from "@/types/product.types";
import { filterProducts } from "@/services/products.service";
import { listCategoryFilterOptions } from "@/services/categories.service";
import { useProductCatalog } from "@/hooks/useProductCatalog";
import { useTranslation } from "@/hooks/useTranslation";
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
  const { t } = useTranslation();
  const { status, data, error, refresh } = useProductCatalog();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<ProductSortKey>(initialSort);
  const [visibleCount, setVisibleCount] = useState(10);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSort(initialSort);
  }, [initialSort]);

  const categoryOptions = useMemo(() => {
    return listCategoryFilterOptions().map((o) =>
      o.value === "all" ? { ...o, label: t("products.catAll") } : o,
    );
  }, [t]);

  const visible = useMemo(
    () => filterProducts(data, { search, category, sort }),
    [data, search, category, sort],
  );
  const pagedItems = useMemo(
    () => visible.slice(0, visibleCount),
    [visible, visibleCount],
  );

  useEffect(() => {
    setVisibleCount(10);
  }, [search, category, sort]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        setVisibleCount((prev) => {
          if (prev >= visible.length) return prev;
          return prev + 10;
        });
      },
      { rootMargin: "240px 0px 240px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible.length]);

  return (
    <div className="container stack-lg" style={{ paddingBlock: "var(--space-8)" }}>
      <header className="stack-md">
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 2.6rem)" }}>{t("products.title")}</h1>
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
          <span>{t("products.search")}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("products.searchPh")}
          />
        </label>
        <label className="field">
          <span>{t("products.category")}</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categoryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>{t("products.sort")}</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as ProductSortKey)}>
            <option value="newest">{t("sort.newest")}</option>
            <option value="price-asc">{t("sort.priceAsc")}</option>
            <option value="price-desc">{t("sort.priceDesc")}</option>
          </select>
        </label>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button type="button" className="btn btn-ghost" onClick={() => void refresh()}>
            {t("products.reload")}
          </button>
        </div>
      </section>

      {status === "error" ? (
        <div className="card" style={{ padding: 24, boxShadow: "none", transform: "none" }}>
          <strong>{t("products.loadError")}</strong>
          <p className="muted">{error}</p>
          <button type="button" className="btn btn-primary" onClick={() => void refresh()}>
            {t("products.tryAgain")}
          </button>
        </div>
      ) : null}

      {status === "loading" || status === "idle" ? (
        <div className="products-grid-two">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="products-grid-two">
          {pagedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {status === "ready" && visible.length === 0 ? (
        <p className="muted">{t("products.noMatches")}</p>
      ) : null}
      {status === "ready" && visible.length > 0 ? (
        <div ref={sentinelRef} style={{ height: 1 }} aria-hidden />
      ) : null}
    </div>
  );
}
