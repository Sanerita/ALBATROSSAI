import './globals.css'
import '/public/styles.css'
import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import ClientWrapper from '../components/ClientWrapper'
import Navbar from '../components/Navbar'
import { Inter } from 'next/font/google'

// Load optimized font
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
  themeColor: '#12113d', // Your navy color
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <ClientWrapper>
          <Navbar />
          <main className="pt-16"> {/* Offset for fixed navbar */}
            {children}
          </main>
        </ClientWrapper>
      </body>
    </html>
  )
}