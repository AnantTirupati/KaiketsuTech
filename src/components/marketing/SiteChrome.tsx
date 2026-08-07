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
 * Root layout renders every route through here. The v2 port only covers a
 * specific set of public pages — everything else (dashboard, auth, intern,
 * verify, portfolio, pricing, services, request-project, start-project, and
 * anything not listed below) must keep rendering exactly as it did before
 * this port: TopNavBar + Footer, unchanged, same as the old root layout did
 * unconditionally for every route.
 *
 * A route-group restructuring (moving these page files under an app/(marketing)
 * folder) was the more "idiomatic" way to scope a different layout, but it
 * would have meant physically moving ~12 out-of-scope route folders — a much
 * larger, riskier diff than this one pathname check for a port explicitly
 * scoped to NOT touch those routes.
 */
const MARKETING_ROUTES = new Set(["/", "/about", "/apply", "/careers", "/contact", "/showcase"]);

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketing = MARKETING_ROUTES.has(pathname);

  if (!isMarketing) {
    return (
      <>
        <TopNavBar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </>
    );
  }

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
