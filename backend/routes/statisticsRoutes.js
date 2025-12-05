const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

// GET /api/statistics/summary - Get summary KPIs
router.get('/summary', statisticsController.getSummary);

// GET /api/statistics/analytics - Get detailed analytics
router.get('/analytics', statisticsController.getAnalytics);

// GET /api/statistics/predictions - Get AI predictions for all entities
router.get('/predictions', statisticsController.getPredictions);

// GET /api/statistics/predictions/:id - Get prediction for a specific entity
router.get('/predictions/:id', statisticsController.getEntityPrediction);

module.exports = router;

