"use client";
// Every `.grid-4/.grid-3/.grid-2 .cell` card gets wrapped in a non-interactive
// StarfieldButton (`as="article"`) for the animated hover glow/scanning-light
// effect — ported from islands.tsx's grid-card mounting, which takes the
// cell's rendered content and re-hosts it inside a StarfieldButton shell.
// Here that's just normal JSX children instead of dangerouslySetInnerHTML.
import type { ReactNode } from "react";
import StarfieldButton from "@/components/marketing/StarfieldButton";
import { ktPalette, KT_EASE_IN_OUT, type KtTheme } from "./palette";

export function KtCell({ theme, children, className = "" }: { theme: KtTheme; children: ReactNode; className?: string }) {
  const p = ktPalette(theme);
  // The grid's own 1px hairlines (background:var(--line) behind gap:1px
  // cells) draw the borders — the button shouldn't also draw its own.
  const border = { ...p.starfield.border, borderWidth: 0 };
  return (
    <StarfieldButton
      as="article"
      addIcon={false}
      showText={false}
      padding="clamp(24px, 2.6vw, 42px)"
      colors={p.starfield.colors}
      border={border}
      glow={p.starfield.glow}
      stroke={p.starfield.stroke}
      pixel={p.starfield.pixel}
      transition={{ type: "tween", ease: KT_EASE_IN_OUT, duration: 0.55 }}
      style={{ width: "100%", height: "100%" }}
      rounded={0}
    >
      <div className={`kt-cell-inner ${className}`.trim()} style={{ display: "flex", flexDirection: "column", height: "100%", gap: 14, width: "100%" }}>
        {children}
      </div>
    </StarfieldButton>
  );
}
