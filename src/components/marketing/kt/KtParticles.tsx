"use client";
// Ports test-project/src/islands.tsx's `mountParticleOver()` /
// `mountParticles()` — a canvas particle field overlaid on text that must
// stay real in the DOM for layout + screen readers. The original reads the
// element's *computed* font (family/size/letter-spacing) at runtime because
// both mount points use the fluid clamp() type scale; this does the same via
// a ref + effect instead of DOM querying, and waits on `document.fonts.ready`
// exactly like the original (mounting before Manrope loads bakes in the
// fallback face's letterforms permanently, since ParticleText samples glyph
// shapes from a canvas render).
import { useEffect, useRef, useState } from "react";
import ParticleText from "@/components/marketing/ParticleText";
import type { KtTheme } from "./palette";

function useComputedFont(ref: React.RefObject<HTMLElement | null>) {
  const [font, setFont] = useState<{ fontSize: number; fontFamily: string; letterSpacing: string } | null>(null);
  useEffect(() => {
    let cancelled = false;
    const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const read = async () => {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
      } catch {
        /* no Font Loading API: sample whatever is resolved */
      }
      if (cancelled || !ref.current) return;
      const cs = getComputedStyle(ref.current);
      setFont({ fontSize: parseFloat(cs.fontSize), fontFamily: cs.fontFamily, letterSpacing: cs.letterSpacing });
    };
    read();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return font;
}

/** Overlay for the hero's "That's the job." second headline line. */
export function HeadlineParticles({ text, theme }: { text: string; theme: KtTheme }) {
  const ref = useRef<HTMLSpanElement>(null);
  const font = useComputedFont(ref);
  const ink = theme === "light" ? "#050505" : "#fafafa";
  const soft = theme === "light" ? "rgba(5,5,5,.55)" : "rgba(250,250,250,.55)";
  return (
    <span ref={ref} className="kt-headline-line" style={{ position: "relative" }}>
      <span style={{ visibility: font ? "hidden" : "visible" }}>{text}</span>
      {font && (
        <span aria-hidden="true" style={{ position: "absolute", inset: "-10%", pointerEvents: "auto" }}>
          <ParticleText
            text={text}
            colors={[ink, soft, ink]}
            mode="onEnter"
            replay
            position="middle"
            particleSize={4}
            particleCount={150}
            mouseEnabled
            mouseRadius={70}
            mouseForce={26}
            fontSize={font.fontSize}
            autoFit={false}
            fontFamily={font.fontFamily}
            fontWeight={500}
            letterSpacing={font.letterSpacing}
            transition={{ type: "tween", duration: 1.1, ease: "easeOut" }}
            style={{ minWidth: 0, minHeight: 0 }}
          />
        </span>
      )}
    </span>
  );
}

/** Overlay for the footer's giant "KAIKETSU_TECH" halftone wordmark. */
export function WordmarkParticles({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const font = useComputedFont(ref);
  return (
    <div className="kt-foot-wordmark" aria-hidden="true" style={{ position: "relative" }}>
      {/* `.kt-foot-wordmark span` is what carries the giant halftone-text
          styling (kt.css) — this real text is both the CSS fallback (no JS /
          reduced motion) and the box the particle overlay below is sized to. */}
      <span ref={ref} style={{ visibility: font ? "hidden" : "visible" }}>
        {text}
      </span>
      {font && (
        <span style={{ position: "absolute", inset: "-6% -2%" }}>
          <ParticleText
            text={text}
            colors={["#fafafa", "rgba(250,250,250,.5)", "rgba(250,250,250,.75)"]}
            mode="onEnter"
            replay={false}
            position="middle"
            particleSize={9}
            particleCount={44}
            mouseEnabled
            mouseRadius={90}
            mouseForce={30}
            fontSize={font.fontSize}
            autoFit={false}
            fontFamily={font.fontFamily}
            fontWeight={800}
            letterSpacing={font.letterSpacing}
            transition={{ type: "tween", duration: 1.3, ease: "easeOut" }}
            style={{ minWidth: 0, minHeight: 0 }}
          />
        </span>
      )}
    </div>
  );
}
