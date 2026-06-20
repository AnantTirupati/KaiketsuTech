import type { Metadata } from 'next'
import { ToastProvider } from '@/components/ui/Toast'
import TopNavBar from '@/components/shared/TopNavBar'
import Footer from '@/components/shared/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'KaiketsuTech - Premium Software Agency',
    template: '%s | KaiketsuTech',
  },
  description: 'We engineer premium software solutions tailored for high-end enterprises. Precision, scalability, and relentless innovation are the core of our technical DNA.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kaiketsutech.online'),
  icons: {
    icon: '/logo.jpeg',
  },
  openGraph: {
    title: 'KaiketsuTech - Premium Software Agency',
    description: 'We engineer premium software solutions tailored for high-end enterprises. Precision, scalability, and relentless innovation are the core of our technical DNA.',
    url: 'https://www.kaiketsutech.online',
    siteName: 'KaiketsuTech',
    images: [
      {
        url: '/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'KaiketsuTech Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KaiketsuTech - Premium Software Agency',
    description: 'We engineer premium software solutions tailored for high-end enterprises. Precision, scalability, and relentless innovation are the core of our technical DNA.',
    images: ['/logo.jpeg'],
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
