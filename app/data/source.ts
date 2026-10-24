// Data-source layer (plan.md §4). Today the catalogue is the static,
// sheet-ready dataset in products.ts. If a Google Sheet is connected later,
// set GOOGLE_SHEET_ID (published "Publish to web" sheet id) or
// GOOGLE_SHEETS_CSV_URL; a loader can then fetch that CSV, parse it with
// parseSheetCsv() below, and validate it before it replaces static data.
// NO live Sheet is connected in this build — do not claim otherwise.
// Expected import columns (exactly plan.md §4):
// product_slug,title,category,sku,finish,size_label,material,pack_count,
// overall_length_mm,mounting_centres_mm,fitting_diameter_mm,overlay_type,
// adjustment_type,screws_included,package_contents,image_files,amazon_url,
// publication_status
export const SHEET_COLUMNS = ["product_slug","title","category","sku","finish","size_label","material","pack_count","overall_length_mm","mounting_centres_mm","fitting_diameter_mm","overlay_type","adjustment_type","screws_included","package_contents","image_files","amazon_url","publication_status"] as const;
export type SheetRow = Record<string, string>;
export function parseSheetCsv(csv: string): SheetRow[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).filter(Boolean).map((line) => {
    const vals = line.split(",").map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? ""]));
  });
}
export function sheetValidationErrors(rows: SheetRow[]): string[] {
  const errs: string[] = []; const skus = new Set<string>();
  for (const r of rows) {
    if (!r.sku) errs.push(`Missing SKU for ${r.product_slug || "(unknown product)"}`);
    else if (skus.has(r.sku)) errs.push(`Duplicate SKU: ${r.sku}`); else skus.add(r.sku);
    if (r.amazon_url && !/^https:\/\/www\.amazon\.in\//.test(r.amazon_url)) errs.push(`Amazon URL not on amazon.in: ${r.sku}`);
    if (r.publication_status && !["published","draft"].includes(r.publication_status)) errs.push(`Bad publication_status: ${r.sku}`);
  }
  return errs;
}
export const SHEET_ENV = { id: process.env.GOOGLE_SHEET_ID ?? "", csvUrl: process.env.GOOGLE_SHEETS_CSV_URL ?? "" };
export const sheetConnected = Boolean(SHEET_ENV.id || SHEET_ENV.csvUrl);
