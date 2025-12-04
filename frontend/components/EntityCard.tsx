import { useRouter } from 'next/navigation'
import StatusBadge from './StatusBadge'
import type { Entity } from '@/lib/api'

interface EntityCardProps {
  entity: Entity
  onClick?: () => void
}

export default function EntityCard({ entity, onClick }: EntityCardProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/entities/${entity._id}`)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{entity.title}</h3>
        <StatusBadge status={entity.currentStatus} />
      </div>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{entity.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{entity.type}</span>
        <span>{new Date(entity.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

