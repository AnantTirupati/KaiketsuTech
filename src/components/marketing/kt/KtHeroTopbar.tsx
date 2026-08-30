"use client";
// The home page's bespoke `.kt-topbar` — test-project gives index.html its
// own nav treatment (absolutely positioned within the hero's golden-ratio
// grid, brand mark on a hover gloss) instead of reusing the interior
// `.kt-sitebar` that every other marketing page shares (see MarketingNav).
// Mobile burger/menu markup and behaviour are identical to MarketingNav's —
// duplicated here rather than shared because the two navs render inside very
// different layout contexts (fixed hero overlay vs sticky document flow).
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KtNavButton } from "@/components/marketing/kt/KtButton";

const links = [
  { href: "/showcase", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/verify", label: "Verify" },
];

export function KtHeroTopbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("kt-is-open", open);
    return () => document.body.classList.remove("kt-is-open");
  }, [open]);

  return (
    <div className={open ? "kt-is-open" : ""}>
      <header className="kt-topbar">
        <Link className="kt-brand" href="/" aria-label="KaiketsuTech home">
          <span className="kt-jp" lang="ja" tabIndex={0} title="Kaiketsu (解決) — solution">
            解決
            <span className="kt-jp-gloss" aria-hidden="true">
              <i />
              <b>Kaiketsu &middot; Solution</b>
            </span>
          </span>
          <span className="kt-accent">_</span>TECH
        </Link>
        <nav className="kt-links" aria-label="Primary">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="kt-pill-nav">
          <KtNavButton href="/contact" label="Start a project" theme="dark" />
        </div>
        <button
          className="kt-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <i />
          <i />
        </button>
      </header>

      <nav className="kt-menu" aria-hidden={!open}>
        <div className="kt-menu-inner">
          <p className="kt-menu-eyebrow">Menu</p>
          <ul className="kt-menu-list">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="kt-menu-foot">
            <Link className="kt-pill" href="/contact" onClick={() => setOpen(false)}>
              Start a project
            </Link>
            <Link className="kt-ghost-menu" href="/showcase" onClick={() => setOpen(false)}>
              See the work
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
