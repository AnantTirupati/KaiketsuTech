"use client";
// KtReveal, applied to a next/link anchor.
//
// This has to be its own client component rather than the page just writing
// `<KtReveal as={Link} href="…">` inline: several of the pages that render
// this (Home, Services, Showcase index/detail) are Server Components, and
// passing the `Link` component itself as the `as` prop across the server →
// client boundary isn't allowed — Next can serialize a rendered element as
// `children`, but not a bare component reference as a prop value (it fails
// at build/export time with "Functions cannot be passed directly to Client
// Components"). Keeping the `Link` reference entirely inside this
// client-only file avoids the boundary crossing.
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { KtReveal } from "./KtReveal";

export function KtRevealLink({
  href,
  index = 0,
  className = "",
  style,
  children,
}: {
  href: string;
  index?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <KtReveal as={Link} href={href} index={index} className={className} style={style}>
      {children}
    </KtReveal>
  );
}
