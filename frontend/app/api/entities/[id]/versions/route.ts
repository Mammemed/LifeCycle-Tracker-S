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

    return NextResponse.json(entity.versions)
  } catch (error: any) {
    console.error('Error getting versions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get versions' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { content, createdBy, changeSummary } = await request.json()
    const entity = await Entity.findById(params.id)

    if (!entity) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      )
    }

    if (!createdBy) {
      return NextResponse.json(
        { error: 'createdBy is required' },
        { status: 400 }
      )
    }

    // Get next version number
    const nextVersionNumber = entity.versions.length > 0
      ? Math.max(...entity.versions.map(v => v.versionNumber)) + 1
      : 1

    // Ensure content is properly formatted
    const versionContent = content ? {
      title: content.title || entity.title || '',
      description: content.description || entity.description || '',
      type: content.type || entity.type || 'article'
    } : {
      title: entity.title || '',
      description: entity.description || '',
      type: entity.type || 'article'
    }

    entity.versions.push({
      versionNumber: nextVersionNumber,
      content: versionContent,
      createdAt: new Date(),
      createdBy,
      changeSummary: changeSummary || `Version ${nextVersionNumber}`
    })

    // Update entity fields if content provided
    if (content) {
      if (content.title) entity.title = content.title
      if (content.description) entity.description = content.description
      if (content.type) entity.type = content.type
    }

    entity.updatedAt = new Date()
    await entity.save()
    
    return NextResponse.json(entity)
  } catch (error: any) {
    console.error('Error creating version:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create version' },
      { status: 500 }
    )
  }
}
