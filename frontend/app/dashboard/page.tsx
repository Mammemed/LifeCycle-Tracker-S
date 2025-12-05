'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import EntityCard from '@/components/EntityCard'
import { getEntities, getStatisticsSummary, Entity, StatisticsSummary } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [entities, setEntities] = useState<Entity[]>([])
  const [stats, setStats] = useState<StatisticsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const loadData = async () => {
      try {
        const [entitiesData, statsData] = await Promise.all([
          getEntities(),
          getStatisticsSummary()
        ])
        setEntities(entitiesData)
        setStats(statsData)
      } catch (error) {
        console.error('Error loading data:', error)
        localStorage.removeItem('token')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={() => router.push('/entities/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + New Entity
          </button>
        </div>

        {/* KPIs */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Active Entities</h3>
              <p className="text-2xl font-bold">{stats.totalActiveEntities}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Reviews Today</h3>
              <p className="text-2xl font-bold">{stats.totalReviewsToday}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Reviews This Week</h3>
              <p className="text-2xl font-bold">{stats.totalReviewsThisWeek}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Success Rate</h3>
              <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Entities List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Entities</h2>
            <div className="space-x-2">
              <button
                onClick={() => router.push('/statistics')}
                className="text-blue-600 hover:underline"
              >
                View Full Timeline
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('http://localhost:5000/api/reports/export/csv', {
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                      }
                    })
                    const blob = await response.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'entities-export.csv'
                    a.click()
                  } catch (error) {
                    console.error('Export error:', error)
                  }
                }}
                className="text-blue-600 hover:underline"
              >
                Export CSV
              </button>
            </div>
          </div>

          {entities.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <p className="text-gray-500 mb-4">No entities yet. Create your first entity!</p>
              <button
                onClick={() => router.push('/entities/new')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Entity
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entities.map((entity) => (
                <EntityCard
                  key={entity._id}
                  entity={entity}
                  onClick={() => router.push(`/entities/${entity._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}