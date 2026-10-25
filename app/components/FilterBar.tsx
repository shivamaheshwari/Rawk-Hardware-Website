import { useEffect, useState } from "react";
import RawkButton from "./RawkButton";

/**
 * Nulo-style filter UI, in the RAWK theme (navy/brass/ivory, Lato).
 *
 * - Desktop (lg+): a bar that sticks under the sticky header on scroll
 *   (top offset matches the header height, ~104px). Row 1: FILTERS label
 *   (collapses the group row), search, Sort By, Clear All (n). Row 2:
 *   All Products + one button per filter group — plus icon when closed,
 *   minus when open (the user's uploaded SVGs), with a brass count badge
 *   when the group has a value. The open group's panel shows checkboxes;
 *   filters here are single-value (as the catalogue loader supports), so
 *   ticking a value sets it and ticking the ticked value clears it.
 * - Mobile/tablet (below lg): a bottom bar that sticks above the enquiry
 *   bar, with FILTER (n) and SORT. Tapping either opens a full-screen
 *   drawer like the reference: filter groups down the left, the selected
 *   group's options on the right, CLOSE / APPLY at the bottom. APPLY
 *   commits the whole draft at once; CLOSE discards it.
 *
 * Values are controlled by the page: the /products page wires them to the
 * URL (so filters stay shareable and crawlable), the category page wires
 * them to local state within that category.
 */
export type FilterOption = string | { value: string; label: string };
export type FilterGroup = { key: string; label: string; options: FilterOption[] };
const optValue = (o: FilterOption) => (typeof o === "string" ? o : o.value);
const optLabel = (o: FilterOption) => (typeof o === "string" ? o : o.label);
export type FilterValues = Record<string, string>;

type FilterBarProps = {
  groups: FilterGroup[];
  values: FilterValues;
  sort: string;
  sortOptions: { value: string; label: string }[];
  activeCount: number;
  resultText: string;
  search?: { value: string; placeholder?: string };
  onValueChange: (key: string, value: string) => void;
  onSortChange: (value: string) => void;
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

function ToggleIcon({ open }: { open: boolean }) {
  return <img src={open ? "/icons/minus.svg" : "/icons/plus.svg"} alt="" aria-hidden="true" width={14} height={14} className="h-3.5 w-3.5 shrink-0" />;
}

export default function FilterBar({
  groups, values, sort, sortOptions, activeCount, resultText, search,
  onValueChange, onSortChange, onClearAll, onSearch, onApplyDraft,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(true);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerGroup, setDrawerGroup] = useState<string>("sort");
  const [draft, setDraft] = useState<FilterValues>({});
  const [draftSort, setDraftSort] = useState(sort);
  const [draftSearch, setDraftSearch] = useState("");

  const openDrawer = (group: string) => {
    setDraft({ ...values });
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
      {/* Desktop sticky filter bar */}
      <div className="sticky top-[104px] z-30 hidden border-y border-line bg-white lg:block">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-[30px] lg:px-12">
          <div className="flex flex-wrap items-center gap-3 py-3">
            <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy">
              Filters <ToggleIcon open={expanded} />
            </button>
            {search && onSearch && (
              <form
                className="flex min-w-0 flex-1"
                onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onSearch(String(fd.get("q") ?? "")); }}
              >
                <label htmlFor="filter-search" className="sr-only">Search products</label>
                <input id="filter-search" name="q" defaultValue={search.value} placeholder={search.placeholder ?? "Search products…"} className="min-h-11 w-full min-w-0 max-w-xs rounded-lg border border-line bg-white px-3 text-[15px]" />
              </form>
            )}
            <label className="ml-auto flex items-center gap-2 text-sm text-navy">
              <span className="text-muted">Sort By:</span>
              <select value={sort} onChange={(e) => onSortChange(e.target.value)} className="min-h-11 rounded-lg border border-line bg-white px-2 font-bold text-navy">
                {sortOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </label>
            {activeCount > 0 && (
              <button type="button" onClick={onClearAll} className="min-h-11 text-sm font-bold text-navy underline">Clear All ({activeCount})</button>
            )}
          </div>
          {expanded && (
            <div className="flex flex-wrap items-center gap-2 border-t border-line py-3">
              <button type="button" onClick={onClearAll} className={`min-h-11 rounded-full border px-4 text-sm font-bold transition-colors duration-200 ${activeCount === 0 ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-navy"}`}>All Products</button>
              {groups.map((g) => {
                const active = Boolean(values[g.key]);
                const open = openGroup === g.key;
                return (
                  <button key={g.key} type="button" onClick={() => setOpenGroup(open ? null : g.key)} aria-expanded={open} className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors duration-200 ${open || active ? "border-navy bg-ivory text-navy" : "border-line bg-white text-navy hover:border-navy"}`}>
                    {g.label}
                    {active && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[11px] font-bold text-white">1</span>}
                    <ToggleIcon open={open} />
                  </button>
                );
              })}
              <span className="ml-auto text-sm text-muted">{resultText}</span>
            </div>
          )}
          {expanded && openGroupDef && (
            <div className="border-t border-line py-4">
              <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
                {openGroupDef.options.map((opt) => (
                  <CheckBox key={optValue(opt)} label={optLabel(opt)} checked={values[openGroupDef.key] === optValue(opt)} onClick={() => onValueChange(openGroupDef.key, values[openGroupDef.key] === optValue(opt) ? "" : optValue(opt))} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/tablet bottom sticky bar */}
      <div className="fixed bottom-[calc(60px+env(safe-area-inset-bottom))] left-0 right-0 z-30 flex border-t border-line bg-white lg:hidden">
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
            {activeCount > 0 && (
              <button type="button" onClick={() => { setDraft({}); setDraftSort(sortOptions[0]?.value ?? sort); }} className="text-sm font-bold text-navy underline">Clear All</button>
            )}
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
              {groups.map((g) => (
                <button key={g.key} type="button" onClick={() => setDrawerGroup(g.key)} className={`flex w-full items-center justify-between border-b border-line px-3 py-3 text-left text-sm font-bold ${drawerGroup === g.key ? "bg-white text-navy" : "text-muted"}`}>
                  {g.label}
                  {draft[g.key] && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass text-[11px] font-bold text-white">1</span>}
                </button>
              ))}
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
                    <CheckBox key={optValue(opt)} label={optLabel(opt)} checked={draft[drawerGroupDef.key] === optValue(opt)} onClick={() => setDraft((d) => ({ ...d, [drawerGroupDef.key]: d[drawerGroupDef.key] === optValue(opt) ? "" : optValue(opt) }))} />
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
