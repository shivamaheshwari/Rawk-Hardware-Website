import type { ActionFunction, MetaFunction } from "react-router";
import LeadForm, { type ActionResult } from "../components/LeadForm";
import { formLead, saveLead, validateLead } from "../lib/leads.server";
import { canonical } from "../lib/seo";
import { Breadcrumbs } from "../components/Misc";
export const meta: MetaFunction = () => [{ title: "Bulk Orders & Project Quotes | RAWK" }, { name: "description", content: "Request a bulk or project quote for RAWK hardware. Share product codes, quantities and your city." }, { tagName: "link", rel: "canonical", href: canonical("/bulk-orders") }];
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  if (String(form.get("website") ?? "")) return { ok: false, errors: {}, values: {} } satisfies ActionResult;
  const lead = formLead(form, "bulk-orders");
  const errors = validateLead(lead);
  if (Object.keys(errors).length) return { ok: false, errors, values: Object.fromEntries(Object.entries(lead).map(([k, val]) => [k, String(val)])) } satisfies ActionResult;
  const saved = await saveLead(lead);
  if (!saved.ok) return { ok: false, error: "The enquiry could not be saved. Please try again or use WhatsApp.", values: Object.fromEntries(Object.entries(lead).map(([k, val]) => [k, String(val)])) } satisfies ActionResult;
  return { ok: true, duplicate: saved.duplicate } satisfies ActionResult;
};
export default function Bulk() {
  return (<div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
    <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Bulk Orders", path: "/bulk-orders" }]} />
    <h1 className="mt-3 font-serif text-4xl text-navy">Buying for a project or your store?</h1>
    <p className="mt-2 max-w-2xl text-body">Share product codes, quantities and your city. Request availability and a tailored quote. Minimum bulk order: Rs 2,000. Lead time and discount are confirmed by the shop privately.</p>
    <div className="mt-6"><LeadForm source="bulk-orders" heading="Request a bulk quote" showBuyingPurpose /></div>
  </div>);
}
