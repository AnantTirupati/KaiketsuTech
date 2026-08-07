"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import KaiketsuMonitor from "@/components/marketing/KaiketsuMonitor";

/**
 * Hero centerpiece: the Kaiketsu monitor (see KaiketsuMonitor.tsx) sitting
 * in a small lit scene, static aside from its reveal-in and screen boot-loop
 * animation. This file is just the stage (camera + lights).
 */
export default function ResolveScene() {
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 40 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.75]}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <pointLight position={[-3, -1, -2]} intensity={0.35} color="#9dff5c" />
      <KaiketsuMonitor reducedMotion={reducedMotion} />
    </Canvas>
  );
}
