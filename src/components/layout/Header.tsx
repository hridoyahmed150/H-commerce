import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import CartDrawer from "@/components/cart/CartDrawer";

type Props = {
  pathname: string;
};

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ pathname }: Props) {
  const [open, setOpen] = useState(false);
  const { totals } = useCart();
  const { ids } = useWishlist();

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    if (href === "/products") {
      return pathname.startsWith("/products") || pathname.startsWith("/product");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(14px)",
          background: "rgba(7, 9, 15, 0.78)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
            paddingBlock: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <a href="/" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            H Commerce
          </a>
          <nav
            aria-label="Primary"
            style={{
              display: "flex",
              gap: "var(--space-3)",
              flexWrap: "wrap",
              flex: 1,
            }}
          >
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="pill"
                  style={{
                    borderColor: active
                      ? "rgba(110, 231, 255, 0.45)"
                      : "var(--border)",
                    color: active ? "var(--text)" : "var(--text-muted)",
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <form
            action="/products"
            method="get"
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <input type="hidden" name="sort" value="newest" />
            <label className="muted" htmlFor="global-search" style={{ fontSize: 12 }}>
              Search
            </label>
            <input
              id="global-search"
              name="search"
              placeholder="Search catalog"
              style={{
                minWidth: 180,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.03)",
                padding: "8px 12px",
              }}
            />
            <button className="btn btn-ghost" type="submit">
              Go
            </button>
          </form>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a className="btn btn-ghost" href="/login">
              Log in
            </a>
            <a className="btn btn-primary" href="/signup">
              Sign up
            </a>
            <a className="btn btn-ghost" href="/wishlist" aria-label="Wishlist">
              ♥ {ids.length ? <span className="pill">{ids.length}</span> : null}
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
            >
              Cart {totals.itemCount ? <span className="pill">{totals.itemCount}</span> : null}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
