import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import CartDrawer from "@/components/cart/CartDrawer";

type Props = {
  pathname: string;
};

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ pathname }: Props) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totals } = useCart();
  const { ids } = useWishlist();

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    if (href === "/products") {
      return pathname.startsWith("/products") || pathname.startsWith("/product");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a href="/" className="header-brand">
            H Commerce
          </a>
          <button
            type="button"
            className="header-hamburger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav aria-label="Primary" className="header-nav">
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
          <div className="header-auth">
            <a className="btn btn-ghost" href="/login">
              Log in
            </a>
            <a className="btn btn-primary" href="/signup">
              Sign up
            </a>
          </div>
          <form action="/products" method="get" className="header-search">
            <input type="hidden" name="sort" value="newest" />
            <label className="muted header-search-label" htmlFor="global-search">
              Search
            </label>
            <input
              className="header-search-input"
              id="global-search"
              name="search"
              placeholder="Search catalog"
            />
            <button className="btn btn-ghost" type="submit">
              Go
            </button>
          </form>
        </div>
      </header>
      {menuOpen ? (
        <>
          <button
            type="button"
            className="mobile-menu-backdrop"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Mobile menu">
            <div className="mobile-menu-header">
              <strong>Menu</strong>
              <button type="button" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
                Close
              </button>
            </div>
            <nav className="mobile-menu-links" aria-label="Mobile primary">
              {links.map((link) => {
                const active = isActive(link.href);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={active ? "active" : ""}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>
            <div className="mobile-menu-actions">
              <a className="btn btn-ghost" href="/login" onClick={() => setMenuOpen(false)}>
                Log in
              </a>
              <a className="btn btn-primary" href="/signup" onClick={() => setMenuOpen(false)}>
                Sign up
              </a>
            </div>
          </aside>
        </>
      ) : null}
      <div className="floating-actions">
        <a className="floating-action-btn" href="/wishlist" aria-label="Wishlist">
          <span className="floating-action-icon-wrap">
            <span className="floating-action-icon">♥</span>
            {ids.length > 0 ? <span className="floating-action-badge">{ids.length}</span> : null}
          </span>
          <span className="floating-action-label">
            Wishlist {ids.length > 0 ? `(${ids.length})` : ""}
          </span>
        </a>
        <button
          type="button"
          className="floating-action-btn"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label="Cart"
        >
          <span className="floating-action-icon-wrap">
            <span className="floating-action-icon">🛒</span>
            {totals.itemCount > 0 ? (
              <span className="floating-action-badge">{totals.itemCount}</span>
            ) : null}
          </span>
          <span className="floating-action-label">
            Cart {totals.itemCount > 0 ? `(${totals.itemCount})` : ""}
          </span>
        </button>
      </div>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
