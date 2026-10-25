import type { ReactNode } from "react";
import { Link } from "react-router";

/**
 * Shared RAWK button — the ONLY button style used across the site.
 *
 * - `to` renders an internal <Link>, `href` renders an <a>, otherwise a <button>.
 * - variant "primary" is the default design (charcoal, ivory text) — the same
 *   design used in the navigation mega menu and the footer.
 * - variant "custom" applies NO shared styling at all: the caller-supplied
 *   className is used exactly as passed, for one-off designs only.
 * - Hover: primary/secondary/on-dark buttons shift contrast, lift 1px and
 *   gain a soft shadow; the transition is 300ms and is disabled entirely
 *   under prefers-reduced-motion (see app.css).
 */
export type RawkButtonVariant =
  | "primary"
  | "secondary"
  | "onDark"
  | "onDarkSecondary"
  | "whatsapp"
  | "custom";

export type RawkButtonProps = {
  variant?: RawkButtonVariant;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  arrow?: boolean;
  /** Show the uploaded WhatsApp logo before the label (WhatsApp actions). */
  whatsappIcon?: boolean;
  children: ReactNode;
};

// Navigation / buttons use Lato Bold 700 (font table).
const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded px-5 text-sm font-bold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass disabled:opacity-50";

const VARIANTS: Record<Exclude<RawkButtonVariant, "custom">, string> = {
  // Charcoal button, ivory text — the shared default (header, mega menu, footer).
  primary:
    "bg-navy text-white hover:-translate-y-px hover:bg-[#33312e] hover:shadow-md active:translate-y-0",
  // Transparent, charcoal border/text — flips to charcoal on hover.
  secondary:
    "border border-navy bg-transparent text-navy hover:-translate-y-px hover:bg-navy hover:text-white hover:shadow-md active:translate-y-0",
  // Ivory fill on a dark surface (bulk banner, footer final row).
  onDark:
    "bg-white text-navy hover:-translate-y-px hover:bg-ivory hover:shadow-md active:translate-y-0",
  // Ivory outline on a dark surface.
  onDarkSecondary:
    "border border-white/60 bg-transparent text-white hover:-translate-y-px hover:bg-white hover:text-navy hover:shadow-md active:translate-y-0",
  // WhatsApp Enquiry: green background, white text, WhatsApp logo
  // (see whatsappIcon). Used for every WhatsApp action site-wide.
  whatsapp:
    "bg-wa text-white hover:-translate-y-px hover:brightness-110 hover:shadow-md active:translate-y-0",
};

export default function RawkButton({
  variant = "primary",
  to,
  href,
  target,
  rel,
  type = "button",
  disabled,
  onClick,
  className = "",
  ariaLabel,
  arrow = false,
  whatsappIcon = false,
  children,
}: RawkButtonProps) {
  const classes =
    variant === "custom" ? className : `${BASE} ${VARIANTS[variant]} ${className}`.trim();
  const content = (
    <>
      {whatsappIcon && (
        <img src="/icons/whatsapp-symbol-logo.svg" alt="" aria-hidden="true" width={20} height={20} className="h-5 w-5 shrink-0" />
      )}
      {children}
      {arrow && (
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
          →
        </span>
      )}
    </>
  );
  if (to) {
    // prefetch="intent": hover/focus prefetches the route, so navigation
    // switching feels instant instead of waiting for a fresh fetch.
    return (
      <Link to={to} prefetch="intent" aria-label={ariaLabel} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noreferrer" : undefined)}
        aria-label={ariaLabel}
        className={classes}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }
  return (
    <button type={type} disabled={disabled} aria-label={ariaLabel} className={classes} onClick={onClick}>
      {content}
    </button>
  );
}
