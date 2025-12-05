const Entity = require('../models/entityModel');
const mongoose = require('mongoose');

// Get all entities for current user only
exports.getAllEntities = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    
    // تحقق من وجود المستخدم في الـ req (من authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const entities = await Entity.find({ owner: req.user.id }).sort({ updatedAt: -1 });
    res.json(entities);
  } catch (error) {
    next(error);
  }
};

// Create new entity for current user
exports.createEntity = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    // تحقق من وجود المستخدم في الـ req (من authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const entity = new Entity({
      ...req.body,
      owner: req.user.id, // ربط الكيان بالمستخدم
      statusHistory: [{
        fromStatus: null,
        toStatus: req.body.initialStatus || 'draft',
        changedAt: new Date(),
        changedBy: req.user.id,
        comment: 'Entity created'
      }]
    });
    
    await entity.save();
    res.status(201).json(entity);
  } catch (error) {
    next(error);
  }
};

// Get entity by ID (only if owned by user)
exports.getEntityById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    // تحقق من وجود المستخدم في الـ req (من authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const entity = await Entity.findOne({
      _id: req.params.id,
      owner: req.user.id // التأكد من أن المستخدم يملك الكيان
    });
    
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    res.json(entity);
  } catch (error) {
    next(error);
  }
};

// Change entity status (only if owned by user)
exports.changeStatus = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    // تحقق من وجود المستخدم في الـ req (من authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const entity = await Entity.findOne({
      _id: req.params.id,
      owner: req.user.id // التأكد من أن المستخدم يملك الكيان
    });
    
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    entity.currentStatus = req.body.toStatus;
    entity.statusHistory.push({
      fromStatus: entity.currentStatus,
      toStatus: req.body.toStatus,
      changedAt: new Date(),
      changedBy: req.user.id,
      comment: req.body.comment || ''
    });
    
    await entity.save();
    res.json(entity);
  } catch (error) {
    next(error);
  }
};

// Add comment (only if owned by user)
exports.addComment = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    // تحقق من وجود المستخدم في الـ req (من authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const entity = await Entity.findOne({
      _id: req.params.id,
      owner: req.user.id // التأكد من أن المستخدم يملك الكيان
    });
    
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    entity.comments.push({
      author: req.user.id,
      text: req.body.text,
      createdAt: new Date(),
      linkedToVersion: req.body.linkedToVersion || null,
      linkedToStatus: req.body.linkedToStatus || null
    });
    
    await entity.save();
    res.json(entity);
  } catch (error) {
    next(error);
  }
};

// Create new version (only if owned by user)
exports.createVersion = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    // تحقق من وجود المستخدم في الـ req (من authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const entity = await Entity.findOne({
      _id: req.params.id,
      owner: req.user.id // التأكد من أن المستخدم يملك الكيان
    });
    
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    const versionNumber = (entity.versions?.length || 0) + 1;
    entity.versions.push({
      versionNumber: versionNumber,
      content: req.body.content || {
        title: entity.title,
        description: entity.description,
        type: entity.type
      },
      createdAt: new Date(),
      createdBy: req.user.id,
      changeSummary: req.body.changeSummary || `Version ${versionNumber} created`
    });
    
    await entity.save();
    res.json(entity);
  } catch (error) {
    next(error);
  }
};

// Get versions (only if owned by user)
exports.getVersions = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    // تحقق من وجود المستخدم في الـ req (من authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const entity = await Entity.findOne({
      _id: req.params.id,
      owner: req.user.id // التأكد من أن المستخدم يملك الكيان
    });
    
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    res.json(entity.versions || []);
  } catch (error) {
    next(error);
  }
};

// Compare versions (only if owned by user)
exports.compareVersions = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    // تحقق من وجود المستخدم في الـ req (من authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const entity = await Entity.findOne({
      _id: req.params.id,
      owner: req.user.id // التأكد من أن المستخدم يملك الكيان
    });
    
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    const { from, to } = req.query;
    const versions = entity.versions || [];
    
    const fromVersion = versions.find(v => v.versionNumber === parseInt(from));
    const toVersion = versions.find(v => v.versionNumber === parseInt(to));
    
    if (!fromVersion || !toVersion) {
      return res.status(400).json({ error: 'Invalid version numbers' });
    }
    
    res.json({
      from: fromVersion,
      to: toVersion,
      differences: {
        title: fromVersion.content?.title !== toVersion.content?.title,
        description: fromVersion.content?.description !== toVersion.content?.description,
        type: fromVersion.content?.type !== toVersion.content?.type
      }
    });
  } catch (error) {
    next(error);
  }
};