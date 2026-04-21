import { useMemo } from "react";
import type { Category } from "@/types/category.types";
import type { Product } from "@/types/product.types";
import { useTranslation } from "@/hooks/useTranslation";
import HomeHeroSlider from "@/components/home/HomeHeroSlider";
import HomeCategoryGrid from "@/components/home/HomeCategoryGrid";
import FeaturedProducts from "@/components/commerce/FeaturedProducts";
import HypeProductSlider from "@/components/home/HypeProductSlider";

type Props = {
  catalog: Product[];
  categories: Category[];
  counts: Record<string, number>;
};

export default function HomePageClient({ catalog, categories, counts }: Props) {
  const { t } = useTranslation();

  const featured = useMemo(() => catalog.slice(0, 4), [catalog]);
  const latest = useMemo(
    () =>
      [...catalog]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [catalog],
  );
  const hype = useMemo(
    () => [...catalog].sort((a, b) => b.rating - a.rating || b.price - a.price).slice(0, 8),
    [catalog],
  );

  return (
    <>
      <HomeHeroSlider />

      <section className="container stack-lg" style={{ paddingBlock: "var(--space-8) var(--space-2)" }}>
        <div className="home-section-title">
          <div className="pill">{t("home.categoriesPill")}</div>
          <h2 style={{ margin: 0 }}>{t("home.categoriesTitle")}</h2>
          <p className="muted" style={{ margin: 0, maxWidth: 640px }}>
            {t("home.categoriesSubtitle")}
          </p>
        </div>
        <HomeCategoryGrid categories={categories} counts={counts} />
      </section>

      <section className="container stack-lg">
        <div className="home-section-title">
          <div className="pill">{t("home.featuredPill")}</div>
          <h2 style={{ margin: 0 }}>{t("home.featuredTitle")}</h2>
          <p className="muted" style={{ margin: 0, maxWidth: 640px }}>
            {t("home.featuredSubtitle")}
          </p>
        </div>
        <FeaturedProducts products={featured} />
      </section>

      <HypeProductSlider products={hype} />

      <section className="container stack-lg" style={{ paddingBottom: "var(--space-9)" }}>
        <div className="home-section-title">
          <div className="pill">{t("home.latestPill")}</div>
          <h2 style={{ margin: 0 }}>{t("home.latestTitle")}</h2>
          <p className="muted" style={{ margin: 0, maxWidth: 640px }}>
            {t("home.latestSubtitle")}
          </p>
        </div>
        <FeaturedProducts products={latest} />
      </section>
    </>
  );
}
