const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Expense title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Expense category is required'],
    enum: {
      values: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Education', 'Other'],
      message: 'Category must be one of: Food, Transportation, Entertainment, Utilities, Healthcare, Shopping, Education, Other'
    }
  },
  date: {
    type: Date,
    required: [true, 'Expense date is required'],
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'Expense date cannot be in the future'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Expense must belong to a user']
  }
}, {
  timestamps: true
});

// Index for better query performance
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);