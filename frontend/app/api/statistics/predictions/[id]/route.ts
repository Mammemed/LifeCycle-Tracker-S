import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Entity from '@/lib/models/Entity'
import { predictSuccessProbability, estimateTimeRemaining } from '@/lib/utils/statsUtils'

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

    const allEntities = await Entity.find({})
    const successPrediction = predictSuccessProbability(entity, allEntities)
    const timePrediction = estimateTimeRemaining(entity, allEntities)

    return NextResponse.json({
      entityId: entity._id.toString(),
      title: entity.title,
      currentStatus: entity.currentStatus,
      successProbability: successPrediction.probability,
      successConfidence: successPrediction.confidence,
      successReasoning: successPrediction.reasoning,
      daysRemaining: timePrediction.daysRemaining,
      estimatedCompletionDate: timePrediction.estimatedDate,
      timeConfidence: timePrediction.confidence,
      timeReasoning: timePrediction.reasoning
    })
  } catch (error: any) {
    console.error('Error getting prediction:', error)
    return NextResponse.json({
      successProbability: 50,
      successConfidence: 'low',
      daysRemaining: 14,
      estimatedCompletionDate: null,
      confidence: 'low'
    })
  }
}
