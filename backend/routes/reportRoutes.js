const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET /api/reports/export/csv - Export CSV
router.get('/export/csv', reportController.exportCSV);

// GET /api/reports/export/pdf - Export PDF
router.get('/export/pdf', reportController.exportPDF);

module.exports = router;

