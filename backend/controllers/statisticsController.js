const Entity = require('../models/entityModel');
const mongoose = require('mongoose');
const {
  computeStatusDistribution,
  computeAverageTimePerStatus,
  computeSuccessRate,
  computeStagesCountPerEntity,
  computeUserActivityHeatmap,
  generatePredictions,
  predictSuccessProbability,
  estimateTimeRemaining
} = require('../utils/statsUtils');

// Get summary KPIs
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
    const entities = await Entity.find({});
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

// Get detailed analytics
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
    const entities = await Entity.find({});

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

// Get AI predictions for all entities
exports.getPredictions = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        predictions: [],
        summary: {
          totalEntities: 0,
          averageSuccessProbability: 0,
          averageDaysRemaining: 0
        }
      });
    }

    const entities = await Entity.find({});
    const predictions = generatePredictions(entities);

    // Calculate summary statistics
    const totalEntities = predictions.length;
    const averageSuccessProbability = predictions.length > 0
      ? predictions.reduce((sum, p) => sum + p.successProbability, 0) / predictions.length
      : 0;
    const averageDaysRemaining = predictions.length > 0
      ? predictions.reduce((sum, p) => sum + (p.daysRemaining || 0), 0) / predictions.length
      : 0;

    res.json({
      predictions,
      summary: {
        totalEntities,
        averageSuccessProbability: Math.round(averageSuccessProbability * 10) / 10,
        averageDaysRemaining: Math.round(averageDaysRemaining * 10) / 10
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get prediction for a specific entity
exports.getEntityPrediction = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        successProbability: 50,
        successConfidence: 'low',
        daysRemaining: 14,
        estimatedCompletionDate: null,
        confidence: 'low'
      });
    }

    const entity = await Entity.findById(req.params.id);
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    const allEntities = await Entity.find({});
    const successPrediction = predictSuccessProbability(entity, allEntities);
    const timePrediction = estimateTimeRemaining(entity, allEntities);

    res.json({
      entityId: entity._id.toString(),
      title: entity.title,
      currentStatus: entity.currentStatus,
      successProbability: successPrediction.probability,
      successConfidence: successPrediction.confidence,
      successReasoning: successPrediction.reasoning,
      daysRemaining: timePrediction.daysRemaining,
      estimatedCompletionDate: timePrediction.estimatedDate,
      timeConfidence: timePrediction.confidence,
      timeReasoning: timePrediction.reasoning
    });
  } catch (error) {
    next(error);
  }
};

