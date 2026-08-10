"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

/**
 * Ported from kaiketsu-portfolio-v2/components/Nav.tsx — same visual design
 * and link labels (e.g. "Work" for what's technically the /showcase route).
 * Two adaptations beyond v2: the link set covers KaiketsuTech's real public
 * pages (v2 only ever had 4), and the CTA is auth-aware — v2 had no auth, but
 * a logged-in visitor browsing these pages shouldn't lose their way back to
 * the dashboard the way the old TopNavBar let them.
 */

const links = [
  { href: "/showcase", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/verify", label: "Verify" },
  { href: "/contact", label: "Contact" },
];

export default function MarketingNav() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [dashboardHref, setDashboardHref] = useState("/dashboard/client");

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const applySession = (userId: string | undefined, metaRole: string | undefined) => {
      if (!active) return;
      setSignedIn(!!userId);
      if (userId) {
        if (metaRole) {
          setDashboardHref(`/dashboard/${metaRole}`);
        } else {
          supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single()
            .then(({ data }) => {
              if (active && data?.role) setDashboardHref(`/dashboard/${data.role}`);
            });
        }
      }
    };

    supabase.auth.getUser().then(({ data }) => {
      applySession(data.user?.id, data.user?.user_metadata?.role);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user?.id, session?.user?.user_metadata?.role);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-marketing-border bg-marketing-bg/85 px-[6vw] py-5 backdrop-blur-md">
        <Link
          href="/"
          className="font-marketing-mono text-sm font-bold tracking-tight text-marketing-fg"
          onClick={() => setOpen(false)}
        >
          KAIKETSU<span className="text-marketing-accent">_</span>TECH
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-marketing-muted md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-marketing-accent">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href={signedIn ? dashboardHref : "/login?redirect=/request-project"}
            className="rounded-full bg-marketing-accent px-5 py-2 text-sm font-semibold text-marketing-accent-ink transition-colors hover:bg-marketing-fg"
          >
            {signedIn ? "Dashboard" : "Start a project"}
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span className="h-px w-6 bg-marketing-fg" />
          <span className="h-px w-6 bg-marketing-fg" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[65px] z-20 w-full overflow-hidden border-b border-marketing-border bg-marketing-bg md:hidden"
          >
            <nav className="flex flex-col gap-1 px-[6vw] py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-marketing-border py-3 text-lg text-marketing-fg"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href={signedIn ? dashboardHref : "/login?redirect=/request-project"}
                onClick={() => setOpen(false)}
                className="py-3 text-lg text-marketing-accent"
              >
                {signedIn ? "Dashboard" : "Start a project"} →
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
