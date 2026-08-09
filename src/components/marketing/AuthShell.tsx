import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared minimal shell for login/register/forgot-password/update-password.
 * Deliberately not wrapped in MarketingNav/TerminalIntro (see SiteChrome —
 * these routes render bare) or the old TopNavBar (login/register used to
 * need it for its 80px offset; that assumption goes away once every auth
 * page uses this same self-contained header instead). A focused auth flow
 * shouldn't have a full site nav pulling attention away from the one task.
 */
export default function AuthShell({ children, eyebrow }: { children: ReactNode; eyebrow?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-marketing-bg px-[6vw] py-16 font-marketing-sans text-marketing-fg antialiased">
      <Link
        href="/"
        className="mb-10 font-marketing-mono text-sm font-bold tracking-tight text-marketing-fg transition-colors hover:text-marketing-accent"
      >
        KAIKETSU<span className="text-marketing-accent">_</span>TECH
      </Link>
      {eyebrow && (
        <div className="mb-6 max-w-md text-center font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-muted-dim">
          {eyebrow}
        </div>
      )}
      {children}
    </div>
  );
}
