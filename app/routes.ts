import { type RouteConfig, index, route } from "@react-router/dev/routes";
export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("products/:slug", "routes/product.tsx"),
  route("categories/:slug", "routes/category.tsx"),
  route("bulk-orders", "routes/bulk.tsx"),
  route("contact", "routes/contact.tsx"),
  route("catalogue", "routes/catalogue.tsx"),
  route("about", "routes/about.tsx"),
  route("guides", "routes/guides.tsx"),
  route("guides/:slug", "routes/guide.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
  route("sitemap.xml", "routes/sitemap.ts"),
  route("robots.txt", "routes/robots.ts"),
  route("*", "routes/notfound.tsx"),
] satisfies RouteConfig;
