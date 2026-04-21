import { useMemo, useState } from "react";
import type { Product } from "@/types/product.types";

type MediaItem = {
  kind: "image" | "video";
  src: string;
};

type Props = {
  product: Product;
};

export default function ProductMediaGallery({ product }: Props) {
  const media = useMemo<MediaItem[]>(() => {
    const images = product.images.map((src) => ({ kind: "image" as const, src }));
    const videos = (product.videos ?? []).map((src) => ({ kind: "video" as const, src }));
    return [...images, ...videos];
  }, [product.images, product.videos]);

  const [active, setActive] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const current = media[active] ?? media[0];

  if (!current) return null;

  return (
    <div className="stack-md">
      <div
        className="product-media-main card"
        style={{ padding: 0, boxShadow: "none", transform: "none" }}
      >
        {current.kind === "image" ? (
          <div
            className="product-zoom-frame"
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const x = ((event.clientX - rect.left) / rect.width) * 100;
              const y = ((event.clientY - rect.top) / rect.height) * 100;
              setZoomPos({ x, y });
            }}
          >
            <img
              src={current.src}
              alt={product.name}
              className="product-zoom-image"
              style={{ transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }}
            />
          </div>
        ) : (
          <video src={current.src} controls className="product-video" />
        )}
      </div>
      <div className="product-media-strip">
        {media.map((item, index) => (
          <button
            key={`${item.kind}-${item.src}-${index}`}
            type="button"
            className={`product-thumb ${index === active ? "active" : ""}`}
            onClick={() => setActive(index)}
            aria-label={item.kind === "image" ? `Image ${index + 1}` : `Video ${index + 1}`}
          >
            {item.kind === "image" ? (
              <img src={item.src} alt="" />
            ) : (
              <div className="product-thumb-video">▶ Video</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
