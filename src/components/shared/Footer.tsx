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
          <p className="text-on-surface-variant max-w-sm mb-6">Solve | Design | Elevate</p>
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
              <Link href="/pricing" className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100">
                Pricing
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
