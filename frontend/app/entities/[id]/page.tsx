'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getEntityById, changeEntityStatus, addComment, createVersion } from '@/lib/api'
import type { Entity } from '@/lib/api'
import StatusBadge from '@/components/StatusBadge'
import Timeline from '@/components/Timeline'

export default function EntityDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const entityId = params.id as string
  const [entity, setEntity] = useState<Entity | null>(null)
  const [loading, setLoading] = useState(true)
  const [showStatusChange, setShowStatusChange] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusComment, setStatusComment] = useState('')
  const [changedBy, setChangedBy] = useState('Current User')
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [newComment, setNewComment] = useState({ author: 'Current User', text: '' })
  const [showVersionForm, setShowVersionForm] = useState(false)
  const [newVersion, setNewVersion] = useState({ changeSummary: '' })

  useEffect(() => {
    loadEntity()
  }, [entityId])

  const loadEntity = async () => {
    try {
      const data = await getEntityById(entityId)
      setEntity(data)
    } catch (error) {
      console.error('Error loading entity:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async () => {
    if (!newStatus || !changedBy) {
      alert('Please fill in all required fields')
      return
    }

    try {
      await changeEntityStatus(entityId, {
        toStatus: newStatus,
        changedBy,
        comment: statusComment
      })
      await loadEntity()
      setShowStatusChange(false)
      setNewStatus('')
      setStatusComment('')
    } catch (error) {
      console.error('Error changing status:', error)
      alert('Failed to change status')
    }
  }

  const handleAddComment = async () => {
    if (!newComment.text) {
      alert('Please enter a comment')
      return
    }

    try {
      await addComment(entityId, newComment)
      await loadEntity()
      setNewComment({ author: 'Current User', text: '' })
      setShowCommentForm(false)
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment')
    }
  }

  const handleCreateVersion = async () => {
    try {
      await createVersion(entityId, {
        content: {
          title: entity?.title || '',
          description: entity?.description || '',
          type: entity?.type || 'article'
        },
        createdBy: 'Current User',
        changeSummary: newVersion.changeSummary || 'New version'
      })
      await loadEntity()
      setNewVersion({ changeSummary: '' })
      setShowVersionForm(false)
    } catch (error) {
      console.error('Error creating version:', error)
      alert('Failed to create version')
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{entity.title}</h1>
          <p className="text-gray-600">{entity.description}</p>
        </div>
        <StatusBadge status={entity.currentStatus} />
      </div>

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Type:</span>
            <p className="font-medium">{entity.type}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Created:</span>
            <p className="font-medium">{new Date(entity.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Last Updated:</span>
            <p className="font-medium">{new Date(entity.updatedAt).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Current Status:</span>
            <p className="font-medium">
              <StatusBadge status={entity.currentStatus} />
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setShowStatusChange(!showStatusChange)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Change Status
        </button>
        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add Comment
        </button>
        <button
          onClick={() => setShowVersionForm(!showVersionForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Create Version
        </button>
        <button
          onClick={() => router.push(`/entities/${entityId}/compare`)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          Compare Versions
        </button>
      </div>

      {/* Status Change Form */}
      {showStatusChange && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Change Status</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select status</option>
                <option value="draft">Draft</option>
                <option value="in_preparation">In Preparation</option>
                <option value="submitted">Submitted</option>
                <option value="in_review">In Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Changed By</label>
              <input
                type="text"
                value={changedBy}
                onChange={(e) => setChangedBy(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comment (optional)</label>
              <textarea
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>
            <button
              onClick={handleStatusChange}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Status Timeline</h2>
        <Timeline statusHistory={entity.statusHistory} />
      </div>

      {/* Versions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Versions</h2>
        {showVersionForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium mb-1">Change Summary</label>
            <textarea
              value={newVersion.changeSummary}
              onChange={(e) => setNewVersion({ changeSummary: e.target.value })}
              className="w-full px-3 py-2 border rounded-md mb-2"
              rows={2}
            />
            <button
              onClick={handleCreateVersion}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Create Version
            </button>
          </div>
        )}
        <div className="space-y-2">
          {entity.versions.map((version, idx) => (
            <div key={idx} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Version {version.versionNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(version.createdAt).toLocaleString()} by {version.createdBy}
                  </p>
                  <p className="text-sm mt-1">{version.changeSummary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contributors */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Contributors</h2>
        <div className="space-y-2">
          {entity.contributors.length === 0 ? (
            <p className="text-gray-500">No contributors yet</p>
          ) : (
            entity.contributors.map((contributor, idx) => (
              <div key={idx} className="flex justify-between items-center border p-3 rounded-lg">
                <div>
                  <p className="font-medium">{contributor.name}</p>
                  <p className="text-sm text-gray-500">{contributor.role}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(contributor.lastActiveAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {showCommentForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium mb-1">Add Comment</label>
            <textarea
              value={newComment.text}
              onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
              className="w-full px-3 py-2 border rounded-md mb-2"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Post Comment
            </button>
          </div>
        )}
        <div className="space-y-2">
          {entity.comments.length === 0 ? (
            <p className="text-gray-500">No comments yet</p>
          ) : (
            entity.comments.map((comment, idx) => (
              <div key={idx} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">{comment.author}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

