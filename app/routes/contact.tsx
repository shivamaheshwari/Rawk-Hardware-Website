import type { ActionFunction, MetaFunction } from "react-router";
import LeadForm, { type ActionResult } from "../components/LeadForm";
import { formLead, saveLead, validateLead } from "../lib/leads.server";
import { canonical } from "../lib/seo";
import { Breadcrumbs } from "../components/Misc";
import { BUSINESS } from "../lib/site";
export const meta: MetaFunction = () => [{ title: "Contact RAWK | Vinayak Enterprises, Gwalior" }, { name: "description", content: "Contact Vinayak Enterprises, Gwalior, for RAWK hardware enquiries." }, { tagName: "link", rel: "canonical", href: canonical("/contact") }];
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  if (String(form.get("website") ?? "")) return { ok: false, errors: {}, values: {} } satisfies ActionResult;
  const lead = formLead(form, "contact");
  const errors = validateLead(lead);
  if (Object.keys(errors).length) return { ok: false, errors, values: Object.fromEntries(Object.entries(lead).map(([k, val]) => [k, String(val)])) } satisfies ActionResult;
  const saved = await saveLead(lead);
  if (!saved.ok) return { ok: false, error: "The enquiry could not be saved. Please try again or use WhatsApp.", values: Object.fromEntries(Object.entries(lead).map(([k, val]) => [k, String(val)])) } satisfies ActionResult;
  return { ok: true, duplicate: saved.duplicate } satisfies ActionResult;
};
export default function Contact() {
  return (<div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
    <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
    <h1 className="mt-3 font-serif text-4xl text-navy">Contact</h1>
    <div className="mt-4 rounded-xl border border-line bg-white p-5 text-body">
      <p><strong className="text-navy">{BUSINESS.businessName}</strong><br />{BUSINESS.address}<br />Phone: {BUSINESS.phones.join(" / ")}<br />Instagram: <a className="underline" href={BUSINESS.instagramUrl} target="_blank" rel="noreferrer">{BUSINESS.instagram}</a></p>
      <p className="mt-2 text-sm text-muted">Business hours and email have not been confirmed yet and are therefore not shown. Use WhatsApp or the form below.</p>
    </div>
    <div className="mt-6"><LeadForm source="contact" heading="Send an enquiry" /></div>
  </div>);
}
