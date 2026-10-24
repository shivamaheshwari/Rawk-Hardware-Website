import { useState, type ReactNode } from "react";
import { Link } from "react-router";
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (<nav aria-label="Breadcrumb" className="text-sm text-muted"><ol className="flex flex-wrap gap-1">
    {items.map((it, i) => (<li key={it.path} className="flex gap-1">{i > 0 && <span aria-hidden>/</span>}{i < items.length - 1 ? <Link to={it.path} className="underline underline-offset-2">{it.name}</Link> : <span aria-current="page" className="text-body">{it.name}</span>}</li>))}
  </ol></nav>);
}
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (<div className="space-y-3">{items.map((it, i) => (
    <div key={i} className="rounded-xl border border-line bg-white">
      <button type="button" className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left font-semibold text-navy" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
        {it.q}<span aria-hidden>{open === i ? "−" : "+"}</span>
      </button>
      {open === i && <p className="px-4 pb-4 text-[15px] leading-relaxed text-body">{it.a}</p>}
    </div>))}</div>);
}
export function Section({ title, sub, children, action }: { title: string; sub?: string; children: ReactNode; action?: ReactNode }) {
  return (<section className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-8">
    <div className="mb-5 flex items-end justify-between gap-4">
      <div><h2 className="font-serif text-3xl text-navy sm:text-4xl">{title}</h2>{sub && <p className="mt-1 text-muted">{sub}</p>}</div>{action}
    </div>{children}</section>);
}
