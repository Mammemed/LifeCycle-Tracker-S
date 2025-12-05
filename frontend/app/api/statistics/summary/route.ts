import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Entity from '@/lib/models/Entity'
import { computeSuccessRate } from '@/lib/utils/statsUtils'

export async function GET() {
  try {
    await connectDB()
    
    const entities = await Entity.find({})
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Count reviews today (status changes today)
    const reviewsToday = entities.reduce((count, entity) => {
      return count + entity.statusHistory.filter(
        sh => new Date(sh.changedAt) >= today
      ).length
    }, 0)

    // Count reviews this week
    const reviewsThisWeek = entities.reduce((count, entity) => {
      return count + entity.statusHistory.filter(
        sh => new Date(sh.changedAt) >= weekAgo
      ).length
    }, 0)

    const successRate = computeSuccessRate(entities)

    return NextResponse.json({
      totalActiveEntities: entities.length,
      totalReviewsToday: reviewsToday,
      totalReviewsThisWeek: reviewsThisWeek,
      successRate: successRate
    })
  } catch (error: any) {
    console.error('Error getting summary:', error)
    return NextResponse.json({
      totalActiveEntities: 0,
      totalReviewsToday: 0,
      totalReviewsThisWeek: 0,
      successRate: 0
    })
  }
}
