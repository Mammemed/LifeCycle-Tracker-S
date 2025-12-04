'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getEntityById, getVersions, compareVersions } from '@/lib/api'
import type { Entity, Version } from '@/lib/api'

export default function CompareVersionsPage() {
  const params = useParams()
  const router = useRouter()
  const entityId = params.id as string
  const [entity, setEntity] = useState<Entity | null>(null)
  const [versions, setVersions] = useState<Version[]>([])
  const [versionFrom, setVersionFrom] = useState<number | null>(null)
  const [versionTo, setVersionTo] = useState<number | null>(null)
  const [comparison, setComparison] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [entityId])

  useEffect(() => {
    if (versionFrom && versionTo) {
      loadComparison()
    }
  }, [versionFrom, versionTo])

  const loadData = async () => {
    try {
      const [entityData, versionsData] = await Promise.all([
        getEntityById(entityId),
        getVersions(entityId)
      ])
      setEntity(entityData)
      setVersions(versionsData)
      if (versionsData.length >= 2) {
        setVersionFrom(versionsData[0].versionNumber)
        setVersionTo(versionsData[versionsData.length - 1].versionNumber)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadComparison = async () => {
    if (!versionFrom || !versionTo) return
    try {
      const data = await compareVersions(entityId, versionFrom, versionTo)
      setComparison(data)
    } catch (error) {
      console.error('Error loading comparison:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!entity) {
    return <div className="text-center py-12">Entity not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Compare Versions</h1>
        <button
          onClick={() => router.push(`/entities/${entityId}`)}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Back to Details
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Version From</label>
            <select
              value={versionFrom || ''}
              onChange={(e) => setVersionFrom(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
            >
              {versions.map((v) => (
                <option key={v.versionNumber} value={v.versionNumber}>
                  Version {v.versionNumber} - {new Date(v.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Version To</label>
            <select
              value={versionTo || ''}
              onChange={(e) => setVersionTo(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
            >
              {versions.map((v) => (
                <option key={v.versionNumber} value={v.versionNumber}>
                  Version {v.versionNumber} - {new Date(v.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {comparison && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Version {comparison.from.versionNumber}</h3>
              <div className="space-y-4 border p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="font-medium">{comparison.from.content.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium">{comparison.from.content.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{comparison.from.content.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(comparison.from.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Change Summary</p>
                  <p className="font-medium">{comparison.from.changeSummary}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Version {comparison.to.versionNumber}</h3>
              <div className="space-y-4 border p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className={`font-medium ${comparison.differences.title ? 'bg-yellow-100' : ''}`}>
                    {comparison.to.content.title}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className={`font-medium ${comparison.differences.description ? 'bg-yellow-100' : ''}`}>
                    {comparison.to.content.description}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className={`font-medium ${comparison.differences.type ? 'bg-yellow-100' : ''}`}>
                    {comparison.to.content.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(comparison.to.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Change Summary</p>
                  <p className="font-medium">{comparison.to.changeSummary}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

