import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Entity from '@/lib/models/Entity'
import { generatePredictions } from '@/lib/utils/statsUtils'

export async function GET() {
  try {
    await connectDB()
    
    const entities = await Entity.find({})
    const predictions = generatePredictions(entities)

    // Calculate summary statistics
    const totalEntities = predictions.length
    const averageSuccessProbability = predictions.length > 0
      ? predictions.reduce((sum, p) => sum + p.successProbability, 0) / predictions.length
      : 0
    const averageDaysRemaining = predictions.length > 0
      ? predictions.reduce((sum, p) => sum + (p.daysRemaining || 0), 0) / predictions.length
      : 0

    return NextResponse.json({
      predictions,
      summary: {
        totalEntities,
        averageSuccessProbability: Math.round(averageSuccessProbability * 10) / 10,
        averageDaysRemaining: Math.round(averageDaysRemaining * 10) / 10
      }
    })
  } catch (error: any) {
    console.error('Error getting predictions:', error)
    return NextResponse.json({
      predictions: [],
      summary: {
        totalEntities: 0,
        averageSuccessProbability: 0,
        averageDaysRemaining: 0
      }
    })
  }
}
