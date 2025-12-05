import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import LayoutWrapper from '@/components/Layout/LayoutWrapper'

export const metadata: Metadata = {
  title: 'LifeCycle Tracker',
  description: 'Track and visualize the lifecycle of entities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}

