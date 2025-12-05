'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPredictions } from '@/lib/api'
import type { PredictionsResponse, Prediction } from '@/lib/api'

export default function PredictionsPage() {
  const router = useRouter()
  const [predictionsData, setPredictionsData] = useState<PredictionsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPredictions()
  }, [])

  const loadPredictions = async () => {
    try {
      const data = await getPredictions()
      setPredictionsData(data)
    } catch (error) {
      console.error('Error loading predictions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600 bg-green-50'
    if (probability >= 40) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getConfidenceColor = (confidence: string) => {
    if (confidence === 'high') return 'bg-green-100 text-green-800'
    if (confidence === 'medium') return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading predictions...</p>
        </div>
      </div>
    )
  }

  if (!predictionsData) {
    return <div className="text-center py-12">No predictions data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Predictions</h1>
          <p className="text-gray-500 mt-1">Predictions basées sur l'analyse des données historiques</p>
        </div>
        <button
          onClick={loadPredictions}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Summary Cards */}
      {predictionsData.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Total Entities</h3>
            <p className="text-2xl font-bold">{predictionsData.summary.totalEntities}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Average Success Rate</h3>
            <p className="text-2xl font-bold">{predictionsData.summary.averageSuccessProbability.toFixed(1)}%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Average Days Remaining</h3>
            <p className="text-2xl font-bold">{predictionsData.summary.averageDaysRemaining.toFixed(1)} days</p>
          </div>
        </div>
      )}

      {/* Predictions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Entity Predictions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Probability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Completion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictionsData.predictions.map((prediction) => (
                <tr key={prediction.entityId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => router.push(`/entities/${prediction.entityId}`)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {prediction.title}
                    </button>
                    <p className="text-sm text-gray-500">{prediction.type}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {prediction.currentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getProbabilityColor(prediction.successProbability)}`}>
                        {prediction.successProbability}%
                      </div>
                      <span className={`ml-2 px-2 py-1 text-xs rounded ${getConfidenceColor(prediction.successConfidence)}`}>
                        {prediction.successConfidence}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs">{prediction.successReasoning}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {prediction.daysRemaining > 0 ? `${prediction.daysRemaining.toFixed(1)} days` : 'Completed'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prediction.estimatedCompletionDate ? formatDate(prediction.estimatedCompletionDate) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${getConfidenceColor(prediction.timeConfidence)}`}>
                      {prediction.timeConfidence}
                    </span>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs">{prediction.timeReasoning}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Predictions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictionsData.predictions.map((prediction) => (
          <div key={prediction.entityId} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <button
                  onClick={() => router.push(`/entities/${prediction.entityId}`)}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {prediction.title}
                </button>
                <p className="text-sm text-gray-500">{prediction.type}</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                {prediction.currentStatus}
              </span>
            </div>

            <div className="space-y-4">
              {/* Success Probability */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Success Probability</span>
                  <span className={`px-2 py-1 text-xs rounded ${getConfidenceColor(prediction.successConfidence)}`}>
                    {prediction.successConfidence}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full flex items-center justify-center text-xs font-semibold ${
                      prediction.successProbability >= 70 ? 'bg-green-500' :
                      prediction.successProbability >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${prediction.successProbability}%` }}
                  >
                    {prediction.successProbability}%
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{prediction.successReasoning}</p>
              </div>

              {/* Time Estimate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Estimated Completion</span>
                  <span className={`px-2 py-1 text-xs rounded ${getConfidenceColor(prediction.timeConfidence)}`}>
                    {prediction.timeConfidence}
                  </span>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {prediction.daysRemaining > 0 ? `${prediction.daysRemaining.toFixed(1)} days` : 'Completed'}
                </div>
                <p className="text-sm text-gray-500">
                  {prediction.estimatedCompletionDate 
                    ? formatDate(prediction.estimatedCompletionDate)
                    : 'N/A'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">{prediction.timeReasoning}</p>
              </div>

              {/* Stats */}
              <div className="flex justify-between text-sm text-gray-600 pt-2 border-t">
                <span>Transitions: {prediction.transitionsCount}</span>
                <span>{new Date(prediction.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
