import { Link, isRouteErrorResponse } from "react-router";
export function loader() {
  throw new Response("Not found", { status: 404 });
}
export function ErrorBoundary() {
  return <NotFoundUI />;
}
export default function NotFound() {
  return <NotFoundUI />;
}
function NotFoundUI() {
  return (<div className="mx-auto w-full max-w-[1200px] px-4 py-16 text-center sm:px-8">
    <h1 className="font-serif text-5xl text-navy">Page not found</h1>
    <p className="mx-auto mt-3 max-w-md text-body">That page does not exist or has moved. Try the catalogue, a category, or ask the shop on WhatsApp.</p>
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <Link to="/" className="flex min-h-12 items-center rounded-lg bg-navy px-5 font-semibold text-white">Home</Link>
      <Link to="/products" className="flex min-h-12 items-center rounded-lg border border-navy px-5 font-semibold text-navy">All products</Link>
      <Link to="/contact" className="flex min-h-12 items-center rounded-lg border border-navy px-5 font-semibold text-navy">Contact</Link>
    </div>
  </div>);
}
export function isNotFoundError(e: unknown) { return isRouteErrorResponse(e) && e.status === 404; }
