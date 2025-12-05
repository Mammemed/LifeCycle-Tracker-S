import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Entity from '@/lib/models/Entity'

export async function GET() {
  try {
    await connectDB()
    
    const entities = await Entity.find({})
      .select('title description type currentStatus createdAt updatedAt')
      .sort({ updatedAt: -1 })
    
    return NextResponse.json(entities)
  } catch (error: any) {
    console.error('Error getting entities:', error)
    return NextResponse.json([], { status: 200 }) // Return empty array on error
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { title, description, initialStatus = 'draft', type = 'article', createdBy } = await request.json()

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and cannot be empty' },
        { status: 400 }
      )
    }

    // Initialize with first status history entry
    const statusHistory = [{
      fromStatus: null,
      toStatus: initialStatus,
      changedAt: new Date(),
      changedBy: createdBy || 'System',
      comment: 'Initial status'
    }]

    // Initialize with version 1
    const versions = [{
      versionNumber: 1,
      content: {
        title: title || '',
        description: description || '',
        type: type || 'article'
      },
      createdAt: new Date(),
      createdBy: createdBy || 'System',
      changeSummary: 'Initial version'
    }]

    // Initialize with first contributor if provided
    const contributors = createdBy ? [{
      name: createdBy,
      role: 'author',
      lastActiveAt: new Date()
    }] : []

    const entity = new Entity({
      title,
      description: description || '',
      type,
      currentStatus: initialStatus,
      statusHistory,
      versions,
      contributors
    })

    await entity.save()
    return NextResponse.json(entity, { status: 201 })
  } catch (error: any) {
    console.error('Error creating entity:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create entity' },
      { status: 500 }
    )
  }
}
