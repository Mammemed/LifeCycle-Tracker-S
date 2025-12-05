import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Entity from '@/lib/models/Entity'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { author, text, linkedToVersion, linkedToStatus } = await request.json()
    const entity = await Entity.findById(params.id)

    if (!entity) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      )
    }

    if (!author || !text) {
      return NextResponse.json(
        { error: 'author and text are required' },
        { status: 400 }
      )
    }

    entity.comments.push({
      author,
      text,
      createdAt: new Date(),
      linkedToVersion: linkedToVersion || null,
      linkedToStatus: linkedToStatus || null
    })

    entity.updatedAt = new Date()
    await entity.save()
    
    return NextResponse.json(entity)
  } catch (error: any) {
    console.error('Error adding comment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add comment' },
      { status: 500 }
    )
  }
}
