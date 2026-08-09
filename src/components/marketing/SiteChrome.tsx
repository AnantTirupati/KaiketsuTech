"use client";

import { usePathname } from "next/navigation";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import TopNavBar from "@/components/shared/TopNavBar";
import Footer from "@/components/shared/Footer";
import SmoothScroll from "@/components/marketing/SmoothScroll";
import TerminalIntro from "@/components/marketing/TerminalIntro";
import MarketingNav from "@/components/marketing/MarketingNav";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import PageTransition from "@/components/marketing/PageTransition";

/**
 * Root layout renders every route through here. Three buckets, checked in
 * order:
 *
 * 1. Marketing routes get the full v2 theme (TerminalIntro, MarketingNav,
 *    MarketingFooter, smooth scroll).
 * 2. Explicitly listed legacy routes — authenticated areas (dashboard, auth,
 *    login/register/forgot-password, intern, verify) and /request-project
 *    (its own bespoke chrome-free wizard, by design — see that page) — keep
 *    rendering exactly as before: TopNavBar + Footer, unchanged.
 * 3. Anything matching neither is an actual 404 (not a page we forgot to
 *    theme): usePathname() reflects whatever URL the visitor actually typed,
 *    which can't be enumerated in advance. Rendered bare, no chrome added
 *    here — src/app/not-found.tsx supplies its own complete marketing-themed
 *    chrome, and double-wrapping it in TopNavBar/Footer here would stack two
 *    navs and two footers.
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

const LEGACY_ROUTES = new Set(["/login", "/register", "/forgot-password", "/request-project", "/start-project"]);
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
      <div
        className={`${GeistSans.variable} ${GeistMono.variable} bg-marketing-bg text-marketing-fg font-marketing-sans antialiased`}
      >
        <SmoothScroll />
        <TerminalIntro>
          <MarketingNav />
          <PageTransition>{children}</PageTransition>
          <MarketingFooter />
        </TerminalIntro>
      </div>
    );
  }

  const isLegacy = LEGACY_ROUTES.has(pathname) || matchesPrefix(pathname, LEGACY_PREFIXES);
  if (isLegacy) {
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
