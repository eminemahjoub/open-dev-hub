import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/lib/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://eklfounder.com'),
  title: {
    default: 'EklFounder - Fintech Comparison Platform',
    template: '%s | EklFounder'
  },
  description: 'Compare and onboard with the best fintech institutions. EMIs, banks, PSPs and more.',
  keywords: ['fintech', 'comparison', 'onboarding', 'EMI', 'bank', 'PSP', 'financial institutions'],
  authors: [{ name: 'EklFounder Team' }],
  creator: 'EklFounder',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eklfounder.com',
    title: 'EklFounder - Fintech Comparison Platform',
    description: 'Compare and onboard with the best fintech institutions. EMIs, banks, PSPs and more.',
    siteName: 'EklFounder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EklFounder - Fintech Comparison Platform',
    description: 'Compare and onboard with the best fintech institutions. EMIs, banks, PSPs and more.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen flex flex-col')}>
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
} 