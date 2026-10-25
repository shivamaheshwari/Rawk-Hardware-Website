import { Link } from "react-router";

/**
 * Full-width listing banner, shown on search results and collection
 * pages (like the reference banner): navy panel, breadcrumbs, title and
 * description. An image is shown only when the collection actually has
 * one in the data (handles, knobs) — never a stock or invented image.
 */
export default function ListingBanner({
  title, description, image, imageAlt, crumbs,
}: {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  crumbs: { name: string; path: string }[];
}) {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto flex w-full max-w-[1440px] items-stretch justify-between gap-6 px-4 py-8 sm:px-[30px] lg:px-12">
        <div className="min-w-0 py-2">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-white/70">
            {crumbs.map((c, i) => (
              <span key={c.path} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden>›</span>}
                {i === crumbs.length - 1
                  ? <span className="text-white">{c.name}</span>
                  : <Link to={c.path} prefetch="intent" className="hover:text-white hover:underline">{c.name}</Link>}
              </span>
            ))}
          </nav>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/80">{description}</p>
        </div>
        {image && (
          <img src={image} alt={imageAlt ?? ""} width={320} height={240} className="hidden w-72 shrink-0 self-center rounded object-cover md:block" />
        )}
      </div>
    </section>
  );
}
