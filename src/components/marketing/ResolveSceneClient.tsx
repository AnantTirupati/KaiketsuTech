"use client";

import dynamic from "next/dynamic";

/**
 * next/dynamic's `ssr: false` can't be called from a Server Component in the
 * App Router — this tiny client wrapper is the standard workaround so the
 * home page (a server component) can still render the scene without pulling
 * three.js/@react-three/fiber into the server bundle or trying to run WebGL
 * during SSR.
 */
const ResolveScene = dynamic(() => import("@/components/marketing/ResolveScene"), {
  ssr: false,
  loading: () => null,
});

export default function ResolveSceneClient() {
  return (
    <div className="h-full w-full" aria-hidden="true">
      <ResolveScene />
    </div>
  );
}
