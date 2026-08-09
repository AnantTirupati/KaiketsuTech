"use client";

import { createContext, useContext } from "react";

// Default true: pages other than the very first cold load of "/" never see
// TerminalIntro playing, so their Reveal/KineticText content should animate
// on normal viewport entry with no artificial gate.
export const IntroDoneContext = createContext(true);

export function useIntroDone() {
  return useContext(IntroDoneContext);
}
