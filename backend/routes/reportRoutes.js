const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// تطبيق authMiddleware على جميع مسارات التقارير
router.use(authMiddleware);

// GET /api/reports/export/csv - Export CSV for current user
router.get('/export/csv', reportController.exportCSV);

// GET /api/reports/export/pdf - Export PDF for current user
router.get('/export/pdf', reportController.exportPDF);

module.exports = router;