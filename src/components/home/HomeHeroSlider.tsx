import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const SLIDE_IMAGES = [
  "https://images.unsplash.com/photo-1469334031218-e382a71b716f?w=1400&q=80",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80",
];

export default function HomeHeroSlider() {
  const { t } = useTranslation();
  const slides = useMemo(
    () => [
      { title: t("home.hero.slide1.title"), sub: t("home.hero.slide1.sub"), img: SLIDE_IMAGES[0] },
      { title: t("home.hero.slide2.title"), sub: t("home.hero.slide2.sub"), img: SLIDE_IMAGES[1] },
      { title: t("home.hero.slide3.title"), sub: t("home.hero.slide3.sub"), img: SLIDE_IMAGES[2] },
    ],
    [t],
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(next, 5200);
    return () => window.clearInterval(id);
  }, [next, paused]);

  const active = slides[index] ?? slides[0];

  return (
    <section
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-slider-track">
        {slides.map((slide, i) => (
          <div
            key={slide.img}
            className={`hero-slide ${i === index ? "is-active" : ""}`}
            style={{ backgroundImage: `url(${slide.img})` }}
            aria-hidden={i !== index}
          />
        ))}
      </div>
      <div className="hero-slider-scrim" />
      <div className="container hero-slider-content">
        <div className="hero-slider-copy">
          <div className="pill hero-slider-pill">{t("brand.name")}</div>
          <h1 className="hero-slider-title">{active.title}</h1>
          <p className="hero-slider-sub muted">{active.sub}</p>
          <div className="hero-slider-ctas">
            <a className="btn btn-primary" href="/products">
              {t("home.hero.cta1")}
            </a>
            <a className="btn btn-ghost" href="/products?sort=newest">
              {t("home.hero.cta2")}
            </a>
          </div>
        </div>
        <div className="hero-slider-dots" role="tablist" aria-label="Hero slides">
          {slides.map((_, i) => (
            <button
              key={String(i)}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`hero-slider-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
      <div className="hero-slider-progress" key={index}>
        <span className="hero-slider-progress-bar" />
      </div>
    </section>
  );
}
