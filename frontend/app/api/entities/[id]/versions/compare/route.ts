import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Entity from '@/lib/models/Entity'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    
    const entity = await Entity.findById(params.id)

    if (!entity) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      )
    }

    if (!from || !to) {
      return NextResponse.json(
        { error: 'from and to query parameters are required' },
        { status: 400 }
      )
    }

    const versionFrom = entity.versions.find(v => v.versionNumber === parseInt(from))
    const versionTo = entity.versions.find(v => v.versionNumber === parseInt(to))

    if (!versionFrom || !versionTo) {
      return NextResponse.json(
        { error: 'Invalid version numbers' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      from: versionFrom,
      to: versionTo,
      differences: {
        title: versionFrom.content.title !== versionTo.content.title,
        description: versionFrom.content.description !== versionTo.content.description,
        type: versionFrom.content.type !== versionTo.content.type
      }
    })
  } catch (error: any) {
    console.error('Error comparing versions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to compare versions' },
      { status: 500 }
    )
  }
}
