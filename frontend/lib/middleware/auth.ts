import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AuthUser {
  userId: string
}

export async function authenticateRequest(request: NextRequest): Promise<{ user: AuthUser } | { error: string; status: number }> {
  try {
    await connectDB()
    
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No token provided', status: 401 }
    }

    const token = authHeader.substring(7)

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    // Verify user exists
    const user = await User.findById(decoded.userId)

    if (!user) {
      return { error: 'User not found', status: 401 }
    }

    return { user: { userId: decoded.userId } }
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return { error: 'Invalid token', status: 401 }
    }
    if (error.name === 'TokenExpiredError') {
      return { error: 'Token expired', status: 401 }
    }
    return { error: error.message || 'Authentication failed', status: 401 }
  }
}
