'use client'

import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-8">
      <h1 className="text-5xl font-bold text-center">Welcome to LifeCycle Tracker</h1>
      <p className="text-lg text-gray-700 text-center max-w-md">
        Track the complete lifecycle of your projects, ideas, or documents with ease.
      </p>

      <div className="flex space-x-6">
        <button
          onClick={() => router.push('/signup')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <button
          onClick={() => router.push('/login')}
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-400 transition"
        >
          Login
        </button>
      </div>
    </div>
  )
}
