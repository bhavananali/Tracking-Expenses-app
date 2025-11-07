const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./user.route');
const expenseRoutes = require('./expense.route');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Expense Tracker API is running!',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/users', userRoutes);
router.use('/expenses', expenseRoutes);

// Handle undefined routes
router.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

module.exports = router;