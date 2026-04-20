import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/format";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, totals, removeLine, increment, decrement } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="drawer-backdrop"
        aria-label="Close cart"
        onClick={onClose}
      />
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="drawer-header">
          <h2 style={{ margin: 0, fontSize: 18 }}>Your cart</h2>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="drawer-body stack-md">
          {cart.lines.length === 0 ? (
            <p className="muted">Your cart is empty.</p>
          ) : (
            cart.lines.map((line) => (
              <div
                key={line.id}
                className="card"
                style={{ padding: 16, boxShadow: "none", transform: "none" }}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  <img
                    src={line.product.images[0]}
                    alt=""
                    width={72}
                    height={72}
                    style={{ borderRadius: 12, objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{line.product.name}</div>
                    <div className="muted" style={{ fontSize: 14 }}>
                      {formatMoney(line.product.price)}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ padding: "4px 10px" }}
                        onClick={() => decrement(line.id)}
                      >
                        −
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ padding: "4px 10px" }}
                        onClick={() => increment(line.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ color: "var(--danger)" }}
                    onClick={() => removeLine(line.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="muted">Subtotal</span>
            <strong>{formatMoney(totals.subtotal)}</strong>
          </div>
          <a className="btn btn-primary" href="/cart" onClick={onClose} style={{ width: "100%" }}>
            View cart
          </a>
        </div>
      </aside>
    </>
  );
}
