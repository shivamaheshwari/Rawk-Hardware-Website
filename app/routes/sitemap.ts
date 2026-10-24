import { CATEGORIES, PRODUCTS } from "../data/products";
import { GUIDES } from "../data/guides";
import { SITE_URL } from "../lib/site";
export async function loader() {
  const urls = ["/", "/products", "/bulk-orders", "/contact", "/catalogue", "/about", "/guides", "/privacy", "/terms",
    ...CATEGORIES.map((c) => `/categories/${c.slug}`), ...PRODUCTS.map((p) => `/products/${p.slug}`), ...GUIDES.map((g) => `/guides/${g.slug}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${SITE_URL}${u}</loc></url>`).join("")}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
