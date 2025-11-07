import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Calendar, MoreVertical } from 'lucide-react';
import { expenseAPI } from '../services/api';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const navigate = useNavigate();

  const categories = [
    'All', 'Food', 'Transportation', 'Entertainment', 
    'Utilities', 'Healthcare', 'Shopping', 'Education', 'Other'
  ];

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.category && filters.category !== 'All') {
        params.category = filters.category;
      }
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await expenseAPI.getAll(params);
      setExpenses(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.delete(id);
        fetchExpenses(); // Refresh the list
        setMobileMenuOpen(null); // Close mobile menu
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-green-100 text-green-800',
      Transportation: 'bg-blue-100 text-blue-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Utilities: 'bg-yellow-100 text-yellow-800',
      Healthcare: 'bg-red-100 text-red-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Education: 'bg-indigo-100 text-indigo-800',
      Other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.Other;
  };

  // Mobile-friendly expense card component - Layout Option 1
  const ExpenseCard = ({ expense }) => {
    const handleEditClick = (e) => {
      e.stopPropagation();
      setMobileMenuOpen(null);
      navigate(`/edit-expense/${expense._id}`);
    };

    const handleDeleteClick = (e) => {
      e.stopPropagation();
      handleDelete(expense._id);
    };

    return (
      <div className="expense-card">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{expense.title}</h3>
            {expense.description && (
              <p className="text-gray-600 text-sm mt-1">{expense.description}</p>
            )}
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(mobileMenuOpen === expense._id ? null : expense._id);
              }}
              className="btn-mobile"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            
            {mobileMenuOpen === expense._id && (
              <div 
                className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-20 mobile-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-1">
                  <button
                    onClick={handleEditClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Updated layout with date on new line - Layout Option 1 */}
        <div className="flex flex-col space-y-2">
          {/* First row: Category and Amount */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                {expense.category}
              </span>
            </div>
            <span className="font-semibold text-gray-900 text-lg">
              {formatCurrency(expense.amount)}
            </span>
          </div>
          
          {/* Second row: Date only */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500">
              {formatDate(expense.date)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Expenses</h1>
          <p className="text-gray-600">Manage your expenses</p>
        </div>
        <Link
          to="/add-expense"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Expense</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search by Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by Title
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
                placeholder="Search by expense title..."
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="input-field"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={clearFilters}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : expenses.length > 0 ? (
          <>
            {/* Mobile View - Cards */}
            <div className="block md:hidden">
              {expenses.map((expense) => (
                <ExpenseCard key={expense._id} expense={expense} />
              ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {expense.title}
                          </div>
                          {expense.description && (
                            <div className="text-sm text-gray-500">
                              {expense.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/edit-expense/${expense._id}`}
                            className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
            <p className="text-gray-500 mb-4">
              {Object.values(filters).some(val => val) 
                ? 'Try adjusting your filters' 
                : 'Get started by adding your first expense'
              }
            </p>
            <Link
              to="/add-expense"
              className="btn-primary"
            >
              Add Your First Expense
            </Link>
          </div>
        )}
      </div>

      {/* Close mobile menu when clicking outside */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => setMobileMenuOpen(null)}
        ></div>
      )}
    </div>
  );
};

export default Expenses;