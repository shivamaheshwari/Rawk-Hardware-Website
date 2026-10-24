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
export const SITE_URL = process.env.SITE_URL ?? "https://www.rawk.example";
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
