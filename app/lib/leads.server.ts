import { promises as fs } from "node:fs";
import path from "node:path";
// Server-only. Leads are appended to data/leads.jsonl (NOT under public/),
// one JSON object per line. Email notification is NOT configured: the
// action returns success only after persistence, and records
// notification: "pending — no mail provider configured" so staff know to
// check the file. See README § "Before launch".
export type LeadInput = { name: string; customerType: string; phone: string; email: string; city: string; sku: string; quantity: string; notes: string; marketing: boolean; source: string; token: string };
export function validateLead(d: LeadInput): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!d.name.trim()) errs.name = "Name is required.";
  if (!d.phone.trim() && !d.email.trim()) errs.contact = "Phone or email is required.";
  if (d.phone.trim() && !/^[+0-9][0-9\s-]{7,14}$/.test(d.phone.trim())) errs.phone = "Enter a valid phone number.";
  if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) errs.email = "Enter a valid email address.";
  if (d.quantity.trim() && (!/^\d+$/.test(d.quantity.trim()) || Number(d.quantity) < 1)) errs.quantity = "Quantity must be a whole number of 1 or more.";
  return errs;
}
export async function saveLead(d: LeadInput): Promise<{ ok: boolean; id?: string; duplicate?: boolean; error?: string }> {
  try {
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, "leads.jsonl");
    let existing = "";
    try { existing = await fs.readFile(file, "utf8"); } catch { /* first lead */ }
    if (d.token && existing.includes(`"token":"${d.token}"`)) return { ok: true, duplicate: true };
    const record = { id: `lead-${Date.now()}`, timestamp: new Date().toISOString(), notification: "pending — no mail provider configured", ...d };
    await fs.appendFile(file, JSON.stringify(record) + "\n", "utf8");
    return { ok: true, id: record.id };
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Could not save the enquiry." }; }
}
export function formLead(form: FormData, source: string): LeadInput {
  const s = (k: string) => String(form.get(k) ?? "");
  return { name: s("name"), customerType: s("customerType"), phone: s("phone"), email: s("email"), city: s("city"), sku: s("sku"), quantity: s("quantity"), notes: s("notes"), marketing: form.get("marketing") === "on", source, token: s("token") };
}
