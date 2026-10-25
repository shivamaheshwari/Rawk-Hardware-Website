export const BUSINESS = {
  brand: "RAWK",
  descriptor: "Hardware by Vinayak Enterprise",
  businessName: "Vinayak Enterprises",
  address: "Opposite UCO Bank, Daulatganj, Lashkar, Gwalior (M.P.) 474001",
  phones: ["9589133387", "8962636662"],
  whatsappNumber: "919589133387",
  instagram: "@rawk_04",
  instagramUrl: "https://www.instagram.com/rawk_04",
  marketplacesNote: "Also available on Amazon, Flipkart and JioMart — links are shown only where a listing has been verified for that exact product.",
};
// Debug fix: the previous default pointed canonical URLs, the sitemap and
// JSON-LD at a placeholder example domain. Default to the live preview
// host instead; a real custom domain can override it via SITE_URL.
export const SITE_URL = process.env.SITE_URL ?? "https://rawk-hardware-website.vercel.app";

/**
 * Marketplace / social marquee entries. Only destinations that are verified
 * for RAWK are linked. Flipkart, Meesho and JioMart have no verified
 * RAWK store URL in this codebase, so they render as plain text — never
 * as an invented link.
 */
export type Marketplace = { name: string; url: string | null; note: string };
export const MARKETPLACES: Marketplace[] = [
  { name: "amazon", url: "https://www.amazon.in/dp/B0GMD2D2JY", note: "Verified D2 listing — the only verified Amazon link" },
  { name: "Flipkart", url: null, note: "Store link to be confirmed" },
  { name: "meesho", url: null, note: "Store link to be confirmed" },
  { name: "JioMart", url: null, note: "Store link to be confirmed" },
  { name: "WhatsApp", url: "https://wa.me/919589133387?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20RAWK%20hardware%20products.", note: "Verified WhatsApp number 9589133387" },
  { name: "Instagram", url: "https://www.instagram.com/rawk_04", note: "Verified profile @rawk_04" },
];
export function whatsappUrl(message: string) {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
export function enquiryDraft(opts: { title: string; sku: string; size: string; finish: string; pack: number; qty: number; pageUrl: string }) {
  return `Hello, I'm interested in RAWK ${opts.title}. SKU: ${opts.sku}. Size: ${opts.size}. Finish: ${opts.finish}. Pack: ${opts.pack}. Quantity: ${opts.qty}. Please confirm price and availability. Product: ${opts.pageUrl}`;
}
export const FINISH_SWATCH: Record<string, string> = {
  "Golden White": "#B38A48", "Black White": "#1f2937", "Rose Gold White": "#c98a7a",
  "Satin White": "#c8cdd2", "Rose Gold Black": "#b76e5a", "Black": "#111827",
  "Golden": "#B38A48", "Rose Gold": "#c98a7a", "Chrome": "#c0c6cc", "Black Grey": "#4b5563",
  "Stainless Steel": "#c0c6cc", "Brushed Brass": "#B38A48", "Nickel": "#c0c6cc", "White": "#f5f5f4",
};
