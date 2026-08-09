"use client";

import { createElement, useRef, type ElementType } from "react";
import { motion, useInView } from "framer-motion";
import { useIntroDone } from "@/components/marketing/IntroDoneContext";

/**
 * Word-level mask reveal: each word sits in an overflow-hidden wrapper and
 * slides up into place, staggered. Dependency-free (no GSAP SplitText) —
 * word-level stagger reads as "kinetic" without character-splitting
 * fragility across line-wraps at different viewport widths.
 *
 * Viewport detection runs on the outer (unclipped) heading, not on the
 * individual word spans: each word's own `initial` position is clipped to
 * zero visible area by its overflow-hidden wrapper (that's the mask), so a
 * word watching its own visibility via `whileInView` can never see itself
 * as "in view" and never fires. Detecting on the heading and driving each
 * word's animation from that shared result avoids the deadlock.
 */
export default function KineticText({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  once = true,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, amount: 0.6 });
  const introDone = useIntroDone();
  const show = inView && introDone;
  const words = text.split(" ");

  // Plain JSX (<Tag ref={ref}>) doesn't type-check for a polymorphic
  // ElementType under React 19's stricter intrinsic-element typing — this
  // worked fine on React 18. createElement sidesteps that narrowing.
  return createElement(
    Tag,
    { ref, className },
    <span key="sr" className="sr-only">
      {text}
    </span>,
    <span key="visual" aria-hidden="true">
      {words.map((word, i) => (
        <span
          key={i}
          className={`inline-block overflow-hidden pb-[0.1em] align-top ${
            i < words.length - 1 ? "mr-[0.28em]" : ""
          }`}
        >
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            animate={show ? { y: "0%" } : { y: "115%" }}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.045,
              ease: [0.22, 0.9, 0.2, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>,
  );
}
