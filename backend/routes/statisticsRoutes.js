const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

// GET /api/statistics/summary - Get summary KPIs
router.get('/summary', statisticsController.getSummary);

// GET /api/statistics/analytics - Get detailed analytics
router.get('/analytics', statisticsController.getAnalytics);

module.exports = router;

