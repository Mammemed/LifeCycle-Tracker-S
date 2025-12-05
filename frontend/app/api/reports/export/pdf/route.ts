import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Entity from '@/lib/models/Entity'

export async function GET() {
  try {
    await connectDB()
    
    const entities = await Entity.find({})
    
    // PDF export is handled client-side with jsPDF
    // This endpoint returns data for client-side PDF generation
    return NextResponse.json({
      message: 'Use client-side PDF export. Data provided for PDF generation.',
      data: entities,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Error exporting PDF:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to export PDF' },
      { status: 500 }
    )
  }
}
