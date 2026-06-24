'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  // Hide footer on auth screens and dashboard screens
  if (pathname.startsWith('/auth') || pathname.startsWith('/dashboard')) {
    return null
  }

  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-container-lowest text-primary dark:text-primary font-body-md text-body-md w-full py-section-gap border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="col-span-1 md:col-span-2">
          <div className="mb-4">
            <img src="/weblogo.svg" alt="KaiketsuTech Logo" className="h-12 w-auto" />
          </div>
          <p className="text-on-surface-variant max-w-sm mb-4">Solve | Design | Elevate</p>
          <div className="flex items-center gap-4 mb-6">
            <a 
              href="https://www.linkedin.com/company/kaiketsutech/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-on-surface-variant hover:text-primary transition-all duration-300 flex items-center gap-2"
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              <span className="text-xs font-semibold">LinkedIn</span>
            </a>
            <a 
              href="https://www.instagram.com/kaiketsutech/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-on-surface-variant hover:text-primary transition-all duration-300 flex items-center gap-2"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span className="text-xs font-semibold">Instagram</span>
            </a>
          </div>
          <p className="text-on-surface-variant text-sm">
            © {new Date().getFullYear()} KaiketsuTech. Precision Engineering for Modern Enterprises.
          </p>
        </div>
        <div>
          <h4 className="font-label-md text-label-md font-semibold text-on-surface mb-4 tracking-wider uppercase">
            Navigation
          </h4>
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="/services" className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">
                Services
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/showcase" className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">
                Showcase
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/verify" className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">
                Verify Certificate
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-md text-label-md font-semibold text-on-surface mb-4 tracking-wider uppercase">
            Legal
          </h4>
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
