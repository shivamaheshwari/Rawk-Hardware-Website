import { useEffect, useState } from "react";
import RawkButton from "./RawkButton";

/**
 * Nulo-style filter UI, in the RAWK theme (navy/brass/ivory, Lato).
 *
 * Combination filters: every dimension is MULTI-value. Ticking several
 * finishes (or materials, categories, applications) ORs within that
 * dimension and ANDs across dimensions, e.g. Finish = Rose Gold Black
 * OR Golden White, AND Material = Zinc. The /products page keeps this in
 * the URL (repeated params, so filters stay shareable); the category
 * page keeps it in local state within that category.
 *
 * Stickiness: the desktop bar sticks under the header (top = the measured
 * header height, set as --header-height by Chrome.tsx, so the bar aligns
 * exactly with the header bottom at any width). The mobile bar sits in
 * normal flow directly above the cards and sticks under the header once
 * scrolled past, unsticking again when scrolled back to its place.
 * The mobile drawer (FILTER / SORT) batches changes: CLOSE discards the
 * draft, APPLY commits it once.
 */
export type FilterOption = string | { value: string; label: string };
export type FilterGroup = { key: string; label: string; options: FilterOption[] };
export type FilterValues = Record<string, string[]>;
const optValue = (o: FilterOption) => (typeof o === "string" ? o : o.value);
const optLabel = (o: FilterOption) => (typeof o === "string" ? o : o.label);

/**
 * Scroll the results block into view just below the sticky stack
 * (header + whichever filter bar is visible), with a small gap. Used
 * after a filter apply so the page never jumps back to the banner, but
 * the top row of cards and the showing-result text land visible.
 */
export function scrollToResults(el: HTMLElement | null) {
  if (!el || typeof window === "undefined") return;
  const header = document.querySelector("header");
  const bar = document.querySelector(window.innerWidth >= 1024 ? ".filter-bar-desktop" : ".filter-bar-mobile");
  const offset = (header?.getBoundingClientRect().height ?? 0) + (bar?.getBoundingClientRect().height ?? 0) + 16;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

type FilterBarProps = {
  groups: FilterGroup[];
  values: FilterValues;
  sort: string;
  sortOptions: { value: string; label: string }[];
  activeCount: number;
  search?: { value: string; placeholder?: string };
  onValueChange: (key: string, value: string) => void;
  onClearAll: () => void;
  onSearch?: (q: string) => void;
  onApplyDraft?: (values: FilterValues, sort: string, searchQ?: string) => void;
};

function CheckBox({ checked, label, onClick }: { checked: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={checked} className="flex min-h-11 items-center gap-2 text-left text-[15px] text-navy">
      <span aria-hidden className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border text-[13px] font-bold leading-none transition-colors duration-200 ${checked ? "border-navy bg-navy text-white" : "border-line bg-white text-transparent"}`}>✓</span>
      <span className={checked ? "font-bold" : ""}>{label}</span>
    </button>
  );
}

export function SortControl({ sort, sortOptions, onSortChange }: { sort: string; sortOptions: { value: string; label: string }[]; onSortChange: (value: string) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-navy">
      <span className="text-muted">Sort By:</span>
      <select value={sort} onChange={(e) => onSortChange(e.target.value)} className="min-h-11 rounded-lg border border-line bg-white px-2 font-bold text-navy">
        {sortOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </label>
  );
}

function ToggleIcon({ open }: { open: boolean }) {
  return <img src={open ? "/icons/minus.svg" : "/icons/plus.svg"} alt="" aria-hidden="true" width={14} height={14} className="h-3.5 w-3.5 shrink-0" />;
}

const toggleIn = (arr: string[], value: string) => (arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

export default function FilterBar({
  groups, values, sort, sortOptions, activeCount, search,
  onValueChange, onClearAll, onSearch, onApplyDraft,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(true);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerGroup, setDrawerGroup] = useState<string>("sort");
  const [draft, setDraft] = useState<FilterValues>({});
  const [draftSort, setDraftSort] = useState(sort);
  const [draftSearch, setDraftSearch] = useState("");

  const openDrawer = (group: string) => {
    setDraft(Object.fromEntries(groups.map((g) => [g.key, [...(values[g.key] ?? [])]])));
    setDraftSort(sort);
    setDraftSearch(search?.value ?? "");
    setDrawerGroup(group);
    setDrawerOpen(true);
  };

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [drawerOpen]);

  const openGroupDef = groups.find((g) => g.key === openGroup) ?? null;
  const drawerGroupDef = groups.find((g) => g.key === drawerGroup) ?? null;

  return (
    <>
      {/* Desktop sticky filter bar (sticks exactly under the header) */}
      <div className="filter-bar-desktop sticky z-30 hidden border-y border-line bg-white lg:block" style={{ top: "var(--header-height, 104px)" }}>
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-[30px] lg:px-12">
          <div className="flex flex-wrap items-center gap-3 py-3">
            <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy">
              Filters <ToggleIcon open={expanded} />
            </button>
          </div>
          {expanded && (
            <div className="flex flex-wrap items-center gap-2 border-t border-line py-3">
              <button type="button" onClick={onClearAll} className={`min-h-11 rounded-full border px-4 text-sm font-bold transition-colors duration-200 ${activeCount === 0 ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-navy"}`}>All Products</button>
              {groups.map((g) => {
                const count = values[g.key]?.length ?? 0;
                const open = openGroup === g.key;
                return (
                  <button key={g.key} type="button" onClick={() => setOpenGroup(open ? null : g.key)} aria-expanded={open} className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors duration-200 ${open || count > 0 ? "border-navy bg-ivory text-navy" : "border-line bg-white text-navy hover:border-navy"}`}>
                    {g.label}
                    {count > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[11px] font-bold text-white">{count}</span>}
                    <ToggleIcon open={open} />
                  </button>
                );
              })}
              {activeCount > 0 && (
                <button type="button" onClick={onClearAll} className="ml-auto min-h-11 text-sm font-bold text-navy underline">Clear All ({activeCount})</button>
              )}
            </div>
          )}
          {expanded && openGroupDef && (
            <div className="border-t border-line py-4">
              <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
                {openGroupDef.options.map((opt) => (
                  <CheckBox key={optValue(opt)} label={optLabel(opt)} checked={(values[openGroupDef.key] ?? []).includes(optValue(opt))} onClick={() => onValueChange(openGroupDef.key, optValue(opt))} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/tablet bar: in flow above the cards, sticks under the header */}
      <div className="filter-bar-mobile sticky z-30 flex border-b border-line bg-white lg:hidden" style={{ top: "var(--header-height, 104px)" }}>
        <button type="button" onClick={() => openDrawer(groups[0]?.key ?? "sort")} className="flex min-h-12 flex-1 items-center justify-center gap-2 border-r border-line text-sm font-bold uppercase tracking-wide text-navy">
          Filter
          {activeCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[11px] font-bold text-white">{activeCount}</span>}
        </button>
        <button type="button" onClick={() => openDrawer("sort")} className="flex min-h-12 flex-1 items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-navy">Sort</button>
      </div>

      {/* Mobile/tablet filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-bold uppercase tracking-wide text-navy">Filters</p>
            <button type="button" onClick={() => { setDraft({}); setDraftSort(sortOptions[0]?.value ?? sort); setDraftSearch(""); }} className="text-sm font-bold text-navy underline">Clear All</button>
          </div>
          {search && (
            <div className="border-b border-line px-4 py-3">
              <label htmlFor="drawer-search" className="sr-only">Search products</label>
              <input id="drawer-search" value={draftSearch} onChange={(e) => setDraftSearch(e.target.value)} placeholder={search.placeholder ?? "Search products…"} className="min-h-11 w-full rounded-lg border border-line px-3 text-[15px]" />
            </div>
          )}
          <div className="grid flex-1 grid-cols-[132px_1fr] overflow-hidden">
            <div className="overflow-y-auto border-r border-line bg-ivory/60">
              <button type="button" onClick={() => setDrawerGroup("sort")} className={`block w-full border-b border-line px-3 py-3 text-left text-sm font-bold ${drawerGroup === "sort" ? "bg-white text-navy" : "text-muted"}`}>Sort</button>
              {groups.map((g) => {
                const count = draft[g.key]?.length ?? 0;
                return (
                  <button key={g.key} type="button" onClick={() => setDrawerGroup(g.key)} className={`flex w-full items-center justify-between border-b border-line px-3 py-3 text-left text-sm font-bold ${drawerGroup === g.key ? "bg-white text-navy" : "text-muted"}`}>
                    {g.label}
                    {count > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[11px] font-bold text-white">{count}</span>}
                  </button>
                );
              })}
            </div>
            <div className="overflow-y-auto px-4 py-3">
              {drawerGroup === "sort" ? (
                <div className="space-y-1">
                  {sortOptions.map((o) => (
                    <CheckBox key={o.value} label={o.label} checked={draftSort === o.value} onClick={() => setDraftSort(o.value)} />
                  ))}
                </div>
              ) : drawerGroupDef ? (
                <div className="space-y-1">
                  {drawerGroupDef.options.map((opt) => (
                    <CheckBox key={optValue(opt)} label={optLabel(opt)} checked={(draft[drawerGroupDef.key] ?? []).includes(optValue(opt))} onClick={() => setDraft((d) => ({ ...d, [drawerGroupDef.key]: toggleIn(d[drawerGroupDef.key] ?? [], optValue(opt)) }))} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex border-t border-line">
            <button type="button" onClick={() => setDrawerOpen(false)} className="min-h-12 flex-1 border-r border-line text-sm font-bold uppercase tracking-wide text-navy">Close</button>
            <button
              type="button"
              onClick={() => {
                if (onApplyDraft) onApplyDraft(draft, draftSort, search ? draftSearch : undefined);
                else if (onSearch && search && draftSearch !== search.value) onSearch(draftSearch);
                setDrawerOpen(false);
              }}
              className="min-h-12 flex-1 bg-navy text-sm font-bold uppercase tracking-wide text-white"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </>
  );
}
