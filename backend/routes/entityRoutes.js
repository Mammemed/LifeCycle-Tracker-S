const express = require('express');
const router = express.Router();
const entityController = require('../controllers/entityController');
const authMiddleware = require('../middleware/authMiddleware');

// تطبيق authMiddleware على جميع مسارات الكيانات
router.use(authMiddleware);

// GET /api/entities - List user's entities only
router.get('/', entityController.getAllEntities);

// POST /api/entities - Create new entity for current user
router.post('/', entityController.createEntity);

// GET /api/entities/:id - Get entity details (only if owned by user)
router.get('/:id', entityController.getEntityById);

// PATCH /api/entities/:id/status - Change status (only if owned by user)
router.patch('/:id/status', entityController.changeStatus);

// POST /api/entities/:id/comments - Add comment (only if owned by user)
router.post('/:id/comments', entityController.addComment);

// POST /api/entities/:id/versions - Create new version (only if owned by user)
router.post('/:id/versions', entityController.createVersion);

// GET /api/entities/:id/versions - Get versions (only if owned by user)
router.get('/:id/versions', entityController.getVersions);

// GET /api/entities/:id/versions/compare - Compare versions (only if owned by user)
router.get('/:id/versions/compare', entityController.compareVersions);

module.exports = router;