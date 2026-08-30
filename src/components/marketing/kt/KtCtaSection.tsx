import type { ReactNode } from "react";
import { KtReveal } from "./KtReveal";
import { KtActionRow } from "./KtButton";
import type { KtTheme } from "./palette";

/** Shared `.kt-cta` block — every interior page ends with one of these
 * (test-project's `cta_of()`), always the page's single Job-4 "light
 * source". `variant="light"` maps to the source's `.cta.s--light`. */
export function KtCtaSection({
  eyebrow,
  title,
  body,
  primary,
  secondary,
  variant = "light",
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  variant?: KtTheme;
}) {
  return (
    <section className={`kt-cta${variant === "light" ? " kt-s--light" : ""}`}>
      <div className="kt-wrap">
        <div className="kt-cta-in">
          {eyebrow && (
            <KtReveal as="p" className="kt-t-mono kt-eyebrow" style={{ justifyContent: "center" }}>
              {eyebrow}
            </KtReveal>
          )}
          <KtReveal as="h2" index={1} className="kt-t-h1">
            {title}
          </KtReveal>
          {body && (
            <KtReveal as="p" index={2} className="kt-t-body" style={{ marginTop: 18 }}>
              {body}
            </KtReveal>
          )}
          <KtReveal as="div" index={3}>
            <KtActionRow theme={variant} primary={primary} secondary={secondary} />
          </KtReveal>
        </div>
      </div>
    </section>
  );
}
