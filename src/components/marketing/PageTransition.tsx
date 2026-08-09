"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fades the new page in on mount; the old page just unmounts normally (how
 * Next's App Router already works). An earlier version tried to keep the
 * outgoing page mounted via AnimatePresence + a frozen-router-context hack
 * so it could exit-animate — that leaked stale DOM on every navigation and
 * eventually got stuck showing frozen content, because the App Router
 * doesn't give a stable enough children reference for that overlap to be
 * reliable. Simple beats broken.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 0.9, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
