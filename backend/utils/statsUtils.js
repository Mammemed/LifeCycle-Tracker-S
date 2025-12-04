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

module.exports = {
  computeStatusDistribution,
  computeAverageTimePerStatus,
  computeSuccessRate,
  computeStagesCountPerEntity,
  computeUserActivityHeatmap
};

