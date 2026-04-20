import type { Category } from "@/types/category.types";

type Props = {
  categories: Category[];
  counts: Record<string, number>;
};

export default function HomeCategoryGrid({ categories, counts }: Props) {
  return (
    <div className="home-category-grid">
      {categories.map((cat) => (
        <a
          key={cat.id}
          href={`/products?category=${encodeURIComponent(cat.slug)}`}
          className="home-category-card card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="home-category-media">
            <img src={cat.image} alt="" loading="lazy" />
            <div className="home-category-overlay" />
            <div className="home-category-copy">
              <span className="pill" style={{ borderColor: "rgba(255,255,255,0.35)", color: "#e8f6ff" }}>
                {counts[cat.slug] ?? 0} items
              </span>
              <h3 style={{ margin: "10px 0 4px", fontSize: "1.35rem" }}>{cat.name}</h3>
              <p className="muted" style={{ margin: 0, color: "rgba(232,246,255,0.82)" }}>
                {cat.tagline}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
