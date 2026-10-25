import { Links, Meta, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from "react-router";
import "./app.css";
import SiteLayout from "./components/Chrome";
import RawkButton from "./components/RawkButton";
export function meta() {
  return [{ title: "RAWK — Hardware by Vinayak Enterprise" }, { name: "description", content: "RAWK hardware catalogue: handles, knobs, locks, hinges, drain jali and drain pipes from Vinayak Enterprises, Gwalior. Enquire on WhatsApp." }];
}
export function Layout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
    <Meta /><Links /></head><body>{children}<ScrollRestoration /><Scripts /></body></html>);
}
export default function Root() { return <SiteLayout />; }

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-16 text-center sm:px-8">
      <h1 className="font-serif text-5xl text-navy">{notFound ? "Page not found" : "Something went wrong"}</h1>
      <p className="mx-auto mt-3 max-w-md text-body">{notFound ? "That page does not exist or has moved." : "Please try again, or contact the shop on WhatsApp."}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <RawkButton to="/">Home</RawkButton>
        <RawkButton to="/products" variant="secondary">All products</RawkButton>
      </div>
    </div>
  );
}
