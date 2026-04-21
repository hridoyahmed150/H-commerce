import { useTranslation } from "@/hooks/useTranslation";
import type { Product } from "@/types/product.types";
import { formatMoney } from "@/lib/format";

type Props = {
  products: Product[];
};

export default function HypeProductSlider({ products }: Props) {
  const { t } = useTranslation();
  if (products.length === 0) return null;

  return (
    <section className="container stack-lg" style={{ paddingBlock: "var(--space-7) 0" }}>
      <div className="home-section-title">
        <div className="pill">{t("home.hypePill")}</div>
        <h2 style={{ margin: 0 }}>{t("home.hypeTitle")}</h2>
        <p className="muted" style={{ margin: 0, maxWidth: 640px }}>
          {t("home.hypeSubtitle")}
        </p>
      </div>
      <div className="hype-rail" role="region" aria-label={t("home.hypeTitle")}>
        {products.map((product) => (
          <a key={product.id} href={`/product/${product.id}`} className="hype-card card">
            <div className="hype-card-media">
              <img src={product.images[0]} alt="" loading="lazy" />
              <span className="hype-card-badge">★ {product.rating.toFixed(1)}</span>
            </div>
            <div className="hype-card-body">
              <div className="hype-card-name">{product.name}</div>
              <div className="hype-card-price">{formatMoney(product.price)}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
