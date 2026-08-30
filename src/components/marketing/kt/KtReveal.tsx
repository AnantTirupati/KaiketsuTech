"use client";
// Scroll-reveal wrapper matching kt.css's `.kt-rv` / `.kt-rv.kt-in` pair.
// test-project drives this with a hand-rolled IntersectionObserver in
// assets/kt.js (adds `.in`, unobserves, and staggers by
// `(i % 6) * 55ms` via each element's own transitionDelay). This uses
// framer-motion's useInView instead — already a dependency of this app,
// and behaviourally identical (fires once, ~8% pre-trigger margin).
import { createElement, useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { useInView } from "framer-motion";

export function KtReveal({
  children,
  as: Tag = "div",
  className = "",
  index = 0,
  style,
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** stagger index within a group of siblings — mirrors kt.js's `i % 6` cap. */
  index?: number;
  style?: CSSProperties;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08, margin: "0px 0px -8% 0px" });
  // createElement sidesteps the same polymorphic-ref typing issue documented
  // in KineticText.tsx (plain JSX <Tag ref> doesn't type-check under React 19).
  return createElement(
    Tag,
    {
      ref,
      className: `kt-rv${inView ? " kt-in" : ""}${className ? ` ${className}` : ""}`,
      style: { transitionDelay: `${Math.min(index % 6, 5) * 55}ms`, ...style },
      ...rest,
    },
    children,
  );
}
