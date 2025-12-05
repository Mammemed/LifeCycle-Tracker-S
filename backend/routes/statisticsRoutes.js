const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middleware/authMiddleware');

// تطبيق authMiddleware على جميع مسارات الإحصائيات
router.use(authMiddleware);

// GET /api/statistics/summary - Get summary KPIs for current user
router.get('/summary', statisticsController.getSummary);

// GET /api/statistics/analytics - Get detailed analytics for current user
router.get('/analytics', statisticsController.getAnalytics);

module.exports = router;