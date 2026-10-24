import { SITE_URL } from "./site";
export function canonical(path: string) { return `${SITE_URL}${path}`; }
export function orgJsonLd() {
  return { "@context": "https://schema.org", "@type": "Organization", name: "RAWK — Hardware by Vinayak Enterprise",
    url: SITE_URL, telephone: "+91-9589133387",
    address: { "@type": "PostalAddress", streetAddress: "Opposite UCO Bank, Daulatganj, Lashkar", addressLocality: "Gwalior", addressRegion: "Madhya Pradesh", postalCode: "474001", addressCountry: "IN" },
    sameAs: ["https://www.instagram.com/rawk_04"] };
}
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: canonical(it.path) })) };
}
export function productJsonLd(p: { title: string; description: string; slug: string; images: string[]; category: string }) {
  // No Offer, price, availability or rating: none is displayed, so none is claimed.
  return { "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.description, url: canonical(`/products/${p.slug}`), image: p.images.map((i) => `${SITE_URL}${i}`), category: p.category, brand: { "@type": "Brand", name: "RAWK" } };
}
