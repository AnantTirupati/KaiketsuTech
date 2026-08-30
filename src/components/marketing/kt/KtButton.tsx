"use client";
// React-native replacements for the `.pill` / `.pill-ghost` / `.ghost` CSS
// anchors, matching test-project/src/islands.tsx's `mountButtons()` rule
// exactly: a single call-to-action becomes a RadialRevealButton; a primary +
// secondary pair becomes RadialRevealButton + StarfieldButton; and a
// standalone nav CTA (`.pill-nav`) is always a RadialRevealButton.
import Link from "next/link";
import RadialRevealButton from "@/components/marketing/RadialRevealButton";
import StarfieldButton from "@/components/marketing/StarfieldButton";
import {
  ktPalette,
  ktButtonFont,
  ktButtonPadding,
  KT_EASE_OUT,
  KT_EASE_IN_OUT,
  type KtTheme,
} from "./palette";

type KtLinkButtonProps = {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  label: string;
  theme: KtTheme;
  /** primary = RadialRevealButton (solid, wipes on hover). secondary =
   * StarfieldButton (outlined, animated border light). */
  kind?: "primary" | "secondary";
  /** the hero row runs a slightly larger face than interior CTA rows. */
  big?: boolean;
};

/** A single reveal/starfield button — used for one-off CTAs like `.pill-nav`. */
export function KtLinkButton({ href, onClick, label, theme, kind = "primary", big = false }: KtLinkButtonProps) {
  const p = ktPalette(theme);
  const font = ktButtonFont(big);
  const padding = ktButtonPadding(big);
  if (kind === "secondary") {
    return (
      <StarfieldButton
        label={label}
        link={href}
        onClick={onClick}
        newTab={false}
        font={font}
        padding={padding}
        rounded={100}
        colors={p.starfield.colors}
        border={p.starfield.border}
        glow={p.starfield.glow}
        stroke={p.starfield.stroke}
        pixel={p.starfield.pixel}
        transition={{ type: "tween", ease: KT_EASE_IN_OUT, duration: 0.55 }}
      />
    );
  }
  return (
    <RadialRevealButton
      label={label}
      link={href}
      onClick={onClick}
      newTab={false}
      font={font}
      padding={padding}
      rounded={100}
      colors={p.radial.colors}
      border={p.radial.border}
      transition={{ type: "tween", ease: KT_EASE_OUT, duration: 0.5 }}
    />
  );
}

type Action = { href: string; label: string };

/**
 * Renders a `.actions` (hero) or `.cta-row` (everywhere else) button pair.
 * One action -> RadialRevealButton only. Two -> RadialRevealButton (primary)
 * + StarfieldButton (secondary), exactly like the islands.tsx DOM-mount rule.
 * A trailing `extra` (an arrow link such as "Join us") renders as a plain
 * `.link-arrow`, matching how mountButtons() preserves non-button links.
 */
export function KtActionRow({
  primary,
  secondary,
  extra,
  theme,
  big = false,
  className = "",
}: {
  primary: Action;
  secondary?: Action;
  extra?: Action;
  theme: KtTheme;
  big?: boolean;
  className?: string;
}) {
  return (
    <div className={`${big ? "kt-actions" : "kt-cta-row"} ${className}`.trim()}>
      <KtLinkButton href={primary.href} label={primary.label} theme={theme} kind="primary" big={big} />
      {secondary && <KtLinkButton href={secondary.href} label={secondary.label} theme={theme} kind="secondary" big={big} />}
      {extra && (
        <Link className="kt-link-arrow" href={extra.href}>
          {extra.label}
        </Link>
      )}
    </div>
  );
}

/** The nav/hero-topbar "Start a project" pill — always RadialRevealButton. */
export function KtNavButton({ href, label, theme }: { href: string; label: string; theme: KtTheme }) {
  return <KtLinkButton href={href} label={label} theme={theme} kind="primary" big={false} />;
}
