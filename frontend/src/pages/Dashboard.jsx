import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, DollarSign, PieChart, Calendar } from 'lucide-react';
import { expenseAPI } from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryResponse, expensesResponse] = await Promise.all([
        expenseAPI.getSummary(),
        expenseAPI.getAll({ limit: 5 })
      ]);

      setSummary(summaryResponse.data.data);
      setRecentExpenses(expensesResponse.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatCompactNumber = (number) => {
    if (number >= 1000000) {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(number);
    }
    return new Intl.NumberFormat('en-US').format(number);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your expense tracker</p>
        </div>
        <Link
          to="/add-expense"
          className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </Link>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Expenses Card */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Total Expenses</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(summary.totalExpenses)}
                </p>
              </div>
            </div>
          </div>

          {/* Total Transactions Card */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Total Transactions</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {formatCompactNumber(summary.totalCount)}
                </p>
              </div>
            </div>
          </div>

          {/* Categories Card */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">Categories</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {formatCompactNumber(summary.categorySummary.length)}
                </p>
              </div>
            </div>
          </div>

          {/* This Month Card */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">This Month</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(summary.totalExpenses)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
            <Link
              to="/expenses"
              className="text-sm text-primary-600 hover:text-primary-500 whitespace-nowrap"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className={`flex-shrink-0 w-3 h-3 rounded-full ${
                      expense.category === 'Food' ? 'bg-green-500' :
                      expense.category === 'Transportation' ? 'bg-blue-500' :
                      expense.category === 'Entertainment' ? 'bg-purple-500' :
                      expense.category === 'Utilities' ? 'bg-yellow-500' :
                      expense.category === 'Healthcare' ? 'bg-red-500' :
                      expense.category === 'Shopping' ? 'bg-pink-500' :
                      expense.category === 'Education' ? 'bg-indigo-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{expense.title}</p>
                      <p className="text-sm text-gray-500 truncate">{expense.category}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right ml-3">
                    <p className="font-semibold text-gray-900 whitespace-nowrap">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(expense.date)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No expenses yet</p>
            )}
          </div>
        </div>

        {/* Category Summary */}
        {summary && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
            <div className="space-y-3">
              {summary.categorySummary.map((category) => (
                <div key={category.category} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700 truncate flex-1 pr-2">
                      {category.category}
                    </span>
                    <span className="text-gray-900 whitespace-nowrap flex-shrink-0">
                      {formatCurrency(category.total)} 
                      <span className="text-gray-500 ml-1">
                        ({category.percentage}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(category.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;