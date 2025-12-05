import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IStatusHistory {
  fromStatus: string | null
  toStatus: string
  changedAt: Date
  changedBy: string
  comment?: string
}

export interface IContent {
  title: string
  description: string
  type: string
}

export interface IVersion {
  versionNumber: number
  content: IContent
  createdAt: Date
  createdBy: string
  changeSummary: string
}

export interface IContributor {
  name: string
  role: string
  lastActiveAt: Date
}

export interface IComment {
  author: string
  text: string
  createdAt: Date
  linkedToVersion?: number | null
  linkedToStatus?: string | null
}

export interface IEntity extends Document {
  title: string
  description: string
  type: string
  currentStatus: string
  statusHistory: IStatusHistory[]
  versions: IVersion[]
  contributors: IContributor[]
  comments: IComment[]
  createdAt: Date
  updatedAt: Date
}

const statusHistorySchema = new Schema<IStatusHistory>({
  fromStatus: { type: String, default: null },
  toStatus: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: String, required: true },
  comment: { type: String, default: '' }
})

const contentSchema = new Schema<IContent>({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  type: { type: String, default: 'article' }
}, { _id: false })

const versionSchema = new Schema<IVersion>({
  versionNumber: { type: Number, required: true },
  content: { type: contentSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  changeSummary: { type: String, default: '' }
}, { _id: false })

const contributorSchema = new Schema<IContributor>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  lastActiveAt: { type: Date, default: Date.now }
})

const commentSchema = new Schema<IComment>({
  author: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  linkedToVersion: { type: Number, default: null },
  linkedToStatus: { type: String, default: null }
})

const entitySchema = new Schema<IEntity>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, default: 'article' },
  currentStatus: { type: String, required: true, default: 'draft' },
  statusHistory: [statusHistorySchema],
  versions: [versionSchema],
  contributors: [contributorSchema],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Update updatedAt before saving
entitySchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

const Entity: Model<IEntity> = mongoose.models.Entity || mongoose.model<IEntity>('Entity', entitySchema)

export default Entity
