"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { KtLinkButton } from "@/components/marketing/kt/KtButton";

const NAV_LINKS = [
  { name: "ABOUT", href: "/about" },
  { name: "SERVICES", href: "/services" },
  { name: "PRICING", href: "/pricing" },
  { name: "CAREERS", href: "/careers" },
  { name: "VERIFY", href: "/verify" },
];

const FOOTER_COLS = [
  {
    title: "AGENCY",
    links: [
      { name: "Our Story", href: "/about" },
      { name: "Leadership Team", href: "/about" },
      { name: "Press Room", href: "#" },
      { name: "We Hire", href: "/careers" },
      { name: "Alliance", href: "#" },
      { name: "Blog", href: "#" },
    ],
  },
  {
    title: "SERVICES",
    links: [
      { name: "Websites", href: "/services" },
      { name: "MVP Development", href: "/services" },
      { name: "AI Solutions", href: "/services" },
      { name: "DataOps", href: "/services" },
      { name: "DevOps", href: "/services" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { name: "Pricing", href: "/pricing" },
      { name: "Verify Certificate", href: "/verify" },
      { name: "Showcase", href: "/showcase" },
      { name: "FAQs", href: "#" },
    ],
  },
  {
    title: "HELP US",
    links: [
      { name: "Open a Ticket", href: "/contact" },
      { name: "Contact Sales", href: "/contact" },
      { name: "Docs", href: "#" },
      { name: "Tutorials", href: "#" },
      { name: "Forum", href: "#" },
    ],
  },
];

export default function NotFoundClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      setMenuVisible(true);
    } else {
      setMenuVisible(false);
    }
  }, [mobileMenuOpen]);

  const closeMenu = () => {
    setMenuVisible(false);
    setTimeout(() => setMobileMenuOpen(false), 500);
  };

  const handleMenuToggle = () => {
    if (mobileMenuOpen) {
      closeMenu();
    } else {
      setMobileMenuOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-black">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4"
      />

      <style dangerouslySetInnerHTML={{__html: `
        .four-oh-four {
          text-shadow: 0 0 80px rgba(255,255,255,0.3), 0 0 160px rgba(255,255,255,0.1);
        }
        .liquid-glass {
          background: rgba(255, 255, 255, 0.01);
          background-blend-mode: luminosity;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: none;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        .liquid-glass::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.4px;
          background: linear-gradient(180deg,
            rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
            rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
            rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}} />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-wider">KAIKETSUTECH</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Login Button */}
          <div className="hidden lg:flex items-center">
            <KtLinkButton href="/contact" label="Start a project" theme="dark" kind="primary" />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={handleMenuToggle}
            className="lg:hidden relative z-[60] p-2 flex items-center justify-center text-white"
            aria-label="Toggle Menu"
          >
            <Menu className={`absolute w-6 h-6 transition-all duration-300 ${menuVisible ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
            <X className={`absolute w-6 h-6 transition-all duration-300 ${menuVisible ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-md transition-opacity duration-400 ${menuVisible ? 'opacity-100' : 'opacity-0'}`}
              onClick={closeMenu}
            />

            {/* Menu Panel */}
            <div className="absolute left-0 right-0 top-[68px] z-50 overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-xl rounded-b-2xl" />
              <div className="relative z-10 flex flex-col items-center py-8 px-6 gap-6">
                {NAV_LINKS.map((link, index) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMenu}
                    className={`text-lg sm:text-xl font-light tracking-[0.08em] text-white/80 hover:text-white transition-all duration-400 ease-out ${menuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
                    style={{ transitionDelay: menuVisible ? `${350 + index * 50}ms` : '0ms' }}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div
                  className={`mt-4 flex items-center transition-all duration-400 ease-out ${menuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
                  style={{ transitionDelay: menuVisible ? `${350 + NAV_LINKS.length * 50}ms` : '0ms' }}
                >
                  <div onClick={closeMenu}>
                    <KtLinkButton href="/contact" label="Start a project" theme="dark" kind="primary" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Hero / 404 Section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-16 md:py-0">
          <h1 className="text-white/80 text-lg sm:text-2xl md:text-3xl lg:text-5xl font-light leading-snug tracking-tight mb-1 sm:mb-2">
            This page seems to have
          </h1>
          <h1 className="text-white/80 text-lg sm:text-2xl md:text-3xl lg:text-5xl font-light leading-snug tracking-tight mb-8 sm:mb-12">
            slipped beyond our reach :/
          </h1>

          <div className="relative mb-8 sm:mb-12 w-full flex justify-center overflow-visible">
            <span className="four-oh-four text-[80px] sm:text-[100px] md:text-[140px] lg:text-[200px] xl:text-[260px] font-black text-white leading-none tracking-tighter select-none">
              404
            </span>
          </div>

          <div className="mt-8 flex justify-center">
            <KtLinkButton href="/" label="Return to Main Page" theme="dark" kind="primary" />
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-16 pb-8 sm:pb-10 pt-10 sm:pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-6">
            
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h4 className="text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mb-3 sm:mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2 sm:space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-white/50 hover:text-white/80 text-[10px] sm:text-xs transition-colors duration-200">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 lg:col-span-2">
              <h4 className="text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mb-3 sm:mb-4 uppercase">
                JOIN FOR EXCLUSIVE DEALS
              </h4>
              <div className="flex w-full max-w-sm gap-2">
                <input
                  type="email"
                  placeholder="Type your email to sign up"
                  className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2.5 rounded-[100px] text-sm outline-none placeholder:text-white/50 focus:border-white/40 transition-colors"
                />
                <KtLinkButton label="Send" theme="dark" kind="primary" />
              </div>

              <h4 className="text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mt-5 sm:mt-6 mb-3 uppercase">
                CONNECT
              </h4>
              <div className="flex items-center gap-3">
                <a href="https://www.linkedin.com/company/kaiketsutech/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors duration-200 text-xs font-bold tracking-wider">
                  in
                </a>
                <a href="https://www.instagram.com/kaiketsutech/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors duration-200 text-xs font-bold tracking-wider">
                  IG
                </a>
              </div>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}
