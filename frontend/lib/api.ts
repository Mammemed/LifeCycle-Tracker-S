import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Types
export interface Entity {
  _id: string
  title: string
  description: string
  type: string
  currentStatus: string
  statusHistory: StatusHistoryEntry[]
  versions: Version[]
  contributors: Contributor[]
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export interface StatusHistoryEntry {
  fromStatus: string | null
  toStatus: string
  changedAt: string
  changedBy: string
  comment?: string
}

export interface Version {
  versionNumber: number
  content: {
    title: string
    description: string
    type: string
  }
  createdAt: string
  createdBy: string
  changeSummary: string
}

export interface Contributor {
  name: string
  role: string
  lastActiveAt: string
}

export interface Comment {
  author: string
  text: string
  createdAt: string
  linkedToVersion?: number | null
  linkedToStatus?: string | null
}

export interface StatisticsSummary {
  totalActiveEntities: number
  totalReviewsToday: number
  totalReviewsThisWeek: number
  successRate: number
}

export interface StatisticsAnalytics {
  averageTimePerStatus: Record<string, number>
  averageNumberOfStatesPerEntity: number
  minStatesPerEntity: number
  maxStatesPerEntity: number
  successRate: number
  distributionByStatus: Record<string, number>
  stagesCountPerEntity: Record<number, number>
  userActivityOverTime: Record<string, number>
}

// Entity API
export const getEntities = async (): Promise<Entity[]> => {
  const response = await api.get('/entities')
  return response.data
}

export const getEntityById = async (id: string): Promise<Entity> => {
  const response = await api.get(`/entities/${id}`)
  return response.data
}

export const createEntity = async (data: {
  title: string
  description?: string
  initialStatus?: string
  type?: string
  createdBy?: string
}): Promise<Entity> => {
  const response = await api.post('/entities', data)
  return response.data
}

export const changeEntityStatus = async (
  id: string,
  data: {
    toStatus: string
    changedBy: string
    comment?: string
  }
): Promise<Entity> => {
  const response = await api.patch(`/entities/${id}/status`, data)
  return response.data
}

export const addComment = async (
  id: string,
  data: {
    author: string
    text: string
    linkedToVersion?: number
    linkedToStatus?: string
  }
): Promise<Entity> => {
  const response = await api.post(`/entities/${id}/comments`, data)
  return response.data
}

export const createVersion = async (
  id: string,
  data: {
    content?: {
      title: string
      description: string
      type: string
    }
    createdBy: string
    changeSummary?: string
  }
): Promise<Entity> => {
  const response = await api.post(`/entities/${id}/versions`, data)
  return response.data
}

export const getVersions = async (id: string): Promise<Version[]> => {
  const response = await api.get(`/entities/${id}/versions`)
  return response.data
}

export const compareVersions = async (
  id: string,
  from: number,
  to: number
): Promise<any> => {
  const response = await api.get(`/entities/${id}/versions/compare`, {
    params: { from, to }
  })
  return response.data
}

// Statistics API
export const getStatisticsSummary = async (): Promise<StatisticsSummary> => {
  const response = await api.get('/statistics/summary')
  return response.data
}

export const getStatisticsAnalytics = async (): Promise<StatisticsAnalytics> => {
  const response = await api.get('/statistics/analytics')
  return response.data
}

