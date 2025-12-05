import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/models/User'
import { authenticateRequest } from '@/lib/middleware/auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    await connectDB()
    const user = await User.findById(authResult.user.userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        lastLogin: user.lastLogin
      }
    })
  } catch (error: any) {
    console.error('GetMe error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get user data' },
      { status: 500 }
    )
  }
}
