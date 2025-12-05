const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const entityRoutes = require('./routes/entityRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Server will continue without MongoDB (database operations will fail)');
    console.log('💡 To fix: Install MongoDB or use MongoDB Atlas and update MONGO_URI in config.js');
  });

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/entities', entityRoutes);
app.use('/api/statistics', require('./routes/statisticsRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const stateNames = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: {
      state: mongoState,
      stateName: stateNames[mongoState] || 'unknown',
      connected: mongoState === 1
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop the other process or change the port.`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

