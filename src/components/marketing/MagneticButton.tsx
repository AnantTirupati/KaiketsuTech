"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Subtle magnetic-hover CTA — the button drifts a few px toward the cursor.
 */
export default function MagneticButton({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPos({ x, y });
  };

  const base =
    "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold transition-colors";
  const styles =
    variant === "solid"
      ? "bg-marketing-accent text-marketing-accent-ink hover:bg-marketing-fg"
      : "border border-marketing-border-strong text-marketing-fg hover:border-marketing-accent hover:text-marketing-accent";

  return (
    <motion.div
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.2 }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      className="inline-block"
    >
      <Link href={href} ref={ref} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    </motion.div>
  );
}
