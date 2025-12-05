'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function Topbar() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">LifeCycle Tracker</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          {isAuthenticated && user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user.name || user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

