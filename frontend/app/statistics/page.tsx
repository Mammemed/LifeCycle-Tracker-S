'use client'

import { useEffect, useState } from 'react'
import { getStatisticsAnalytics } from '@/lib/api'
import StatusPieChart from '@/components/Charts/StatusPieChart'
import EntityStagesBarChart from '@/components/Charts/EntityStagesBarChart'
import ActivityHeatmap from '@/components/Charts/ActivityHeatmap'
import type { StatisticsAnalytics } from '@/lib/api'

export default function StatisticsPage() {
  const [analytics, setAnalytics] = useState<StatisticsAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const data = await getStatisticsAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports/export/pdf')
      const data = await response.json()
      alert('PDF export initiated. Check console for data.')
      console.log(data)
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  const handleExportCSV = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports/export/csv')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'statistics-export.csv'
      a.click()
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!analytics) {
    return <div className="text-center py-12">No analytics data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Statistics & Analytics</h1>
        <div className="space-x-2">
          <button
            onClick={handleExportPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Export PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Basic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Avg Stages per Entity</h3>
          <p className="text-2xl font-bold">{analytics.averageNumberOfStatesPerEntity.toFixed(1)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Min Stages</h3>
          <p className="text-2xl font-bold">{analytics.minStatesPerEntity}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Max Stages</h3>
          <p className="text-2xl font-bold">{analytics.maxStatesPerEntity}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Success Rate</h3>
          <p className="text-2xl font-bold">{analytics.successRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Average Time per Status */}
      {Object.keys(analytics.averageTimePerStatus).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Average Time per Status (days)</h2>
          <div className="space-y-2">
            {Object.entries(analytics.averageTimePerStatus).map(([status, days]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="font-medium">{status}</span>
                <span>{days.toFixed(2)} days</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Status Distribution</h2>
          <StatusPieChart data={analytics.distributionByStatus} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Stages per Entity</h2>
          <EntityStagesBarChart data={analytics.stagesCountPerEntity} />
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Activity Heatmap (Last 30 Days)</h2>
        <ActivityHeatmap data={analytics.userActivityOverTime} />
      </div>
    </div>
  )
}

