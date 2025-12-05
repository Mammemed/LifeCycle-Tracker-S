/**
 * Compute status distribution (for pie chart)
 */
function computeStatusDistribution(entities) {
  const distribution = {};
  entities.forEach(entity => {
    const status = entity.currentStatus;
    distribution[status] = (distribution[status] || 0) + 1;
  });
  return distribution;
}

/**
 * Compute average time spent in each status
 */
function computeAverageTimePerStatus(entities) {
  const statusTimes = {};
  const statusCounts = {};

  entities.forEach(entity => {
    const history = entity.statusHistory;
    if (history.length < 2) return;

    for (let i = 0; i < history.length - 1; i++) {
      const current = history[i];
      const next = history[i + 1];
      const timeSpent = new Date(next.changedAt) - new Date(current.changedAt);
      const status = current.toStatus;

      if (!statusTimes[status]) {
        statusTimes[status] = 0;
        statusCounts[status] = 0;
      }
      statusTimes[status] += timeSpent;
      statusCounts[status]++;
    }
  });

  const averages = {};
  Object.keys(statusTimes).forEach(status => {
    averages[status] = statusCounts[status] > 0
      ? statusTimes[status] / statusCounts[status] / (1000 * 60 * 60 * 24) // Convert to days
      : 0;
  });

  return averages;
}

/**
 * Compute success rate (entities in final states vs total)
 */
function computeSuccessRate(entities) {
  if (entities.length === 0) return 0;

  const finalStates = ['approved', 'published', 'completed', 'accepted'];
  const successful = entities.filter(e => finalStates.includes(e.currentStatus)).length;
  return (successful / entities.length) * 100;
}

/**
 * Compute stages count per entity (for bar chart)
 */
function computeStagesCountPerEntity(entities) {
  const counts = entities.map(e => e.statusHistory.length);
  const average = counts.length > 0
    ? counts.reduce((a, b) => a + b, 0) / counts.length
    : 0;
  const min = counts.length > 0 ? Math.min(...counts) : 0;
  const max = counts.length > 0 ? Math.max(...counts) : 0;

  // Distribution for bar chart
  const distribution = {};
  counts.forEach(count => {
    distribution[count] = (distribution[count] || 0) + 1;
  });

  return { average, min, max, distribution };
}

/**
 * Compute user activity heatmap (simplified - by day)
 */
function computeUserActivityHeatmap(entities) {
  const activityMap = {};
  const now = new Date();
  const daysBack = 30; // Last 30 days

  // Initialize last 30 days
  for (let i = 0; i < daysBack; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    activityMap[dateKey] = 0;
  }

  // Count activities per day
  entities.forEach(entity => {
    entity.statusHistory.forEach(entry => {
      const dateKey = new Date(entry.changedAt).toISOString().split('T')[0];
      if (activityMap.hasOwnProperty(dateKey)) {
        activityMap[dateKey]++;
      }
    });

    entity.comments.forEach(comment => {
      const dateKey = new Date(comment.createdAt).toISOString().split('T')[0];
      if (activityMap.hasOwnProperty(dateKey)) {
        activityMap[dateKey]++;
      }
    });
  });

  return activityMap;
}

/**
 * Predict success probability based on status history and patterns
 */
function predictSuccessProbability(entity, allEntities) {
  const finalStates = ['approved', 'published', 'completed', 'accepted'];
  
  // If already in final state, 100% success
  if (finalStates.includes(entity.currentStatus)) {
    return {
      probability: 100,
      confidence: 'high',
      reasoning: 'Entity is already in a final state'
    };
  }

  // Get similar entities (same type)
  const similarEntities = allEntities.filter(e => 
    e.type === entity.type && e._id.toString() !== entity._id.toString()
  );

  if (similarEntities.length === 0) {
    return {
      probability: 50,
      confidence: 'low',
      reasoning: 'No similar entities found for comparison'
    };
  }

  // Calculate success rate for similar entities
  const successfulSimilar = similarEntities.filter(e => 
    finalStates.includes(e.currentStatus)
  ).length;
  const baseProbability = (successfulSimilar / similarEntities.length) * 100;

  // Adjust based on current status
  let statusMultiplier = 1.0;
  const statusWeights = {
    'draft': 0.3,
    'in_preparation': 0.4,
    'submitted': 0.6,
    'in_review': 0.75,
    'approved': 1.0,
    'rejected': 0.1
  };
  statusMultiplier = statusWeights[entity.currentStatus] || 0.5;

  // Adjust based on progress (number of transitions)
  const progressMultiplier = Math.min(1.0, entity.statusHistory.length / 5);

  // Adjust based on time in current status (too long = lower probability)
  let timeMultiplier = 1.0;
  if (entity.statusHistory.length > 0) {
    const lastChange = new Date(entity.statusHistory[entity.statusHistory.length - 1].changedAt);
    const daysInStatus = (new Date() - lastChange) / (1000 * 60 * 60 * 24);
    if (daysInStatus > 30) {
      timeMultiplier = 0.7; // Stuck in status too long
    } else if (daysInStatus > 14) {
      timeMultiplier = 0.85;
    }
  }

  // Calculate final probability
  let probability = baseProbability * statusMultiplier * progressMultiplier * timeMultiplier;
  probability = Math.min(100, Math.max(0, probability));

  // Determine confidence
  let confidence = 'medium';
  if (similarEntities.length >= 10) {
    confidence = 'high';
  } else if (similarEntities.length < 3) {
    confidence = 'low';
  }

  return {
    probability: Math.round(probability),
    confidence,
    reasoning: `Based on ${similarEntities.length} similar entities. Current status: ${entity.currentStatus}, Progress: ${entity.statusHistory.length} transitions`
  };
}

/**
 * Estimate time remaining until approval/completion
 */
function estimateTimeRemaining(entity, allEntities) {
  const finalStates = ['approved', 'published', 'completed', 'accepted'];
  
  // If already in final state, no time remaining
  if (finalStates.includes(entity.currentStatus)) {
    return {
      daysRemaining: 0,
      estimatedDate: null,
      confidence: 'high',
      reasoning: 'Entity is already in a final state'
    };
  }

  // Get average time to completion for similar entities
  const similarEntities = allEntities.filter(e => 
    e.type === entity.type && 
    finalStates.includes(e.currentStatus) &&
    e._id.toString() !== entity._id.toString()
  );

  if (similarEntities.length === 0) {
    // Fallback: estimate based on typical workflow
    const typicalDays = {
      'draft': 21,
      'in_preparation': 14,
      'submitted': 10,
      'in_review': 7,
      'rejected': 14
    };
    const defaultDays = typicalDays[entity.currentStatus] || 14;

    return {
      daysRemaining: defaultDays,
      estimatedDate: new Date(Date.now() + defaultDays * 24 * 60 * 60 * 1000),
      confidence: 'low',
      reasoning: 'No similar completed entities found. Using default estimates.'
    };
  }

  // Calculate average time to completion
  let totalTimeToCompletion = 0;
  let validCount = 0;

  similarEntities.forEach(similarEntity => {
    if (similarEntity.statusHistory.length > 0) {
      const creationTime = new Date(similarEntity.createdAt);
      const completionEntry = similarEntity.statusHistory.find(sh => 
        finalStates.includes(sh.toStatus)
      );
      
      if (completionEntry) {
        const completionTime = new Date(completionEntry.changedAt);
        const totalDays = (completionTime - creationTime) / (1000 * 60 * 60 * 24);
        totalTimeToCompletion += totalDays;
        validCount++;
      }
    }
  });

  if (validCount === 0) {
    return {
      daysRemaining: 14,
      estimatedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      confidence: 'low',
      reasoning: 'Unable to calculate from similar entities'
    };
  }

  const averageTimeToCompletion = totalTimeToCompletion / validCount;

  // Calculate time already spent
  const creationTime = new Date(entity.createdAt);
  const timeSpent = (new Date() - creationTime) / (1000 * 60 * 60 * 24);

  // Estimate remaining time
  const daysRemaining = Math.max(0, averageTimeToCompletion - timeSpent);

  // Adjust based on current status progress
  const typicalStatusFlow = ['draft', 'in_preparation', 'submitted', 'in_review', 'approved'];
  const currentIndex = typicalStatusFlow.indexOf(entity.currentStatus);
  
  if (currentIndex >= 0) {
    const progressPercent = (currentIndex + 1) / typicalStatusFlow.length;
    const adjustedRemaining = daysRemaining * (1 - progressPercent * 0.3);
    const estimatedDate = new Date(Date.now() + adjustedRemaining * 24 * 60 * 60 * 1000);
    
    let confidence = 'medium';
    if (validCount >= 10) confidence = 'high';
    else if (validCount < 3) confidence = 'low';

    return {
      daysRemaining: Math.round(adjustedRemaining * 10) / 10,
      estimatedDate,
      confidence,
      reasoning: `Based on ${validCount} similar entities. Average completion time: ${Math.round(averageTimeToCompletion)} days. Current progress: ${currentIndex + 1}/${typicalStatusFlow.length} stages.`
    };
  }

  // Fallback
  const estimatedDate = new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000);
  return {
    daysRemaining: Math.round(daysRemaining * 10) / 10,
    estimatedDate,
    confidence: 'medium',
    reasoning: `Based on ${validCount} similar entities. Average completion time: ${Math.round(averageTimeToCompletion)} days.`
  };
}

/**
 * Generate predictions for all entities
 */
function generatePredictions(allEntities) {
  const predictions = [];

  allEntities.forEach(entity => {
    const successPrediction = predictSuccessProbability(entity, allEntities);
    const timePrediction = estimateTimeRemaining(entity, allEntities);

    predictions.push({
      entityId: entity._id.toString(),
      title: entity.title,
      type: entity.type,
      currentStatus: entity.currentStatus,
      successProbability: successPrediction.probability,
      successConfidence: successPrediction.confidence,
      successReasoning: successPrediction.reasoning,
      daysRemaining: timePrediction.daysRemaining,
      estimatedCompletionDate: timePrediction.estimatedDate,
      timeConfidence: timePrediction.confidence,
      timeReasoning: timePrediction.reasoning,
      transitionsCount: entity.statusHistory.length,
      createdAt: entity.createdAt
    });
  });

  return predictions;
}

module.exports = {
  computeStatusDistribution,
  computeAverageTimePerStatus,
  computeSuccessRate,
  computeStagesCountPerEntity,
  computeUserActivityHeatmap,
  predictSuccessProbability,
  estimateTimeRemaining,
  generatePredictions
};

