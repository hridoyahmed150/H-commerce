import { useEffect, useRef, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeMode } from "@/hooks/useThemeMode";
import CartDrawer from "@/components/cart/CartDrawer";

type Props = {
  pathname: string;
};

const navKeys = [
  { href: "/", key: "nav.home" },
  { href: "/products", key: "nav.products" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
];

export default function Header({ pathname }: Props) {
  const { t, locale, setLocale } = useTranslation();
  const { theme, toggleTheme } = useThemeMode();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    if (pathname.startsWith("/products")) {
      const q = new URLSearchParams(window.location.search).get("search") ?? "";
      setSearchInput(q);
    }
  }, [pathname]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    const q = searchInput.trim();
    if (!q) return;
    searchTimer.current = setTimeout(() => {
      const nextUrl = `${window.location.origin}/products?search=${encodeURIComponent(q)}&sort=newest`;
      if (window.location.href !== nextUrl) {
        window.location.assign(nextUrl);
      }
    }, 2000);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [searchInput]);

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
            {t("brand.name")}
          </a>
          <button
            type="button"
            className="header-hamburger"
            aria-label={t("mobile.menuTitle")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav aria-label="Primary" className="header-nav">
            {navKeys.map((link) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="pill"
                  style={{
                    borderColor: active ? "rgba(110, 231, 255, 0.45)" : "var(--border)",
                    color: active ? "var(--text)" : "var(--text-muted)",
                  }}
                >
                  {t(link.key)}
                </a>
              );
            })}
          </nav>
          <div className="header-toolbar">
            <button
              type="button"
              className="btn btn-ghost header-icon-btn"
              onClick={() => toggleTheme()}
              aria-label={theme === "dark" ? t("header.themeLight") : t("header.themeDark")}
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
            <div className="header-lang">
              <button
                type="button"
                className={`lang-chip ${locale === "en" ? "active" : ""}`}
                onClick={() => setLocale("en")}
              >
                {t("header.langEn")}
              </button>
              <button
                type="button"
                className={`lang-chip ${locale === "bn" ? "active" : ""}`}
                onClick={() => setLocale("bn")}
              >
                {t("header.langBn")}
              </button>
            </div>
          </div>
          <div className="header-auth">
            <a className="btn btn-ghost" href="/login">
              {t("nav.login")}
            </a>
            <a className="btn btn-primary" href="/signup">
              {t("nav.signup")}
            </a>
          </div>
          <div className="header-search" role="search">
            <input type="hidden" name="sort" value="newest" />
            <label className="muted header-search-label" htmlFor="global-search">
              {t("header.searchLabel")}
            </label>
            <input
              className="header-search-input"
              id="global-search"
              name="search"
              placeholder={t("header.searchPlaceholder")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
      </header>
      {menuOpen ? (
        <>
          <button
            type="button"
            className="mobile-menu-backdrop"
            aria-label={t("mobile.close")}
            onClick={() => setMenuOpen(false)}
          />
          <aside className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label={t("mobile.menuTitle")}>
            <div className="mobile-menu-header">
              <strong>{t("mobile.menuTitle")}</strong>
              <button type="button" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
                {t("mobile.close")}
              </button>
            </div>
            <nav className="mobile-menu-links" aria-label="Mobile primary">
              {navKeys.map((link) => {
                const active = isActive(link.href);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={active ? "active" : ""}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t(link.key)}
                  </a>
                );
              })}
            </nav>
            <div className="mobile-menu-tools">
              <button type="button" className="btn btn-ghost" onClick={() => toggleTheme()}>
                {theme === "dark" ? `☀ ${t("header.themeLight")}` : `☾ ${t("header.themeDark")}`}
              </button>
              <div className="header-lang">
                <button
                  type="button"
                  className={`lang-chip ${locale === "en" ? "active" : ""}`}
                  onClick={() => setLocale("en")}
                >
                  {t("header.langEn")}
                </button>
                <button
                  type="button"
                  className={`lang-chip ${locale === "bn" ? "active" : ""}`}
                  onClick={() => setLocale("bn")}
                >
                  {t("header.langBn")}
                </button>
              </div>
            </div>
            <div className="mobile-menu-actions">
              <a className="btn btn-ghost" href="/login" onClick={() => setMenuOpen(false)}>
                {t("nav.login")}
              </a>
              <a className="btn btn-primary" href="/signup" onClick={() => setMenuOpen(false)}>
                {t("nav.signup")}
              </a>
            </div>
          </aside>
        </>
      ) : null}
      <div className="floating-actions">
        <a className="floating-action-btn" href="/wishlist" aria-label={t("floating.wishlist")}>
          <span className="floating-action-icon-wrap">
            <span className="floating-action-icon">♥</span>
            {ids.length > 0 ? <span className="floating-action-badge">{ids.length}</span> : null}
          </span>
          <span className="floating-action-label">
            {t("floating.wishlist")} {ids.length > 0 ? `(${ids.length})` : ""}
          </span>
        </a>
        <button
          type="button"
          className="floating-action-btn"
          onClick={() => setCartOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={cartOpen}
          aria-label={t("floating.cart")}
        >
          <span className="floating-action-icon-wrap">
            <span className="floating-action-icon">🛒</span>
            {totals.itemCount > 0 ? (
              <span className="floating-action-badge">{totals.itemCount}</span>
            ) : null}
          </span>
          <span className="floating-action-label">
            {t("floating.cart")} {totals.itemCount > 0 ? `(${totals.itemCount})` : ""}
          </span>
        </button>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
