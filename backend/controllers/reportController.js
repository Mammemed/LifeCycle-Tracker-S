const Entity = require('../models/entityModel');
const mongoose = require('mongoose');

// Export CSV (simple implementation)
exports.exportCSV = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const entities = await Entity.find({}).select('title type currentStatus createdAt updatedAt');
    
    // Simple CSV generation
    const headers = 'Title,Type,Status,Created At,Updated At\n';
    const rows = entities.map(e => 
      `"${e.title}","${e.type}","${e.currentStatus}","${e.createdAt}","${e.updatedAt}"`
    ).join('\n');
    
    const csv = headers + rows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=entities-export.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

// Export PDF (simple implementation - returns JSON for now, can be enhanced with PDF library)
exports.exportPDF = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const entities = await Entity.find({});
    
    // For demo purposes, return JSON
    // In production, use a library like pdfkit or puppeteer
    res.json({
      message: 'PDF export not fully implemented. Use CSV export for now.',
      data: entities,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

