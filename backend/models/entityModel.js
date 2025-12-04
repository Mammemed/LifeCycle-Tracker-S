const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  fromStatus: { type: String, default: null },
  toStatus: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: String, required: true },
  comment: { type: String, default: '' }
});

// Content sub-schema for versions
const contentSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  type: { type: String, default: 'article' }
}, { _id: false });

const versionSchema = new mongoose.Schema({
  versionNumber: { type: Number, required: true },
  content: { type: contentSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  changeSummary: { type: String, default: '' }
}, { _id: false });

const contributorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., "author", "reviewer", "editor"
  lastActiveAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  linkedToVersion: { type: Number, default: null },
  linkedToStatus: { type: String, default: null }
});

const entitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, default: 'article' }, // article, project, proposal, etc.
  currentStatus: { type: String, required: true, default: 'draft' },
  statusHistory: [statusHistorySchema],
  versions: [versionSchema],
  contributors: [contributorSchema],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt before saving
entitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Entity', entitySchema);

