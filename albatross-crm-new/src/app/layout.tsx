// app/layout.tsx
import '/public/styles.css'
import './globals.css'
import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import ClientWrapper from '../components/ClientWrapper'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'AlbatrossAI CRM',
    template: '%s | AlbatrossAI CRM'
  },
  description: 'AI-powered sales pipeline management solution',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#12113d',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body className="min-h-screen bg-[#dcae3e] antialiased">
        <ClientWrapper>
          <Navbar />
          <main className="pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <Footer />
        </ClientWrapper>
      </body>
    </html>
  )
}