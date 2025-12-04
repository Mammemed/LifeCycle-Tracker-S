'use client'

interface ActivityHeatmapProps {
  data: Record<string, number>
}

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const entries = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]))
  
  if (entries.length === 0) {
    return <p className="text-gray-500 text-center py-8">No activity data available</p>
  }

  const maxActivity = Math.max(...entries.map(([_, count]) => count), 1)

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-gray-100'
    const intensity = count / maxActivity
    if (intensity < 0.25) return 'bg-green-200'
    if (intensity < 0.5) return 'bg-green-400'
    if (intensity < 0.75) return 'bg-green-600'
    return 'bg-green-800'
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-1 min-w-max">
        {entries.map(([date, count]) => (
          <div
            key={date}
            className={`${getIntensity(count)} p-2 rounded text-xs text-center min-w-[40px]`}
            title={`${date}: ${count} activities`}
          >
            <div className="text-white font-semibold">{count}</div>
            <div className="text-white text-[10px]">{new Date(date).getDate()}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <div className="w-4 h-4 bg-green-200 rounded"></div>
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <div className="w-4 h-4 bg-green-800 rounded"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

