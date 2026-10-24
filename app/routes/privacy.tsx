import type { MetaFunction } from "react-router";
import { canonical } from "../lib/seo";
import { Breadcrumbs } from "../components/Misc";
export const meta: MetaFunction = () => [{ title: "Privacy Policy | RAWK" }, { name: "description", content: "How RAWK handles enquiry details submitted through this website." }, { tagName: "link", rel: "canonical", href: canonical("/privacy") }];
export default function Privacy() {
  return (<div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
    <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Privacy", path: "/privacy" }]} />
    <h1 className="mt-3 font-serif text-4xl text-navy">Privacy Policy</h1>
    <div className="mt-4 max-w-3xl space-y-4 leading-relaxed text-body">
      <p>Enquiry details submitted through the bulk and contact forms (name, phone or email, city, product, quantity and notes) are used only to respond to that enquiry. They are stored privately on the website server and are not published on this site.</p>
      <p>Marketing consent is a separate, optional checkbox, unchecked by default. Giving an enquiry does not by itself subscribe you to marketing messages.</p>
      <p>WhatsApp enquiries open a draft message in WhatsApp; sending is your choice, and that conversation is governed by WhatsApp's own terms. Amazon links open Amazon's site, governed by Amazon's terms.</p>
      <p>No analytics event on this site records names, phone numbers, email addresses, notes or WhatsApp message contents. This policy text is the site's working version and should be reviewed by the business before launch; contact details for privacy requests are on the Contact page.</p>
    </div>
  </div>);
}
