import { useEffect, useRef, useState } from "react";
import { Form, useActionData, useNavigation, useSearchParams } from "react-router";
import { whatsappUrl } from "../lib/site";
import RawkButton from "./RawkButton";
export type ActionResult = { ok: boolean; errors?: Record<string, string>; values?: Record<string, string>; duplicate?: boolean; error?: string };
export default function LeadForm({ source, heading }: { source: string; heading: string }) {
  const action = useActionData() as ActionResult | undefined;
  const nav = useNavigation();
  const [params] = useSearchParams();
  const tokenRef = useRef("");
  const [token, setToken] = useState("");
  useEffect(() => { if (!tokenRef.current) { tokenRef.current = `${Date.now()}-${Math.random().toString(36).slice(2)}`; setToken(tokenRef.current); } }, []);
  const sending = nav.state === "submitting";
  const v = (k: string, fallback = "") => action?.values?.[k] ?? params.get(k === "quantity" ? "qty" : k) ?? fallback;
  if (action?.ok) return (<div className="rounded-xl border border-line bg-white p-6" role="status">
    <h2 className="font-serif text-2xl text-navy">Enquiry received — thank you.</h2>
    <p className="mt-2 text-body">{action.duplicate ? "This enquiry was already recorded, so it has not been duplicated." : "Your enquiry has been saved. The shop will confirm price and availability and get back to you."}</p>
    <p className="mt-2 text-sm text-muted">If you need a faster reply, you can also message the shop on WhatsApp.</p>
    <RawkButton variant="whatsapp" href={whatsappUrl("Hello, I just submitted an enquiry on the RAWK website. Could you please check it?")} target="_blank" className="mt-4">Message on WhatsApp</RawkButton>
  </div>);
  return (<div>
    <h2 className="font-serif text-2xl text-navy">{heading}</h2>
    {action?.error && (<p role="alert" className="mt-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
      {action.error} Please try again, or use the WhatsApp fallback below.</p>)}
    <Form method="post" className="mt-4 grid gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-2">
      <input type="hidden" name="token" value={token} />
      <div className="hidden" aria-hidden="true"><label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="block text-sm font-medium text-navy">Full name *<input name="name" defaultValue={v("name")} required className="mt-1 min-h-11 w-full rounded-lg border border-line px-3 font-normal" />{action?.errors?.name && <span className="text-red-700">{action.errors.name}</span>}</label>
      <label className="block text-sm font-medium text-navy">I am a<select name="customerType" defaultValue={v("customerType", "Retail buyer")} className="mt-1 min-h-11 w-full rounded-lg border border-line bg-white px-2 font-normal">
        {["Retail buyer", "Dealer / retailer", "Interior designer", "Carpenter / contractor", "Other"].map((o) => (<option key={o}>{o}</option>))}</select></label>
      <label className="block text-sm font-medium text-navy">Phone<input name="phone" type="tel" defaultValue={v("phone")} className="mt-1 min-h-11 w-full rounded-lg border border-line px-3 font-normal" />{action?.errors?.phone && <span className="text-red-700">{action.errors.phone}</span>}</label>
      <label className="block text-sm font-medium text-navy">Email<input name="email" type="email" defaultValue={v("email")} className="mt-1 min-h-11 w-full rounded-lg border border-line px-3 font-normal" />{action?.errors?.email && <span className="text-red-700">{action.errors.email}</span>}</label>
      {action?.errors?.contact && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{action.errors.contact} (Phone or email is required.)</p>}
      <label className="block text-sm font-medium text-navy">City<input name="city" defaultValue={v("city")} className="mt-1 min-h-11 w-full rounded-lg border border-line px-3 font-normal" /></label>
      <label className="block text-sm font-medium text-navy">Product / SKU<input name="sku" defaultValue={v("sku")} className="mt-1 min-h-11 w-full rounded-lg border border-line px-3 font-normal" /></label>
      <label className="block text-sm font-medium text-navy">Quantity<input name="quantity" type="number" min={1} defaultValue={v("quantity")} className="mt-1 min-h-11 w-full rounded-lg border border-line px-3 font-normal" />{action?.errors?.quantity && <span className="text-red-700">{action.errors.quantity}</span>}</label>
      <label className="block text-sm font-medium text-navy sm:col-span-2">Notes<textarea name="notes" rows={4} defaultValue={v("notes")} className="mt-1 min-h-11 w-full rounded-lg border border-line px-3 py-2 font-normal" /></label>
      <label className="flex items-start gap-2 text-sm text-body sm:col-span-2"><input type="checkbox" name="marketing" className="mt-1 h-5 w-5" />I agree to receive marketing messages about RAWK products (optional, unchecked by default).</label>
      <p className="text-xs text-muted sm:col-span-2">Privacy notice: your details are used only to respond to this enquiry. They are stored privately and are not published on this site.</p>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2"><RawkButton type="submit" disabled={sending} className="px-6">{sending ? "Sending…" : "Submit enquiry"}</RawkButton>
        <RawkButton variant="whatsapp" href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank">WhatsApp fallback</RawkButton></div>
    </Form>
  </div>);
}
