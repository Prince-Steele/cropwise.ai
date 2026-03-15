const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const errorHandler = require('./middleware/error.middleware');

// Import routes (will be created in next step)
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const marketRoutes = require('./routes/market.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: env.frontendUrl,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/ai', aiRoutes);

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.originalUrl}`
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
