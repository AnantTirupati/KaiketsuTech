"use client";

import { usePathname } from "next/navigation";
import TopNavBar from "@/components/shared/TopNavBar";
import Footer from "@/components/shared/Footer";
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
 * Three buckets, checked in order:
 *
 * 1. Marketing routes get the full v2 theme (TerminalIntro, MarketingNav,
 *    MarketingFooter, smooth scroll).
 * 2. Explicitly listed legacy routes — dashboard, auth/*, intern, verify —
 *    keep rendering exactly as before: TopNavBar + Footer, unchanged (both
 *    already self-hide on /auth and /dashboard via their own pathname
 *    checks, so /auth/update-password etc. already render bare today).
 * 3. Anything matching neither renders bare, no chrome added here. This
 *    covers two different cases: real 404s (not-found.tsx supplies its own
 *    complete themed chrome — double-wrapping it here would stack two navs
 *    and two footers), and the login/register/forgot-password/request-project
 *    auth-adjacent pages, which supply their own minimal self-contained
 *    header rather than either nav (request-project used to sit in the
 *    legacy bucket, which put TopNavBar directly behind its own fixed
 *    header — both fixed top-0 z-50, fighting for the same screen space;
 *    this bucket is also the fix for that).
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
]);

// Routes with dynamic sub-paths that should also get the marketing theme —
// e.g. /showcase/[slug] case-study pages. Exact-match the rest above rather
// than prefix-matching everything, so a typo'd or future out-of-scope route
// sharing a prefix (there isn't one today) can't accidentally opt in.
const MARKETING_PREFIXES = ["/showcase/"];

const LEGACY_PREFIXES = ["/auth", "/dashboard", "/intern", "/verify"];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

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

  if (matchesPrefix(pathname, LEGACY_PREFIXES)) {
    return (
      <>
        <TopNavBar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </>
    );
  }

  return <>{children}</>;
}
