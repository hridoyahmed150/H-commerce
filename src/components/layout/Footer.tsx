import { useTranslation } from "@/hooks/useTranslation";

const shopLinks = [
  { href: "/products", key: "footer.allProducts" },
  { href: "/products?sort=newest", key: "footer.newArrivals" },
  { href: "/products?category=men", key: "footer.mens" },
  { href: "/products?category=women", key: "footer.womens" },
];

const companyLinks = [
  { href: "/about", key: "footer.about" },
  { href: "/contact", key: "footer.contact" },
];

const helpLinks = [
  { href: "/contact", key: "footer.shipping" },
  { href: "/contact", key: "footer.returns" },
  { href: "/contact", key: "footer.faq" },
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong className="footer-brand">{t("brand.name")}</strong>
          <p className="muted footer-tagline">{t("footer.tagline")}</p>
        </div>
        <div>
          <div className="footer-col-title">{t("footer.shop")}</div>
          <ul className="footer-links">
            {shopLinks.map((item) => (
              <li key={item.href + item.key}>
                <a href={item.href}>{t(item.key)}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-col-title">{t("footer.company")}</div>
          <ul className="footer-links">
            {companyLinks.map((item) => (
              <li key={item.key}>
                <a href={item.href}>{t(item.key)}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-col-title">{t("footer.help")}</div>
          <ul className="footer-links">
            {helpLinks.map((item) => (
              <li key={item.key}>
                <a href={item.href}>{t(item.key)}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span className="muted">{t("footer.copyright", { year })}</span>
      </div>
    </footer>
  );
}
