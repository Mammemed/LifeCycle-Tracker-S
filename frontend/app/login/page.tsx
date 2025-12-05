'use client'  // ← مهم جدًا مع App Router

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password)
      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <input
        type="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        className="input mb-4 w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        className="input mb-4 w-full p-2 border rounded"
      />
      <button onClick={handleLogin} className="btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
        Login
      </button>
      <p className="mt-4 text-center">
        Don't have an account? <a href="/signup" className="text-blue-600 underline">Sign Up</a>
      </p>
    </div>
  )
}
