require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import database connection
const connectDB = require('./config/database.js');

// Import routes
const questionRoutes = require('./routes/questions.js');
const scoreRoutes = require('./routes/scores.js');
const gameRoutes = require('./routes/game.js');
const userRoutes = require('./routes/users.js');

// Import middleware
const errorHandler = require('./middleware/errorHandler.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (for potential frontend build)
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/questions', questionRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TriviaSwift Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TriviaSwift API',
    version: '1.0.0',
    endpoints: {
      questions: '/api/questions',
      scores: '/api/scores',
      game: '/api/game',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TriviaSwift Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
