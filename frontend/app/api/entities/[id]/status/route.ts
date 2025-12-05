import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Entity from '@/lib/models/Entity'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { toStatus, changedBy, comment } = await request.json()
    const entity = await Entity.findById(params.id)

    if (!entity) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      )
    }

    if (!toStatus || !changedBy) {
      return NextResponse.json(
        { error: 'toStatus and changedBy are required' },
        { status: 400 }
      )
    }

    // Add to status history
    entity.statusHistory.push({
      fromStatus: entity.currentStatus,
      toStatus,
      changedAt: new Date(),
      changedBy,
      comment: comment || ''
    })

    // Update current status
    entity.currentStatus = toStatus
    entity.updatedAt = new Date()

    await entity.save()
    return NextResponse.json(entity)
  } catch (error: any) {
    console.error('Error changing status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to change status' },
      { status: 500 }
    )
  }
}
