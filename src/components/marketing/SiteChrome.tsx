"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/marketing/SmoothScroll";
import { KtHeroTopbar } from "@/components/marketing/kt/KtHeroTopbar";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import PageTransition from "@/components/marketing/PageTransition";

/**
 * Root layout renders every route through here.
 *
 * Two buckets, checked in order:
 *
 * 1. Marketing routes get the v2 redesign's monochrome theme (KtHeroTopbar,
 *    MarketingFooter, `.kt-root` design-system scope, smooth scroll) —
 *    includes /verify and /intern/[id]: both are genuinely public pages
 *    (anyone checking a certificate or an intern's profile, not a logged-in
 *    app view), so they get real site nav.
 * 2. Everything else renders bare, no chrome added here. This covers several
 *    different cases, each supplying its own presentation instead of relying
 *    on SiteChrome: real 404s (not-found.tsx renders MarketingNav/Footer
 *    directly, so it also picks up the v2 redesign automatically);
 *    login/register/forgot-password/request-project (their own minimal
 *    self-contained AuthShell/header); /dashboard (its own internal
 *    TopAppBar/sidebar, unrelated to either site nav); and /auth/* (no
 *    visible chrome needed at all — just the bare form/redirect content).
 *
 * v2 migration note: the pre-redesign TerminalIntro boot sequence and the
 * three.js ResolveScene "monitor" no longer render here — the redesign this
 * chrome now serves has no boot animation, and the new home page (page.tsx)
 * uses a plain video hero instead of the 3D scene. Both components are left
 * in place (src/components/marketing/TerminalIntro.tsx,
 * ResolveScene(Client).tsx, KaiketsuMonitor.tsx) rather than deleted, in case
 * a future redesign wants them back, but nothing currently imports them.
 *
 * A route-group restructuring (moving these page files under an
 * app/(marketing) folder) was the more "idiomatic" way to scope a different
 * layout, but it would have meant physically moving the out-of-scope route
 * folders too — a much larger, riskier diff than this pathname check.
 */
const MARKETING_ROUTES = new Set([
  "/",
  "/about",
  "/apply",
  "/careers",
  "/contact",
  "/showcase",
  "/services",
  "/portfolio",
  "/pricing",
  "/verify",
]);

// Routes with dynamic sub-paths that should also get the marketing theme —
// e.g. /showcase/[slug] case-study pages, /verify/[certificateId] results,
// /intern/[internId] public profiles. Exact-match the rest above rather than
// prefix-matching everything, so a typo'd or future out-of-scope route
// sharing a prefix (there isn't one today) can't accidentally opt in.
const MARKETING_PREFIXES = ["/showcase/", "/verify/", "/intern/"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isMarketing =
    MARKETING_ROUTES.has(pathname) || MARKETING_PREFIXES.some((p) => pathname.startsWith(p));
  if (isMarketing) {
    // The home page is the one exception to "MarketingNav sits above every
    // marketing page": test-project's index.html gives the hero its own
    // bespoke `.kt-topbar` (part of the hero's golden-ratio layout, with a
    // brand mark that only fades in once you scroll past the kanji) instead
    // of reusing the shared interior `.kt-sitebar`. page.tsx renders that
    // topbar itself as part of its hero section, so it's skipped here to
    // avoid stacking two navs.
    const isHome = pathname === "/";
    return (
      <div className="kt-root">
        <SmoothScroll />
        {!isHome && <KtHeroTopbar />}
        <PageTransition>{children}</PageTransition>
        <MarketingFooter />
      </div>
    );
  }

  return <>{children}</>;
}
