import type { ReactNode } from "react";
import { Link } from "react-router";

/**
 * Shared RAWK button — the ONLY button style used across the site.
 *
 * - `to` renders an internal <Link>, `href` renders an <a>, otherwise a <button>.
 * - Uniform button system (user rule 2026-10-25): every button is
 *   font-semibold (600) and rounded-full.
 * - Light background (primary/secondary): solid charcoal bg + white text;
 *   hover = transparent bg + charcoal border + charcoal text.
 * - Dark background (onDark/onDarkSecondary): solid white bg + charcoal
 *   text; hover = transparent bg + white border + white text.
 * - WhatsApp keeps its green brand colour but follows the same pattern:
 *   solid green + white text; hover = transparent + green border/text.
 * - variant "custom" applies NO shared styling at all: the caller-supplied
 *   className is used exactly as passed, for one-off designs only.
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
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass disabled:opacity-50";

const VARIANTS: Record<Exclude<RawkButtonVariant, "custom">, string> = {
  // Charcoal button, ivory text — the shared default (header, mega menu, footer).
  primary:
    "border border-navy bg-navy text-white hover:bg-transparent hover:text-navy",
  // Transparent, charcoal border/text — flips to charcoal on hover.
  secondary:
    "border border-navy bg-navy text-white hover:bg-transparent hover:text-navy",
  // Ivory fill on a dark surface (bulk banner, footer final row).
  onDark:
    "border border-white bg-white text-navy hover:bg-transparent hover:text-white",
  // Ivory outline on a dark surface.
  onDarkSecondary:
    "border border-white bg-white text-navy hover:bg-transparent hover:text-white",
  // WhatsApp Enquiry: green background, white text, WhatsApp logo
  // (see whatsappIcon). Used for every WhatsApp action site-wide.
  whatsapp:
    "border border-wa bg-wa text-white hover:bg-transparent hover:text-wa",
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
