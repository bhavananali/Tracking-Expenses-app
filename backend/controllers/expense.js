const Expense = require('../models/expense.model');

const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    // Basic validation
    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, amount, category, and date'
      });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      description: description || '',
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating expense',
      error: error.message
    });
  }
};


const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, search, page = 1, limit = 10 } = req.query;

    // Build filter object
    let filter = { user: req.user._id };

    // Filter by category
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Filter by search term (title or description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } }, // Case-insensitive search in title
        { description: { $regex: search, $options: 'i' } } // Case-insensitive search in description
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const expenses = await Expense.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Expense.countDocuments(filter);

    res.json({
      success: true,
      data: expenses,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalExpenses: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expenses',
      error: error.message
    });
  }
};

// Get single expense by ID
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('Get expense by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expense',
      error: error.message
    });
  }
};

//Update an expense
const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    let expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Update expense fields
    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    expense.description = description !== undefined ? description : expense.description;

    const updatedExpense = await expense.save();

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating expense',
      error: error.message
    });
  }
};

//Delete an expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      message: 'Expense deleted successfully',
      data: expense
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting expense',
      error: error.message
    });
  }
};

//Get expense statistics (total and category-wise)
const getExpenseSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Get expenses with date filter
    const expenses = await Expense.find({
      user: req.user._id,
      ...dateFilter
    });

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate category-wise summary
    const categorySummary = expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      if (!acc[category]) {
        acc[category] = { total: 0, count: 0 };
      }
      acc[category].total += amount;
      acc[category].count += 1;
      return acc;
    }, {});

    // Convert to array and calculate percentages
    const categoryArray = Object.keys(categorySummary).map(category => ({
      category,
      total: categorySummary[category].total,
      count: categorySummary[category].count,
      percentage: totalExpenses > 0 ? 
        parseFloat((categorySummary[category].total / totalExpenses * 100).toFixed(1)) : 0
    }));

    // Sort by total amount (descending)
    categoryArray.sort((a, b) => b.total - a.total);

    res.json({
      success: true,
      data: {
        totalExpenses,
        categorySummary: categoryArray,
        totalCount: expenses.length
      }
    });
  } catch (error) {
    console.error('Get expense summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expense summary',
      error: error.message
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary
};