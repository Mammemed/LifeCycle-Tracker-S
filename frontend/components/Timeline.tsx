import type { StatusHistoryEntry } from '@/lib/api'

interface TimelineProps {
  statusHistory: StatusHistoryEntry[]
}

export default function Timeline({ statusHistory }: TimelineProps) {
  if (statusHistory.length === 0) {
    return <p className="text-gray-500">No status history yet</p>
  }

  return (
    <div className="relative pl-2">
      {statusHistory.map((entry, index) => (
        <div key={index} className="relative flex items-start mb-6">
          <div className="flex-shrink-0 relative z-10">
            <div className="w-4 h-4 bg-blue-500 rounded-full mt-1"></div>
            {index < statusHistory.length - 1 && (
              <div className="absolute left-1.5 top-4 w-0.5 h-12 bg-gray-300"></div>
            )}
          </div>
          <div className="ml-4 flex-1 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {entry.fromStatus ? `${entry.fromStatus} → ${entry.toStatus}` : `Initial: ${entry.toStatus}`}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(entry.changedAt).toLocaleString()} by {entry.changedBy}
                </p>
                {entry.comment && (
                  <p className="text-sm text-gray-600 mt-1">{entry.comment}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

