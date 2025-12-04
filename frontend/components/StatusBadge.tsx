interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'draft' || statusLower === 'in_preparation') {
      return 'bg-gray-500'
    }
    if (statusLower === 'in_review' || statusLower === 'submitted') {
      return 'bg-yellow-500'
    }
    if (statusLower === 'approved' || statusLower === 'published' || statusLower === 'completed' || statusLower === 'accepted') {
      return 'bg-green-500'
    }
    if (statusLower === 'rejected') {
      return 'bg-red-500'
    }
    return 'bg-blue-500'
  }

  return (
    <span
      className={`${getStatusColor(status)} text-white text-xs font-semibold px-2 py-1 rounded-full`}
    >
      {status}
    </span>
  )
}

