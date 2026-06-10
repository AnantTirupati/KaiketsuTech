import type { Metadata } from 'next'
import { ToastProvider } from '@/components/ui/Toast'
import TopNavBar from '@/components/shared/TopNavBar'
import Footer from '@/components/shared/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'KaiketsuTech - Premium Software Agency',
  description: 'We engineer premium software solutions tailored for high-end enterprises. Precision, scalability, and relentless innovation are the core of our technical DNA.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: '/logo.jpeg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-background text-on-surface flex flex-col">
        <ToastProvider>
          <TopNavBar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
