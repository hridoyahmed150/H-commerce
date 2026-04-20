import { useMemo, useState } from "react";
import { CartProvider, useCartContext } from "@/context/CartContext";
import { formatMoney } from "@/lib/format";
import * as orderService from "@/services/order.service";
import { useToast } from "@/hooks/useToast";
import type { ShippingAddress } from "@/types/order.types";

function CartPageInner() {
  const { cart, totals, removeLine, increment, decrement, clear } = useCartContext();
  const { success, error } = useToast();
  const [busy, setBusy] = useState(false);

  const defaultAddress = useMemo<ShippingAddress>(
    () => ({
      fullName: "Alex Buyer",
      line1: "221B Baker Street",
      city: "London",
      postalCode: "NW1",
      country: "GB",
    }),
    [],
  );

  return (
    <div className="container stack-lg" style={{ paddingBlock: "var(--space-8)" }}>
      <header>
        <h1 style={{ margin: 0 }}>Cart</h1>
        <p className="muted">Totals are computed in the browser. Demo checkout builds a mock order via the order service — no network calls.</p>
      </header>

      {cart.lines.length === 0 ? (
        <div className="card" style={{ padding: 24, boxShadow: "none", transform: "none" }}>
          <p>Your cart is empty.</p>
          <a className="btn btn-primary" href="/products">
            Browse products
          </a>
        </div>
      ) : (
        <div className="stack-md">
          {cart.lines.map((line) => (
            <div
              key={line.id}
              className="card"
              style={{
                padding: 20,
                boxShadow: "none",
                transform: "none",
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <img
                src={line.product.images[0]}
                alt=""
                width={120}
                height={120}
                style={{ borderRadius: 16, objectFit: "cover" }}
              />
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{line.product.name}</div>
                <div className="muted">{formatMoney(line.product.price)} each</div>
                <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
                  <button type="button" className="btn btn-ghost" onClick={() => decrement(line.id)}>
                    −
                  </button>
                  <span>{line.quantity}</span>
                  <button type="button" className="btn btn-ghost" onClick={() => increment(line.id)}>
                    +
                  </button>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>{formatMoney(line.product.price * line.quantity)}</div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ color: "var(--danger)", marginTop: 8 }}
                  onClick={() => removeLine(line.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div
            className="card"
            style={{
              padding: 24,
              boxShadow: "none",
              transform: "none",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="muted">Subtotal</span>
              <strong>{formatMoney(totals.subtotal)}</strong>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button type="button" className="btn btn-ghost" onClick={() => clear()}>
                Clear cart
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const order = await orderService.createOrder({
                      lines: cart.lines,
                      shippingAddress: defaultAddress,
                    });
                    success("Order created", `Reference ${order.id.slice(0, 8)}…`);
                    clear();
                  } catch (e) {
                    error("Checkout failed", e instanceof Error ? e.message : undefined);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Place order (demo)
              </button>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>
              The button calls <code>order.service</code> only. In Phase 2 you can point that module at a real payment or order API without changing this layout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CartPageClient() {
  return (
    <CartProvider>
      <CartPageInner />
    </CartProvider>
  );
}
