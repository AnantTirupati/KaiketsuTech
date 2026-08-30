// Shared palette/typography helpers for the v2 marketing redesign's button
// islands (RadialRevealButton / StarfieldButton). Ported from
// test-project/src/islands.tsx's `palette()`, `buttonFont()` and
// `buttonPadding()` — the DOM `.closest(".s--light")` lookup there becomes an
// explicit `theme` prop here, since every call site in the Next.js port
// already knows which surface (`<KtSection variant>`) it is rendering inside.
import type { CSSProperties } from "react";

export type KtTheme = "dark" | "light";

const INK = "#fafafa";
const VOID = "#050505";

export function ktPalette(theme: KtTheme) {
  const light = theme === "light";
  const fg = light ? VOID : INK; // the surface's text colour
  const bg = light ? INK : VOID; // the surface itself
  return {
    fg,
    bg,
    // primary: a solid chip of the ink, wiping to the page colour on hover
    radial: {
      colors: { fill: fg, textColor: bg, hoverFill: bg, hoverTextColor: fg },
      border: { borderWidth: 1, borderStyle: "solid", borderColor: fg },
    },
    // secondary: the page colour, with the light running its border
    starfield: {
      colors: { fill: bg, textColor: fg },
      border: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: light ? "rgba(5,5,5,.22)" : "rgba(250,250,250,.22)",
      },
      glow: { size: 14, color: fg, opacity: 55 },
      stroke: {
        size: 72,
        color: fg,
        count: 1,
        speed: 46,
        thickness: 2,
        direction: "ccw" as const,
        movement: "continuous" as const,
      },
      pixel: { size: 4, color: fg, density: 45, brightness: 60 },
    },
  };
}

/** Match the CSS `.pill` this replaces, so the row's rhythm does not shift. */
export function ktButtonFont(big: boolean): CSSProperties {
  return {
    fontFamily: "Manrope, system-ui, sans-serif",
    fontWeight: 500,
    fontSize: big ? 16 : 15,
    lineHeight: "1em",
    letterSpacing: "0em",
    textAlign: "left",
  };
}

export function ktButtonPadding(big: boolean) {
  return big ? "16px 30px" : "14px 26px";
}

export const KT_EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const KT_EASE_IN_OUT: [number, number, number, number] = [0.44, 0, 0.56, 1];
