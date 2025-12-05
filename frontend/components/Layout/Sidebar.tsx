'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/entities/new', label: 'New Entity', icon: '➕' },
    { path: '/statistics', label: 'Statistics', icon: '📈' },
    { path: '/profile', label: 'My Profile', icon: '👤' }
  ]

  const isActive = (path: string) => {
    return pathname === path || (path === '/dashboard' && pathname === '/')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">LifeCycle Tracker</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your entities lifecycle</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => router.push(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-gray-700 mt-auto">
        <div className="mb-4">
          <div className="flex items-center px-4 py-3 rounded-lg bg-gray-900">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="font-bold text-white">U</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">User Account</p>
              <p className="text-xs text-gray-400">Manage your profile</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg bg-red-900/20 text-red-300 hover:bg-red-900/40 hover:text-red-100 transition-colors flex items-center"
        >
          <span className="mr-3">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}