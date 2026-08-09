import type { Metadata } from 'next'
import Link from 'next/link'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'

export const metadata: Metadata = {
  title: 'Page not found',
}

/**
 * Global 404 — Next renders this inside the root layout regardless of what
 * section a visitor was trying to reach, so there's no reliable way to know
 * whether they were in marketing or dashboard territory. Marketing is the
 * right default: it's the theme actual visitors following a broken/typo'd
 * link overwhelmingly land in, and it's the site's public face. No
 * TerminalIntro here on purpose — a 404 is already a dead end, it shouldn't
 * also make someone sit through a boot sequence to leave it.
 */
export default function NotFound() {
  return (
    <div
      className={`${GeistSans.variable} ${GeistMono.variable} flex min-h-screen flex-col bg-marketing-bg text-marketing-fg font-marketing-sans antialiased`}
    >
      <MarketingNav />
      <main className="flex flex-1 flex-col items-center justify-center px-[6vw] py-[10vh] text-center">
        <div className="mb-4 font-marketing-mono text-xs uppercase tracking-[0.14em] text-marketing-accent">
          404
        </div>
        <h1 className="max-w-[16ch] font-marketing-sans text-[clamp(32px,6vw,56px)] font-bold leading-[1.05]">
          Nothing resolved here.
        </h1>
        <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-marketing-muted">
          解決 means solution — this page isn&rsquo;t one. The link&rsquo;s broken or the page moved.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-marketing-accent px-7 py-3.5 text-sm font-semibold text-marketing-accent-ink transition-colors hover:bg-marketing-fg"
          >
            Back home
          </Link>
          <Link
            href="/showcase"
            className="rounded-full border border-marketing-border px-7 py-3.5 text-sm font-semibold text-marketing-fg transition-colors hover:border-marketing-accent"
          >
            See our work
          </Link>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
