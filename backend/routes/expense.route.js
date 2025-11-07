const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary
} = require('../controllers/expense');

const { protect } = require('../middlewares/authmiddleware');

// All routes are protected (require authentication)
router.use(protect);

//Create a new expense
router.post('/', createExpense);

//Get all expenses for logged-in user
router.get('/', getExpenses);

//Get expense statistics and summary
router.get('/statistics/summary', getExpenseSummary);

//Get single expense by ID
router.get('/:id', getExpenseById);

//Update an expense
router.put('/:id', updateExpense);

//Delete an expense
router.delete('/:id', deleteExpense);

module.exports = router;