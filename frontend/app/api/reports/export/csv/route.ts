import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Entity from '@/lib/models/Entity'

export async function GET() {
  try {
    await connectDB()
    
    const entities = await Entity.find({}).select('title type currentStatus createdAt updatedAt')
    
    // Simple CSV generation
    const headers = 'Title,Type,Status,Created At,Updated At\n'
    const rows = entities.map(e => 
      `"${e.title}","${e.type}","${e.currentStatus}","${e.createdAt}","${e.updatedAt}"`
    ).join('\n')
    
    const csv = headers + rows
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=entities-export.csv'
      }
    })
  } catch (error: any) {
    console.error('Error exporting CSV:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to export CSV' },
      { status: 500 }
    )
  }
}
