import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Entity from '@/lib/models/Entity'
import {
  computeStatusDistribution,
  computeAverageTimePerStatus,
  computeSuccessRate,
  computeStagesCountPerEntity,
  computeUserActivityHeatmap
} from '@/lib/utils/statsUtils'

export async function GET() {
  try {
    await connectDB()
    
    const entities = await Entity.find({})

    const statusDistribution = computeStatusDistribution(entities)
    const averageTimePerStatus = computeAverageTimePerStatus(entities)
    const successRate = computeSuccessRate(entities)
    const stagesCountPerEntity = computeStagesCountPerEntity(entities)
    const userActivityHeatmap = computeUserActivityHeatmap(entities)

    return NextResponse.json({
      averageTimePerStatus,
      averageNumberOfStatesPerEntity: stagesCountPerEntity.average,
      minStatesPerEntity: stagesCountPerEntity.min,
      maxStatesPerEntity: stagesCountPerEntity.max,
      successRate,
      distributionByStatus: statusDistribution,
      stagesCountPerEntity: stagesCountPerEntity.distribution,
      userActivityOverTime: userActivityHeatmap
    })
  } catch (error: any) {
    console.error('Error getting analytics:', error)
    return NextResponse.json({
      averageTimePerStatus: {},
      averageNumberOfStatesPerEntity: 0,
      minStatesPerEntity: 0,
      maxStatesPerEntity: 0,
      successRate: 0,
      distributionByStatus: {},
      stagesCountPerEntity: {},
      userActivityOverTime: {}
    })
  }
}
