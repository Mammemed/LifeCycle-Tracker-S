import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { username, email, password, name } = await request.json()

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide username, email, and password' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      name: name || ''
    })

    // Generate token
    const token = generateToken(user._id.toString())

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    return NextResponse.json(
      {
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
