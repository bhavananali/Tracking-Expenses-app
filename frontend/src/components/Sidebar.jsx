import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, DollarSign, PlusCircle, PieChart } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'All Expenses', href: '/expenses', icon: DollarSign },
    { name: 'Add Expense', href: '/add-expense', icon: PlusCircle },
    { name: 'Statistics', href: '/statistics', icon: PieChart },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 flex z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 flex flex-col z-50 w-64 bg-white shadow-xl transform transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">ExpenseTracker</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Icon className={`w-5 h-5 mr-3 ${
                  window.location.pathname === item.href 
                    ? 'text-primary-600' 
                    : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full">
              <PieChart className="w-4 h-4" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Track Smart</p>
              <p className="text-xs text-gray-500">Save More</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;