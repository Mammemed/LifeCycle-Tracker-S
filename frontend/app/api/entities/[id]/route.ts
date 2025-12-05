import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Entity from '@/lib/models/Entity'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const entity = await Entity.findById(params.id)

    if (!entity) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(entity)
  } catch (error: any) {
    console.error('Error getting entity:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get entity' },
      { status: 500 }
    )
  }
}
