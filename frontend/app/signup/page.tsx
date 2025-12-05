'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signupUser } from '@/lib/api'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const data = await signupUser(name, email, password)
      // تخزين التوكن بعد التسجيل
      localStorage.setItem('token', data.token)
      // تحويل المستخدم مباشرة إلى لوحة التحكم الخاصة به
      router.push('/dashboard')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="input mb-4 w-full p-2 border rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="input mb-4 w-full p-2 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="input mb-4 w-full p-2 border rounded"
      />

      <button
        onClick={handleSignup}
        disabled={loading}
        className="btn bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>

      <p className="mt-4 text-center">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 underline">
          Login
        </a>
      </p>
    </div>
  )
}