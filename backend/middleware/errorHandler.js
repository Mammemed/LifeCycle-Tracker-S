/**
 * Central error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.keys(err.errors || {}).forEach(key => {
      errors[key] = err.errors[key].message;
    });
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message,
      fields: errors
    });
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
      details: err.message
    });
  }

  // Mongoose connection error
  if (err.name === 'MongoServerError' || err.message?.includes('MongoServerError')) {
    return res.status(503).json({
      error: 'Database connection error',
      details: 'MongoDB is not available. Please check your connection.'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;

