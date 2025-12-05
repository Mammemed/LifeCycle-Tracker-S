'use client'

import { usePathname } from 'next/navigation'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'
import Sidebar from '@/components/Layout/Sidebar'
import Topbar from '@/components/Layout/Topbar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  // Login page doesn't need sidebar/topbar
  if (isLoginPage) {
    return <>{children}</>
  }

  // All other pages are protected and need sidebar/topbar
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
