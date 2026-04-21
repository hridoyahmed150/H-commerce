import { useCallback, useMemo, useState, type MouseEvent } from "react";
import type { Product } from "@/types/product.types";

type MediaItem = {
  kind: "image" | "video";
  src: string;
};

type Props = {
  product: Product;
};

const ZOOM = 3.4;
const LENS = 76;
const PREVIEW = 210;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function ProductMediaGallery({ product }: Props) {
  const media = useMemo<MediaItem[]>(() => {
    const images = product.images.map((src) => ({ kind: "image" as const, src }));
    const videos = (product.videos ?? []).map((src) => ({ kind: "video" as const, src }));
    return [...images, ...videos];
  }, [product.images, product.videos]);

  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const [lens, setLens] = useState({ x: 0, y: 0 });
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const [mouse, setMouse] = useState({ mx: 0, my: 0, fw: 1, fh: 1 });

  const current = media[active] ?? media[0];

  const onFrameMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const frame = event.currentTarget;
    const rect = frame.getBoundingClientRect();
    const mx = clamp(event.clientX - rect.left, 0, rect.width);
    const my = clamp(event.clientY - rect.top, 0, rect.height);
    const lensX = clamp(mx - LENS / 2, 0, rect.width - LENS);
    const lensY = clamp(my - LENS / 2, 0, rect.height - LENS);
    setLens({ x: lensX, y: lensY });
    setMouse({ mx, my, fw: rect.width, fh: rect.height });

    let px = event.clientX + 18;
    let py = event.clientY - PREVIEW / 2;
    px = clamp(px, 12, window.innerWidth - PREVIEW - 12);
    py = clamp(py, 12, window.innerHeight - PREVIEW - 12);
    setPreviewPos({ x: px, y: py });
  }, []);

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
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onMouseMove={onFrameMove}
          >
            <img src={current.src} alt={product.name} className="product-zoom-image" draggable={false} />
            {hover ? (
              <div
                className="product-zoom-lens"
                style={{ width: LENS, height: LENS, left: lens.x, top: lens.y }}
              />
            ) : null}
            {hover ? (
              <div
                className="product-zoom-preview"
                style={{ left: previewPos.x, top: previewPos.y, width: PREVIEW, height: PREVIEW }}
              >
                <img
                  src={current.src}
                  alt=""
                  draggable={false}
                  style={{
                    width: mouse.fw * ZOOM,
                    height: mouse.fh * ZOOM,
                    transform: `translate(${PREVIEW / 2 - mouse.mx * ZOOM}px, ${PREVIEW / 2 - mouse.my * ZOOM}px)`,
                  }}
                />
              </div>
            ) : null}
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
            onClick={() => {
              setActive(index);
              setHover(false);
            }}
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
