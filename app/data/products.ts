// PREVIEW DATA — see README. "verified" products carry only facts taken from
// the user's own posters/photos or the one verified Amazon listing below.
// "preview" products are placeholder catalogue rows for layout and routing:
// their specs are deliberately generic ("To be confirmed from sheet") and
// must be replaced by the owner-approved Google Sheet before launch.
// NEVER present a preview spec as verified, and never invent an Amazon link:
// only the D2 variant below has an amazon_url; every other product hides
// the Amazon button entirely (plan.md §6, design.md §6).
export type Category = { id: string; slug: string; name: string; description: string; image?: string; imageAlt?: string };
export type Variant = {
  sku: string; size_label: string; finish: string; pack_count: number; material: string;
  overall_length_mm: number | null; mounting_centres_mm: number | null;
  fitting_diameter_mm?: number | null; overlay_type?: string | null; adjustment_type?: string | null;
  screws_included: string; package_contents: string; amazon_url: string | null; publication_status: string;
};
export type ProductImage = { src: string; alt: string };
export type Product = {
  id: string; slug: string; title: string; category: string; description: string;
  applications: string[]; images: ProductImage[]; finishes: string[];
  featured: boolean; status: "verified" | "preview"; variants: Variant[];
};
export const CATEGORIES: Category[] = [
  { id: "handles", slug: "handles", name: "Handles", description: "Cabinet, drawer and wardrobe handles in verified finishes and mounting sizes.", image: "/images/509-handle-overview.jpg", imageAlt: "RAWK 509 cabinet handle in Golden White" },
  { id: "knobs", slug: "knobs", name: "Knobs", description: "Cabinet knobs for drawers, wardrobes and cupboards.", image: "/images/crystal-knob-collection.jpg", imageAlt: "RAWK crystal cabinet knob in Golden finish" },
  { id: "locks", slug: "locks", name: "Locks", description: "Door, cupboard and drawer locks. Exact specifications to be confirmed from the catalogue sheet.", image: undefined },
  { id: "hinges", slug: "hinges", name: "Hinges", description: "Concealed and butt hinges. Overlay and adjustment are shown as separate attributes — they are not the same thing.", image: undefined },
  { id: "drain-jali", slug: "drain-jali", name: "Drain Jali", description: "Drain covers for bathrooms and utility areas. Size and hole pattern to be confirmed from the catalogue sheet.", image: undefined },
  { id: "drain-pipes", slug: "drain-pipes", name: "Drain Pipes", description: "Flexible drain pipes for under-sink and utility connections. Measurements to be confirmed from the catalogue sheet.", image: undefined },
];
const TBC = "To be confirmed from sheet";
const V = (o: Partial<Variant> & Pick<Variant, "sku" | "size_label" | "finish">): Variant => ({
  pack_count: 1, material: TBC, overall_length_mm: null, mounting_centres_mm: null,
  screws_included: TBC, package_contents: "Handle / fitting as shown; screws to be confirmed from sheet",
  amazon_url: null, publication_status: "published", ...o,
});
const img = (src: string, alt: string): ProductImage => ({ src, alt });
const F509 = ["Golden White", "Black White", "Rose Gold White", "Satin White"];
const CENTRES = [96, 160, 224, 288];
const variants509: Variant[] = F509.flatMap((f) => CENTRES.map((c) => V({
  sku: `RAWK-509-${f.split(" ").map((w) => w[0]).join("")}-${c}`,
  size_label: `${c} mm mounting centres`, finish: f, material: "Premium Zinc",
  mounting_centres_mm: c, screws_included: TBC,
  package_contents: "509 handle; screws to be confirmed from sheet",
})));
const FCURVED = ["Golden White", "Black White", "Rose Gold White", "Rose Gold Black", "Black"];
const SIZES_IN = ["4 inch", "6 inch", "8 inch", "12 inch"];
const variantsCurved: Variant[] = FCURVED.flatMap((f) => SIZES_IN.map((s) => V({
  sku: `RAWK-CURVED-${f.split(" ").map((w) => w[0]).join("")}-${s.split(" ")[0]}IN`,
  size_label: s, finish: f, material: "Premium Zinc", package_contents: "Curved handle; screws to be confirmed from sheet",
})));
const variantsV: Variant[] = (["Rose Gold White", "Golden White", "Black Grey", "Black White"] as const).flatMap((f) => SIZES_IN.map((s) => V({
  sku: `RAWK-VKNOB-${f.split(" ").map((w) => w[0]).join("")}-${s.split(" ")[0]}IN`,
  size_label: s, finish: f, material: "Premium Zinc", package_contents: "V-shape knob/handle; screws to be confirmed from sheet",
})));
function previewProduct(id: string, slug: string, title: string, category: string, description: string, finishes: string[], applications: string[], extra?: Partial<Variant>): Product {
  return {
    id, slug, title, category, description, applications, images: [], finishes,
    featured: false, status: "preview",
    variants: finishes.map((f, i) => V({ sku: `RAWK-${id.toUpperCase()}-${i + 1}`, size_label: "Size to be confirmed from sheet", finish: f, package_contents: `${title}; contents to be confirmed from sheet`, ...(extra ?? {}) })),
  };
}
export const PRODUCTS: Product[] = [
  {
    id: "509-handle", slug: "509-handle", title: "509 Cabinet Handle", category: "handles",
    description: "Modern cabinet and drawer handle in premium zinc. Mounting-centre sizes and finishes are shown exactly as on the RAWK 509 poster; overall length is not stated on the poster, so it is shown as to be confirmed rather than guessed.",
    applications: ["Kitchen Cabinets", "Wardrobes"],
    images: [img("/images/509-handle-overview.jpg", "RAWK 509 handle — Golden White, premium zinc, available mounting sizes 96, 160, 224 and 288 mm"), img("/images/509-handle-colors.jpg", "RAWK 509 handle in Golden White, Black White, Rose Gold White and Satin White finishes")],
    finishes: F509, featured: true, status: "verified", variants: variants509,
  },
  {
    id: "d2-handle", slug: "d2-cabinet-handle-rose-gold-black", title: "D2 Cabinet Handle — Rose Gold Black", category: "handles",
    description: "6-inch cabinet handle in zinc, black with rose-gold accents. This is the one product in this catalogue with a verified Amazon India listing (see the Amazon button on this page). Price and availability on Amazon are determined by Amazon.",
    applications: ["Kitchen Cabinets", "Wardrobes"],
    images: [img("/images/d2-cabinet-handle-rose-gold-black.jpg", "RAWK D2 cabinet handle, black with rose-gold base, on a white background")],
    finishes: ["Rose Gold Black"], featured: true, status: "verified",
    variants: [V({ sku: "RAWK-D2-RGB-6IN", size_label: "6 inch", finish: "Rose Gold Black", material: "Zinc", package_contents: "D2 handle with fitting screws (as listed on Amazon)", amazon_url: "https://www.amazon.in/dp/B0GMD2D2JY" })],
  },
  {
    id: "curved-handle", slug: "curved-cabinet-handle", title: "Curved Cabinet Handle", category: "handles",
    description: "Curved cabinet handle in premium zinc, shown on the RAWK collection poster in five finishes. Mounting-centre distances are not stated on the poster, so they are shown as to be confirmed.",
    applications: ["Kitchen Cabinets", "Wardrobes"],
    images: [img("/images/curved-handle-colors.jpg", "RAWK curved handle in Golden White, Black White, Rose Gold White, Rose Gold Black and Black"), img("/images/curved-handle-collection.jpg", "RAWK curved handle collection poster with finishes and sizes")],
    finishes: FCURVED, featured: true, status: "verified", variants: variantsCurved,
  },
  {
    id: "v-knob", slug: "v-shape-knob", title: "V-Shape Knob", category: "knobs",
    description: "V-shaped cabinet fitting in premium zinc, shown on the RAWK collection poster. Sizes are shown as printed on the poster; mounting measurements are to be confirmed from the sheet.",
    applications: ["Kitchen Cabinets", "Wardrobes"],
    images: [img("/images/v-shape-knob-collection.jpg", "RAWK V-shape knob in Rose Gold White, Golden White, Black Grey and Black White")],
    finishes: ["Rose Gold White", "Golden White", "Black Grey", "Black White"], featured: true, status: "verified", variants: variantsV,
  },
  {
    id: "crystal-knob", slug: "crystal-knob", title: "Crystal Knob", category: "knobs",
    description: "Round cabinet knob with a crystal centre and metal rim, shown on the RAWK collection poster. Size is to be confirmed from the catalogue sheet — the poster size line was not carried over for a knob pending sheet confirmation.",
    applications: ["Kitchen Cabinets", "Wardrobes"],
    images: [img("/images/crystal-knob-collection.jpg", "RAWK crystal knob in Golden, Rose Gold, Chrome Finish and Black")],
    finishes: ["Rose Gold", "Golden", "Chrome", "Black"], featured: true, status: "verified",
    variants: ["Rose Gold", "Golden", "Chrome", "Black"].map((f, i) => V({ sku: `RAWK-CRYSTAL-${i + 1}`, size_label: "Size to be confirmed from sheet", finish: f, material: "Premium Zinc", package_contents: "Crystal knob; screws to be confirmed from sheet" })),
  },
  previewProduct("brass-bar", "brass-bar-cabinet-handle", "Brass Bar Cabinet Handle", "handles", "Preview catalogue row. Replace with sheet data before launch.", ["Brushed Brass", "Golden"], ["Kitchen Cabinets", "Wardrobes"]),
  previewProduct("d-handle", "d-shape-cabinet-handle", "D-Shape Cabinet Handle", "handles", "Preview catalogue row. Replace with sheet data before launch.", ["Stainless Steel", "Black"], ["Kitchen Cabinets", "Wardrobes"]),
  previewProduct("slim-bar", "slim-bar-cabinet-handle", "Slim Bar Cabinet Handle", "handles", "Preview catalogue row. Replace with sheet data before launch.", ["Satin White", "Black"], ["Kitchen Cabinets"]),
  previewProduct("round-knob", "round-brass-knob", "Round Brass Knob", "knobs", "Preview catalogue row. Replace with sheet data before launch.", ["Brushed Brass", "Golden"], ["Kitchen Cabinets", "Wardrobes"]),
  previewProduct("mushroom-knob", "mushroom-cabinet-knob", "Mushroom Cabinet Knob", "knobs", "Preview catalogue row. Replace with sheet data before launch.", ["Chrome", "Black"], ["Kitchen Cabinets"]),
  previewProduct("mortise-lock", "mortise-door-lock", "Mortise Door Lock", "locks", "Preview catalogue row. Replace with sheet data before launch.", ["Stainless Steel", "Brushed Brass"], ["Doors & Gates"]),
  previewProduct("cam-lock", "cupboard-cam-lock", "Cupboard Cam Lock", "locks", "Preview catalogue row. Replace with sheet data before launch.", ["Nickel", "Black"], ["Wardrobes", "Kitchen Cabinets"]),
  previewProduct("cylinder-lock", "cylindrical-door-lock", "Cylindrical Door Lock", "locks", "Preview catalogue row. Replace with sheet data before launch.", ["Stainless Steel", "Chrome"], ["Doors & Gates"]),
  previewProduct("drawer-lock", "drawer-lock", "Drawer Lock", "locks", "Preview catalogue row. Replace with sheet data before launch.", ["Nickel"], ["Kitchen Cabinets", "Wardrobes"]),
  { ...previewProduct("hinge-full", "hydraulic-concealed-hinge-full-overlay", "Hydraulic Concealed Hinge — Full Overlay", "hinges", "Preview catalogue row. Overlay and adjustment are separate attributes and must be confirmed from the sheet.", ["Nickel"], ["Kitchen Cabinets", "Wardrobes"], { overlay_type: "Full overlay", adjustment_type: "To be confirmed from sheet" }), featured: true },
  { ...previewProduct("hinge-half", "hydraulic-concealed-hinge-half-overlay", "Hydraulic Concealed Hinge — Half Overlay", "hinges", "Preview catalogue row. Overlay and adjustment are separate attributes and must be confirmed from the sheet.", ["Nickel"], ["Kitchen Cabinets", "Wardrobes"], { overlay_type: "Half overlay", adjustment_type: "To be confirmed from sheet" }) },
  previewProduct("hinge-soft", "soft-close-concealed-hinge", "Soft-Close Concealed Hinge", "hinges", "Preview catalogue row. Replace with sheet data before launch.", ["Nickel"], ["Kitchen Cabinets"]),
  previewProduct("butt-hinge", "butt-hinge", "Butt Hinge", "hinges", "Preview catalogue row. Replace with sheet data before launch.", ["Stainless Steel"], ["Doors & Gates"]),
  previewProduct("drain-round", "round-drain-jali", "Round Drain Jali", "drain-jali", "Preview catalogue row. Size and hole pattern to be confirmed from the sheet.", ["Stainless Steel"], ["Bathroom & Utility"]),
  previewProduct("drain-square", "square-drain-jali", "Square Drain Jali", "drain-jali", "Preview catalogue row. Size and hole pattern to be confirmed from the sheet.", ["Stainless Steel", "Chrome"], ["Bathroom & Utility"]),
  previewProduct("drain-hole", "drain-jali-with-hole", "Drain Jali with Hole", "drain-jali", "Preview catalogue row. Size and hole pattern to be confirmed from the sheet.", ["Stainless Steel"], ["Bathroom & Utility"]),
  previewProduct("drain-anti", "anti-clog-drain-jali", "Anti-Clog Drain Jali", "drain-jali", "Preview catalogue row. Size and hole pattern to be confirmed from the sheet.", ["Stainless Steel"], ["Bathroom & Utility"]),
  { ...previewProduct("pipe-white", "flexible-drain-pipe-white", "Flexible Drain Pipe — White", "drain-pipes", "Preview catalogue row. Measurements to be confirmed from the sheet.", ["White"], ["Bathroom & Utility"]), featured: true },
  previewProduct("pipe-black", "flexible-drain-pipe-black", "Flexible Drain Pipe — Black", "drain-pipes", "Preview catalogue row. Measurements to be confirmed from the sheet.", ["Black"], ["Bathroom & Utility"]),
  previewProduct("pipe-ext", "flexible-drain-pipe-extended", "Flexible Drain Pipe — Extended", "drain-pipes", "Preview catalogue row. Measurements to be confirmed from the sheet.", ["White"], ["Bathroom & Utility"]),
  previewProduct("pipe-kit", "sink-drain-pipe-kit", "Sink Drain Pipe Kit", "drain-pipes", "Preview catalogue row. Measurements to be confirmed from the sheet.", ["White", "Black"], ["Bathroom & Utility", "Kitchen Cabinets"]),
];
export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const productsByCategory = (slug: string) => PRODUCTS.filter((p) => p.category === slug);
export const allFinishes = [...new Set(PRODUCTS.flatMap((p) => p.finishes))].sort();
export const allMaterials = [...new Set(PRODUCTS.flatMap((p) => p.variants.map((v) => v.material)))].sort();
export const APPLICATIONS = ["Kitchen Cabinets", "Wardrobes", "Doors & Gates", "Bathroom & Utility"];
export function searchProducts(q: string): Product[] {
  const needle = q.trim().toLowerCase(); if (!needle) return PRODUCTS;
  return PRODUCTS.filter((p) => [p.title, p.category, ...p.variants.map((v) => v.sku), ...p.finishes].join(" ").toLowerCase().includes(needle));
}
export function filterProducts(list: Product[], f: { category?: string; finish?: string; material?: string; application?: string }): Product[] {
  return list.filter((p) =>
    (!f.category || p.category === f.category) &&
    (!f.finish || p.finishes.includes(f.finish)) &&
    (!f.material || p.variants.some((v) => v.material === f.material)) &&
    (!f.application || p.applications.includes(f.application)));
}
