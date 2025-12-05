'use client'

import type { Metadata } from 'next'
import './globals.css'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Layout/Sidebar'
import Topbar from '@/components/Layout/Topbar'

// إزالة export metadata لأنه 'use client'
// export const metadata: Metadata = {
//   title: 'LifeCycle Tracker',
//   description: 'Track and visualize the lifecycle of entities',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const isAuth = !!token
    setIsAuthenticated(isAuth)
    setLoading(false)

    // إذا لم يكن مسجلاً الدخول ويحاول الوصول لصفحات محمية
    const protectedPaths = ['/dashboard', '/entities', '/statistics', '/profile']
    const isProtectedPath = protectedPaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    )

    if (!isAuth && isProtectedPath && !loading) {
      router.push('/login')
    }

    // إذا كان مسجلاً الدخول ويحاول الوصول لصفحات تسجيل/دخول
    const authPaths = ['/login', '/signup']
    if (isAuth && authPaths.includes(pathname) && !loading) {
      router.push('/dashboard')
    }
  }, [pathname, router, loading])

  // إذا كانت صفحة عامة (لا تتطلب مصادقة)
  const publicPaths = ['/', '/login', '/signup']
  const isPublicPage = publicPaths.includes(pathname)

  if (loading) {
    return (
      <html lang="en">
        <body className="bg-gray-50">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <head>
        <title>LifeCycle Tracker</title>
        <meta name="description" content="Track and visualize the lifecycle of entities" />
      </head>
      <body className="bg-gray-50">
        {isAuthenticated ? (
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Topbar />
              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
            </div>
          </div>
        ) : isPublicPage ? (
          // الصفحات العامة بدون layout
          <div>
            {children}
          </div>
        ) : (
          // تحميل أثناء التحقق من المصادقة
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Redirecting...</p>
            </div>
          </div>
        )}
      </body>
    </html>
  )
}