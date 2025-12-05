const Entity = require('../models/entityModel');
const mongoose = require('mongoose');

// Export CSV (only for current user)
exports.exportCSV = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    // تحقق من وجود المستخدم في الـ req (من authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // جلب كيانات المستخدم فقط
    const entities = await Entity.find({ owner: req.user.id })
      .select('title type currentStatus createdAt updatedAt');
    
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

// Export PDF (only for current user)
exports.exportPDF = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    // تحقق من وجود المستخدم في الـ req (من authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // جلب كيانات المستخدم فقط
    const entities = await Entity.find({ owner: req.user.id });
    
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