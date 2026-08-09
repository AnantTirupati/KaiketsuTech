"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/marketing/SmoothScroll";
import TerminalIntro from "@/components/marketing/TerminalIntro";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import PageTransition from "@/components/marketing/PageTransition";

/**
 * Root layout renders every route through here. Geist's font CSS variables
 * are registered globally on <body> in layout.tsx (not here) specifically so
 * font-marketing-sans/font-marketing-mono resolve correctly for pages in the
 * bare-passthrough bucket below too, not just the marketing bucket.
 *
 * Two buckets, checked in order:
 *
 * 1. Marketing routes get the full v2 theme (TerminalIntro, MarketingNav,
 *    MarketingFooter, smooth scroll) — includes /verify and /intern/[id]:
 *    both are genuinely public pages (anyone checking a certificate or an
 *    intern's profile, not a logged-in app view), so they get real site nav.
 * 2. Everything else renders bare, no chrome added here. This covers several
 *    different cases, each supplying its own presentation instead of relying
 *    on SiteChrome: real 404s (not-found.tsx has its own complete themed
 *    chrome); login/register/forgot-password/request-project (their own
 *    minimal self-contained AuthShell/header); /dashboard (its own internal
 *    TopAppBar/sidebar, unrelated to either site nav); and /auth/* (no
 *    visible chrome needed at all — just the bare form/redirect content).
 *
 *    The old TopNavBar/Footer components that used to serve this bucket were
 *    deleted once every remaining route stopped needing them (they only ever
 *    rendered visibly outside /auth and /dashboard, and every such route is
 *    now in the marketing bucket or has its own self-contained chrome) —
 *    see git history if a route ever needs that generic nav+footer back.
 *
 * A route-group restructuring (moving these page files under an app/(marketing)
 * folder) was the more "idiomatic" way to scope a different layout, but it
 * would have meant physically moving the out-of-scope route folders too — a
 * much larger, riskier diff than this pathname check.
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
    return (
      <div className="bg-marketing-bg text-marketing-fg font-marketing-sans antialiased">
        <SmoothScroll />
        <TerminalIntro>
          <MarketingNav />
          <PageTransition>{children}</PageTransition>
          <MarketingFooter />
        </TerminalIntro>
      </div>
    );
  }

  return <>{children}</>;
}
