'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface EntityStagesBarChartProps {
  data: Record<number, number>
}

export default function EntityStagesBarChart({ data }: EntityStagesBarChartProps) {
  const chartData = Object.entries(data)
    .map(([stages, count]) => ({
      stages: parseInt(stages),
      count
    }))
    .sort((a, b) => a.stages - b.stages)

  if (chartData.length === 0) {
    return <p className="text-gray-500 text-center py-8">No data available</p>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="stages" label={{ value: 'Number of Stages', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Number of Entities', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name="Entities" />
      </BarChart>
    </ResponsiveContainer>
  )
}

