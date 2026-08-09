"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIntroDone } from "@/components/marketing/IntroDoneContext";

/**
 * Ported from kaiketsu-portfolio-v2/components/KaiketsuMonitor.tsx, itself
 * ported from the design handoff (design_handoff_kaiketsu_monitor/monitor-model.js)
 * — procedural geometry + a canvas-driven screen animation, not an imported
 * mesh asset. Runs on @react-three/fiber v9 here (v2 used v8, which only
 * supports React 18; this repo is on React 19).
 */

const COLORS = {
  bg: "#0a0b0a",
  body: "#15170f",
  aluminum: "#3a3c34",
  accent: "#9dff5c",
  text: "#f2f4ef",
  muted: "#6b7166",
};

const CANVAS_W = 1024;
const CANVAS_H = 648;
// The draw canvas is rasterized at this multiple of CANVAS_W/H (all the
// PAD_X/LINE_H/font-size constants below stay in "logical" pixels — drawFrame
// scales the context up before drawing). Text on a canvas-texture plane looks
// soft if the source raster is close to or below the screen's actual on-screen
// pixel size; this supersamples the source so it stays sharp after the GPU
// downsamples it, the same fix as rendering a DOM canvas at devicePixelRatio.
const SUPERSAMPLE = 2;
const PAD_X = 78;
const LINE_H = 62;
const FONT_STACK = "'JetBrains Mono', 'Menlo', 'Consolas', 'Noto Sans JP', 'Hiragino Kaku Gothic Pro', 'Yu Gothic', monospace";
const MONO = `38px ${FONT_STACK}`;
const MONO_TAG = `30px ${FONT_STACK}`;
const SANS_BOLD = "bold 92px 'Arial', 'Helvetica Neue', sans-serif";

const LINES = [
  { symbol: "$ ", body: "whoami", color: COLORS.text },
  { symbol: "> ", body: "kaiketsu_tech", color: COLORS.text },
  { symbol: "$ ", body: "translate --lang ja kaiketsu", color: COLORS.text },
  { symbol: "> ", body: '解決 → "solution"', color: COLORS.accent },
];
const WORDMARK = "KAIKETSU";
const TAGLINE = "解決 — THE SOLUTION CREW";

const TOTAL_CHARS =
  LINES.reduce((sum, l) => sum + l.symbol.length + l.body.length, 0) + WORDMARK.length + TAGLINE.length;
const TYPE_MS = 3200;
const HOLD_MS = 2800;
const BLANK_MS = 350;
const CYCLE_MS = TYPE_MS + HOLD_MS + BLANK_MS;

// Real-world-ish meters, matching the design handoff's dimensions.
const BASE_W = 0.24;
const BASE_D = 0.17;
const BASE_H = 0.014;
const NECK_H = 0.15;
const HINGE_H = 0.03;
const BODY_W = 0.64;
const BODY_H = 0.435;
const BODY_DEPTH = 0.035;
const SCREEN_W = 0.6;
const SCREEN_H = 0.38;
const SCREEN_BOTTOM_MARGIN = 0.035;

const BODY_BOTTOM_Y = BASE_H + NECK_H + HINGE_H;
const BODY_CENTER_Y = BODY_BOTTOM_Y + BODY_H / 2;
const SCREEN_CENTER_Y = BODY_BOTTOM_Y + SCREEN_BOTTOM_MARGIN + SCREEN_H / 2;
const TOTAL_HEIGHT = BODY_BOTTOM_Y + BODY_H;

// Scales the whole (meter-scale) model up to a size that reads well next to
// the hero text at the canvas box size used in app/page.tsx.
const DISPLAY_SCALE = 4;

function drawFrame(ctx: CanvasRenderingContext2D, charsRevealed: number, cursorOn: boolean) {
  ctx.setTransform(SUPERSAMPLE, 0, 0, SUPERSAMPLE, 0, 0);
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textBaseline = "alphabetic";

  let y = 150;
  let remaining = charsRevealed;
  let lastX = PAD_X;
  let lastY = y;

  for (const line of LINES) {
    if (remaining <= 0) break;
    ctx.font = MONO;
    ctx.fillStyle = COLORS.muted;
    const symShown = line.symbol.slice(0, remaining);
    ctx.fillText(symShown, PAD_X, y);
    remaining -= line.symbol.length;
    const x = PAD_X + ctx.measureText(line.symbol).width;
    lastX = x;
    lastY = y;
    if (remaining > 0) {
      const bodyShown = line.body.slice(0, remaining);
      ctx.fillStyle = line.color;
      ctx.fillText(bodyShown, x, y);
      lastX = x + ctx.measureText(bodyShown).width;
      remaining -= line.body.length;
    } else {
      remaining -= line.body.length;
    }
    y += LINE_H;
  }

  if (remaining > 0) {
    y += 70;
    ctx.font = SANS_BOLD;
    ctx.fillStyle = COLORS.text;
    const shown = WORDMARK.slice(0, remaining);
    ctx.fillText(shown, PAD_X, y);
    lastX = PAD_X + ctx.measureText(shown).width;
    lastY = y;
    remaining -= WORDMARK.length;
  } else {
    remaining -= WORDMARK.length;
  }

  if (remaining > 0) {
    y += 62;
    ctx.font = MONO_TAG;
    ctx.fillStyle = COLORS.accent;
    const shown = TAGLINE.slice(0, remaining);
    ctx.fillText(shown, PAD_X, y);
    lastX = PAD_X + ctx.measureText(shown).width;
    lastY = y;
  }

  if (cursorOn) {
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(lastX + 6, lastY - 30, 18, 34);
  }
}

export default function KaiketsuMonitor({ reducedMotion }: { reducedMotion: boolean }) {
  const introDone = useIntroDone();
  const groupRef = useRef<THREE.Group>(null);
  const reveal = useRef(reducedMotion ? 1 : 0.001);
  const staticFrameDrawn = useRef(false);
  const lastCharsRevealed = useRef(-1);
  const lastCursorOn = useRef<boolean | null>(null);

  useEffect(() => {
    // 解決 is drawn on a <canvas>, which only gets CJK glyphs if a
    // CJK-capable font is actually loaded — plain font-family fallback isn't
    // enough for canvas 2D the way it is for DOM text. Noto Sans JP is
    // linked in src/app/globals.css; this just waits for it.
    document.fonts?.load("38px 'Noto Sans JP'").catch(() => {});
    document.fonts?.load("900 92px 'Noto Sans JP'").catch(() => {});
  }, []);

  const canvas = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = CANVAS_W * SUPERSAMPLE;
    c.height = CANVAS_H * SUPERSAMPLE;
    return c;
  }, []);
  const texture = useMemo(() => {
    if (!canvas) return null;
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    // Redrawn only when content changes (see the guard in useFrame below),
    // so mipmaps would be pure overhead — and mipmap generation on the
    // canvas's non-power-of-two height is exactly the kind of thing that
    // silently degrades to a blurrier fallback path. Plain linear sampling
    // over the supersampled source stays sharp without that cost.
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [canvas]);
  useEffect(() => () => texture?.dispose(), [texture]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Reveal: scale in once the intro finishes (or immediately, reduced motion).
    const target = introDone || reducedMotion ? 1 : 0.001;
    reveal.current += (target - reveal.current) * (reducedMotion ? 1 : Math.min(1, delta * 2.2));
    group.scale.setScalar(reveal.current);

    // Screen boot-loop animation. Skipped entirely until the monitor is
    // actually visible (no point burning CPU/GPU drawing to a texture no one
    // can see yet).
    if (!canvas || !texture || (!introDone && !reducedMotion)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (reducedMotion) {
      if (!staticFrameDrawn.current) {
        drawFrame(ctx, TOTAL_CHARS, false);
        texture.needsUpdate = true;
        staticFrameDrawn.current = true;
      }
      return;
    }

    const now = state.clock.elapsedTime * 1000;
    const t = now % CYCLE_MS;
    let charsRevealed: number;
    let cursorOn: boolean;
    if (t < BLANK_MS) {
      charsRevealed = 0;
      cursorOn = false;
    } else if (t < BLANK_MS + TYPE_MS) {
      const p = (t - BLANK_MS) / TYPE_MS;
      charsRevealed = Math.floor(p * TOTAL_CHARS);
      cursorOn = Math.floor(now / 400) % 2 === 0;
    } else {
      charsRevealed = TOTAL_CHARS;
      cursorOn = Math.floor(now / 500) % 2 === 0;
    }

    // Full-canvas redraw + full texture re-upload only happens when the
    // visible content actually changes — not unconditionally every frame.
    if (charsRevealed === lastCharsRevealed.current && cursorOn === lastCursorOn.current) return;
    lastCharsRevealed.current = charsRevealed;
    lastCursorOn.current = cursorOn;
    drawFrame(ctx, charsRevealed, cursorOn);
    texture.needsUpdate = true;
  });

  return (
    <group ref={groupRef} scale={reducedMotion ? 1 : 0.001}>
      <group scale={DISPLAY_SCALE} position={[0, -TOTAL_HEIGHT / 2, 0]}>
        {/* Base */}
        <mesh position={[0, BASE_H / 2, 0]} scale={[1, 1, BASE_D / BASE_W]}>
          <cylinderGeometry args={[BASE_W / 2, (BASE_W / 2) * 1.05, BASE_H, 48]} />
          <meshStandardMaterial color={COLORS.aluminum} roughness={0.35} metalness={0.55} />
        </mesh>

        {/* Stand neck */}
        <mesh position={[0, BASE_H + NECK_H / 2, 0]}>
          <cylinderGeometry args={[0.017, 0.026, NECK_H, 32]} />
          <meshStandardMaterial color={COLORS.aluminum} roughness={0.35} metalness={0.55} />
        </mesh>

        {/* Hinge */}
        <mesh position={[0, BASE_H + NECK_H + HINGE_H / 2, 0]}>
          <boxGeometry args={[0.09, HINGE_H, 0.05]} />
          <meshStandardMaterial color={COLORS.aluminum} roughness={0.35} metalness={0.55} />
        </mesh>

        {/* Body / bezel */}
        <mesh position={[0, BODY_CENTER_Y, 0]}>
          <boxGeometry args={[BODY_W, BODY_H, BODY_DEPTH]} />
          <meshStandardMaterial color={COLORS.body} roughness={0.65} metalness={0.15} />
        </mesh>

        {/* Rear VESA bump */}
        <mesh position={[0, BODY_CENTER_Y, -BODY_DEPTH / 2 - 0.0085]}>
          <boxGeometry args={[0.16, 0.16, 0.018]} />
          <meshStandardMaterial color={COLORS.body} roughness={0.65} metalness={0.15} />
        </mesh>

        {/* Camera notch */}
        <mesh position={[0, BODY_CENTER_Y + BODY_H / 2 - 0.012, BODY_DEPTH / 2 + 0.001]}>
          <boxGeometry args={[0.018, 0.006, 0.004]} />
          <meshStandardMaterial color={COLORS.aluminum} roughness={0.35} metalness={0.55} />
        </mesh>

        {/* Screen — own mesh/material, live canvas texture */}
        {texture && (
          <mesh position={[0, SCREEN_CENTER_Y, BODY_DEPTH / 2 + 0.0006]}>
            <planeGeometry args={[SCREEN_W, SCREEN_H]} />
            <meshStandardMaterial
              color="#050605"
              emissive="#ffffff"
              emissiveMap={texture}
              emissiveIntensity={1}
              map={texture}
              roughness={0.28}
              metalness={0}
              toneMapped={false}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}
