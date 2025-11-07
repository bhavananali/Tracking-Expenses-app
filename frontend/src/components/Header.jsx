import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Right side - User info and notifications */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user?.username}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900 ml-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;