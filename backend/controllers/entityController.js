const Entity = require('../models/entityModel');
const mongoose = require('mongoose');

// Get all entities (with basic info)
exports.getAllEntities = async (req, res, next) => {
  try {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json([]); // Return empty array if DB not connected
    }
    const entities = await Entity.find({})
      .select('title description type currentStatus createdAt updatedAt')
      .sort({ updatedAt: -1 });
    res.json(entities);
  } catch (error) {
    console.error('Error getting entities:', error);
    res.json([]); // Return empty array on error for demo
  }
};

// Get single entity with full details
exports.getEntityById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const entity = await Entity.findById(req.params.id);
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    res.json(entity);
  } catch (error) {
    next(error);
  }
};

// Create new entity
exports.createEntity = async (req, res, next) => {
  try {
    // Check MongoDB connection state
    const connectionState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    console.log('MongoDB connection state:', connectionState);
    
    if (connectionState !== 1) {
      const stateMessages = {
        0: 'disconnected',
        2: 'connecting',
        3: 'disconnecting'
      };
      return res.status(503).json({ 
        error: 'Database not connected',
        details: `MongoDB is ${stateMessages[connectionState] || 'not available'}. Please start MongoDB or wait for connection.`,
        connectionState
      });
    }

    const { title, description, initialStatus = 'draft', type = 'article' } = req.body;
    console.log('Creating entity with data:', { title, description, initialStatus, type });

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and cannot be empty' });
    }

    // Initialize with first status history entry
    const statusHistory = [{
      fromStatus: null,
      toStatus: initialStatus,
      changedAt: new Date(),
      changedBy: req.body.createdBy || 'System',
      comment: 'Initial status'
    }];

    // Initialize with version 1
    const versions = [{
      versionNumber: 1,
      content: { 
        title: title || '', 
        description: description || '', 
        type: type || 'article' 
      },
      createdAt: new Date(),
      createdBy: req.body.createdBy || 'System',
      changeSummary: 'Initial version'
    }];

    // Initialize with first contributor if provided
    const contributors = req.body.createdBy ? [{
      name: req.body.createdBy,
      role: 'author',
      lastActiveAt: new Date()
    }] : [];

    const entity = new Entity({
      title,
      description: description || '',
      type,
      currentStatus: initialStatus,
      statusHistory,
      versions,
      contributors
    });

    await entity.save();
    res.status(201).json(entity);
  } catch (error) {
    console.error('Error creating entity:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    next(error);
  }
};

// Change entity status
exports.changeStatus = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please start MongoDB.' });
    }
    const { toStatus, changedBy, comment } = req.body;
    const entity = await Entity.findById(req.params.id);

    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    if (!toStatus || !changedBy) {
      return res.status(400).json({ error: 'toStatus and changedBy are required' });
    }

    // Add to status history
    entity.statusHistory.push({
      fromStatus: entity.currentStatus,
      toStatus,
      changedAt: new Date(),
      changedBy,
      comment: comment || ''
    });

    // Update current status
    entity.currentStatus = toStatus;
    entity.updatedAt = new Date();

    await entity.save();
    res.json(entity);
  } catch (error) {
    next(error);
  }
};

// Add comment
exports.addComment = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please start MongoDB.' });
    }
    const { author, text, linkedToVersion, linkedToStatus } = req.body;
    const entity = await Entity.findById(req.params.id);

    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    if (!author || !text) {
      return res.status(400).json({ error: 'author and text are required' });
    }

    entity.comments.push({
      author,
      text,
      createdAt: new Date(),
      linkedToVersion: linkedToVersion || null,
      linkedToStatus: linkedToStatus || null
    });

    entity.updatedAt = new Date();
    await entity.save();
    res.json(entity);
  } catch (error) {
    next(error);
  }
};

// Create new version
exports.createVersion = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please start MongoDB.' });
    }
    const { content, createdBy, changeSummary } = req.body;
    const entity = await Entity.findById(req.params.id);

    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    if (!createdBy) {
      return res.status(400).json({ error: 'createdBy is required' });
    }

    // Get next version number
    const nextVersionNumber = entity.versions.length > 0
      ? Math.max(...entity.versions.map(v => v.versionNumber)) + 1
      : 1;

    // Ensure content is properly formatted
    const versionContent = content ? {
      title: content.title || entity.title || '',
      description: content.description || entity.description || '',
      type: content.type || entity.type || 'article'
    } : {
      title: entity.title || '',
      description: entity.description || '',
      type: entity.type || 'article'
    };

    entity.versions.push({
      versionNumber: nextVersionNumber,
      content: versionContent,
      createdAt: new Date(),
      createdBy,
      changeSummary: changeSummary || `Version ${nextVersionNumber}`
    });

    // Update entity fields if content provided
    if (content) {
      if (content.title) entity.title = content.title;
      if (content.description) entity.description = content.description;
      if (content.type) entity.type = content.type;
    }

    entity.updatedAt = new Date();
    await entity.save();
    res.json(entity);
  } catch (error) {
    next(error);
  }
};

// Get versions
exports.getVersions = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const entity = await Entity.findById(req.params.id);
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    res.json(entity.versions);
  } catch (error) {
    next(error);
  }
};

// Compare versions
exports.compareVersions = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const { from, to } = req.query;
    const entity = await Entity.findById(req.params.id);

    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    const versionFrom = entity.versions.find(v => v.versionNumber === parseInt(from));
    const versionTo = entity.versions.find(v => v.versionNumber === parseInt(to));

    if (!versionFrom || !versionTo) {
      return res.status(400).json({ error: 'Invalid version numbers' });
    }

    res.json({
      from: versionFrom,
      to: versionTo,
      differences: {
        title: versionFrom.content.title !== versionTo.content.title,
        description: versionFrom.content.description !== versionTo.content.description,
        type: versionFrom.content.type !== versionTo.content.type
      }
    });
  } catch (error) {
    next(error);
  }
};

