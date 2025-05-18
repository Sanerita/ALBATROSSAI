import '../styles/globals.css' 
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import ClientWrapper from '../components/ClientWrapper'

export const metadata: Metadata = {
  title: 'AlbatrossAI CRM',
  description: 'Your sales pipeline management solution',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 antialiased">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}