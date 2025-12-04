const express = require('express');
const router = express.Router();
const entityController = require('../controllers/entityController');

// GET /api/entities - List all entities
router.get('/', entityController.getAllEntities);

// POST /api/entities - Create new entity
router.post('/', entityController.createEntity);

// GET /api/entities/:id - Get entity details
router.get('/:id', entityController.getEntityById);

// PATCH /api/entities/:id/status - Change status
router.patch('/:id/status', entityController.changeStatus);

// POST /api/entities/:id/comments - Add comment
router.post('/:id/comments', entityController.addComment);

// POST /api/entities/:id/versions - Create new version
router.post('/:id/versions', entityController.createVersion);

// GET /api/entities/:id/versions - Get versions
router.get('/:id/versions', entityController.getVersions);

// GET /api/entities/:id/versions/compare - Compare versions
router.get('/:id/versions/compare', entityController.compareVersions);

module.exports = router;

