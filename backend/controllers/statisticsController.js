const Entity = require('../models/entityModel');
const mongoose = require('mongoose');
const {
  computeStatusDistribution,
  computeAverageTimePerStatus,
  computeSuccessRate,
  computeStagesCountPerEntity,
  computeUserActivityHeatmap
} = require('../utils/statsUtils');

// Get summary KPIs for current user only
exports.getSummary = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        totalActiveEntities: 0,
        totalReviewsToday: 0,
        totalReviewsThisWeek: 0,
        successRate: 0
      });
    }
    
    // تحقق من وجود المستخدم في الـ req (من authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // جلب كيانات المستخدم فقط
    const entities = await Entity.find({ owner: req.user.id });
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Count reviews today (status changes today)
    const reviewsToday = entities.reduce((count, entity) => {
      return count + entity.statusHistory.filter(
        sh => new Date(sh.changedAt) >= today
      ).length;
    }, 0);

    // Count reviews this week
    const reviewsThisWeek = entities.reduce((count, entity) => {
      return count + entity.statusHistory.filter(
        sh => new Date(sh.changedAt) >= weekAgo
      ).length;
    }, 0);

    const successRate = computeSuccessRate(entities);

    res.json({
      totalActiveEntities: entities.length,
      totalReviewsToday: reviewsToday,
      totalReviewsThisWeek: reviewsThisWeek,
      successRate: successRate
    });
  } catch (error) {
    next(error);
  }
};

// Get detailed analytics for current user only
exports.getAnalytics = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        averageTimePerStatus: {},
        averageNumberOfStatesPerEntity: 0,
        minStatesPerEntity: 0,
        maxStatesPerEntity: 0,
        successRate: 0,
        distributionByStatus: {},
        stagesCountPerEntity: {},
        userActivityOverTime: {}
      });
    }
    
    // تحقق من وجود المستخدم في الـ req (من authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // جلب كيانات المستخدم فقط
    const entities = await Entity.find({ owner: req.user.id });

    const statusDistribution = computeStatusDistribution(entities);
    const averageTimePerStatus = computeAverageTimePerStatus(entities);
    const successRate = computeSuccessRate(entities);
    const stagesCountPerEntity = computeStagesCountPerEntity(entities);
    const userActivityHeatmap = computeUserActivityHeatmap(entities);

    res.json({
      averageTimePerStatus,
      averageNumberOfStatesPerEntity: stagesCountPerEntity.average,
      minStatesPerEntity: stagesCountPerEntity.min,
      maxStatesPerEntity: stagesCountPerEntity.max,
      successRate,
      distributionByStatus: statusDistribution,
      stagesCountPerEntity: stagesCountPerEntity.distribution,
      userActivityOverTime: userActivityHeatmap
    });
  } catch (error) {
    next(error);
  }
};