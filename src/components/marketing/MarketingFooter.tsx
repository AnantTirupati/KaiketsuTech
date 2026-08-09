import Link from "next/link";

/**
 * Ported from kaiketsu-portfolio-v2/components/Footer.tsx — same "Let's
 * build." block and layout. Adapted with the real social links already used
 * by src/components/shared/Footer.tsx (v2's GitHub/LinkedIn were `href="#"`
 * placeholders) and a fuller nav list covering KaiketsuTech's actual public
 * pages instead of v2's narrower 4-link set.
 */

const navLinks = [
  { href: "/showcase", label: "Work" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/verify", label: "Verify" },
  { href: "/contact", label: "Contact" },
];

export default function MarketingFooter() {
  return (
    <footer className="border-t border-marketing-border px-[6vw] py-10">
      <div className="mb-10 font-marketing-sans text-[clamp(28px,5vw,48px)] font-bold leading-none text-marketing-fg">
        Let&rsquo;s build<span className="text-marketing-accent">.</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-marketing-muted-dim">
        <div className="font-marketing-mono">KaiketsuTech © {new Date().getFullYear()}</div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-marketing-accent">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/company/kaiketsutech/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-marketing-accent"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/kaiketsutech/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-marketing-accent"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
