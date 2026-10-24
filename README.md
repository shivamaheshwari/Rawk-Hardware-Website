# RAWK Hardware — Catalogue Website

Server-rendered catalogue and enquiry site for RAWK (Hardware by Vinayak
Enterprise, Gwalior). No cart, no checkout, no payment, no forced account.

**Stack:** React Router v7 (the modern Remix) + Vite + Node.js + Tailwind
CSS v4. Pages are server-rendered, so product content is in the HTML for
crawlers. Fonts: DM Serif Display (headings) + Inter (body), with system
fallbacks.

## Run it

```bash
npm install
npm run dev        # development server
npm run build      # production build
npm run start      # serve the production build (default port 3000)
npm run typecheck  # tsc -b
```

## Routes

| Route | What it is |
|---|---|
| `/` | Home: hero, 6 categories, featured slider, finish slider, applications, wholesale banner, guides, FAQ, mobile enquiry bar |
| `/products` | Search (title/category/SKU) + filters (category, finish, material, application) via URL params, sort by name/featured (no price sort — no prices exist) |
| `/categories/:slug` | handles, knobs, locks, hinges, drain-jali, drain-pipes |
| `/products/:slug` | Gallery, size/finish/pack variant switching (SKU, specs, image and Amazon link update together; impossible combinations are disabled), WhatsApp draft, quote prefill, related products |
| `/bulk-orders`, `/contact` | Validated forms; see "Leads" below |
| `/catalogue` | Explains the catalogue PDF is pending approval — no dummy PDF is served |
| `/about`, `/guides`, `/guides/:slug`, `/privacy`, `/terms` | Static + 3 real guides |
| `/sitemap.xml`, `/robots.txt` | Only canonical public pages; nothing important blocked |

## Product data — what is verified, what is preview

`app/data/products.ts` is the current catalogue: **26 products across all
6 categories** (Handles 6, Knobs 4, Locks 4, Hinges 4, Drain Jali 4,
Drain Pipes 4).

- **Verified** (facts from the user's own posters/photos only):
  - 509 Handle — Premium Zinc, mounting centres 96/160/224/288 mm,
    finishes Golden White / Black White / Rose Gold White / Satin White.
  - D2 Cabinet Handle Rose Gold Black, 6-inch, Zinc — the **only**
    product with an Amazon button, linking to the verified listing
    https://www.amazon.in/dp/B0GMD2D2JY . Every other product hides the
    Amazon button; no ASIN was invented.
  - Curved Cabinet Handle — Premium Zinc, poster finishes and inch sizes.
  - V-Shape Knob — Premium Zinc, poster finishes and inch sizes.
  - Crystal Knob — Premium Zinc, poster finishes; size deliberately left
    "to be confirmed" (the poster size line was not carried over for a knob
    pending sheet confirmation).
- **Preview** (21 products): placeholder rows so every category and route
  works. Their specs say "To be confirmed from sheet" instead of invented
  millimetres, prices or materials. They are marked "Preview" on cards and
  product pages. **Replace them with sheet data before launch** (see below).
  This build does not claim they are verified, and plan.md acceptance
  check 10 (remove demo products before production) still applies.

No prices, fake stock, discounts, ratings, reviews, "rust-proof" or
lifetime claims anywhere. Where price is unknown the site says
"Request current price".

### Images — real photos only

`public/images/` (compressed JPEGs, ~110–170 KB each):

- `509-handle-overview.jpg`, `509-handle-colors.jpg` — from
  `your_files/rawk-vinayak-campaign/509-handle-overview.png` /
  `509-handle-colors.png` (visually verified RAWK posters).
- `curved-handle-colors.jpg`, `curved-handle-collection.jpg` — from the
  campaign curved-handle posters (visually verified).
- `v-shape-knob-collection.jpg`, `crystal-knob-collection.jpg` — from the
  campaign collection posters (visually verified, RAWK branding + Vinayak
  Enterprise phones match the business facts).
- `d2-cabinet-handle-rose-gold-black.jpg` — from
  `user/files/79499_9_27ui.jpg` (black + rose-gold handle on white,
  visually verified).

Products with no verified photo get a neutral navy/brass placeholder
panel labelled "Preview image — photo to be added" in its alt text. No
stock photos are passed off as RAWK products, and no poster showing
another company's name/phone was used (the LIKENEW poster in
`user/files/` was explicitly excluded). The design concept image was used
only as layout direction, never as inventory, specs or logo.

## Connecting the Google Sheet (not connected yet)

No Sheet link was supplied with this build, so **no live Sheet connection
is claimed**. The data layer is ready in `app/data/source.ts`:

- Set `GOOGLE_SHEET_ID` (a sheet published via "Publish to web") or
  `GOOGLE_SHEETS_CSV_URL` in the environment.
- Expected import columns (exactly plan.md §4):
  `product_slug, title, category, sku, finish, size_label, material,
  pack_count, overall_length_mm, mounting_centres_mm,
  fitting_diameter_mm, overlay_type, adjustment_type, screws_included,
  package_contents, image_files, amazon_url, publication_status`
- `parseSheetCsv()` and `sheetValidationErrors()` (duplicate SKUs,
  non-amazon.in URLs, bad publication_status) are provided for the loader
  that will replace the static dataset. Validate before publishing and
  log rejected rows — never silently publish partial data. When the Sheet
  is wired in, keep one source of truth: the loader should return sheet
  rows mapped onto the `Product`/`Variant` types in
  `app/data/products.ts`, not a second copy of the data.

## Leads (bulk + contact forms)

- Server action validates (name required; phone OR email required;
  phone/email/quantity formats), checks a honeypot field, and applies an
  idempotency token so a double-click does not create a duplicate lead.
- On success the lead is appended to `data/leads.jsonl` (one JSON object
  per line, **not** under `public/`, git-ignored). Success is returned
  **only after persistence**. On failure the form shows a retry message
  plus a WhatsApp fallback.
- **Email notification is NOT configured.** Each saved lead records
  `notification: "pending — no mail provider configured"`. Staff must
  check `data/leads.jsonl` until a mail provider is configured. Do not
  claim email delivery works.

## WhatsApp

Click-to-chat to `919589133387` (wa.me). Product drafts are URL-encoded
and include product, SKU, size, finish, pack, quantity and the canonical
page URL. Clicking opens a draft; the user sends it themselves.

## SEO checklist — status

Done in this build: unique title + meta description + one H1 per page;
canonical URLs (base from `SITE_URL` env, default placeholder
`https://www.rawk.example` — **set `SITE_URL` to the real domain before
launch**); semantic HTML; BreadcrumbList + Organization JSON-LD;
Product JSON-LD matching visible details only (no Offer/price/
availability/rating, because none is displayed); XML sitemap of canonical
public pages only; robots.txt allowing important pages; internal links
home → categories → products and guides → related products; responsive
images with width/height, lazy-loading below the fold, compressed images;
helpful 404 with links; breadcrumbs; no price sort; filter URLs are not
in the sitemap.

Still to do at launch (needs the business, not code): set `SITE_URL`;
connect Google Search Console and submit the sitemap; inspect key URLs;
validate structured data; measure WhatsApp/Amazon clicks and form
submissions; review broken links and outdated details regularly.

## Sliders

Featured-products slider and finish slider: manual prev/next buttons,
dots, keyboard left/right arrows, and touch swipe. **No autoplay**
(design.md §8). Slides per view: 1 mobile, 2 tablet, 4 desktop
(featured); 2/3/5 for finishes. Layout uses `overflow-x-clip` on the page
shell and `max-w-[1200px]` containers; check at 360 px after any layout
change.

## Still needed before launch (user input)

1. **Original RAWK logo file** — none was supplied. The header/footer use
   a clean typographic wordmark "RAWK" + "Hardware by Vinayak Enterprise".
   This is NOT presented as the original logo; replace it when the file
   arrives. The mockup wordmark from the design concept image was not
   reproduced as a logo.
2. **Google Sheet link** (or approved product/variant data) to replace the
   21 preview products and confirm: 509 overall lengths, curved/V-knob
   mounting centres, knob sizes, lock/hinge/jali/pipe specs, screws
   included, and any further verified Amazon URLs.
3. **Approved catalogue PDF** for `/catalogue` (currently request-only).
4. **Mail provider** for lead notifications (see "Leads").
5. **Domain + hosting** — this build was deliberately NOT pushed to
   GitHub and NOT deployed. Set `SITE_URL`, then deploy the production
   build (`npm run build && npm run start`) behind HTTPS.
6. Business hours and a contact email, if they should be shown (currently
   honestly omitted from Contact/About rather than invented).
7. Exact legal/trading name confirmation ("Vinayak Enterprises" vs
   "Vinayak Enterprise" — the site uses "Vinayak Enterprises" for the
   business and "Hardware by Vinayak Enterprise" as the brand descriptor
   from the supplied material; confirm before launch).

## File tree (key files)

```
app/
  data/products.ts        # catalogue (sheet-ready model)
  data/source.ts          # Sheet CSV parsing + validation (not connected)
  data/guides.ts          # 3 buying guides
  lib/site.ts             # business facts, WhatsApp builder, finish swatches
  lib/seo.ts              # canonical + JSON-LD helpers
  lib/listing.ts          # search/filter/sort from URL params
  lib/leads.server.ts     # form validation + data/leads.jsonl persistence
  components/Chrome.tsx   # header, footer, mobile enquiry bar
  components/ProductCard.tsx, components/Slider.tsx, components/Misc.tsx
  components/LeadForm.tsx
  routes/                 # home, products, product, category, bulk, contact,
                          # catalogue, about, guides, guide, privacy, terms,
                          # notfound, sitemap, robots
public/images/            # verified RAWK photos (see above)
data/leads.jsonl          # created on first form submission (git-ignored)
```
