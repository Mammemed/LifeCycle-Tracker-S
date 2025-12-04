require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/lifecycle-tracker',
  nodeEnv: process.env.NODE_ENV || 'development'
};
