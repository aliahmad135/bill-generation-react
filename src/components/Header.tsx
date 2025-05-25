import React, { useState } from 'react';
import { Menu, Bell, User, Search, X, AlignJustify } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <AlignJustify className="h-6 w-6" />
          </button>
          
          {/* Search */}
          <div className="hidden md:flex md:flex-1 max-w-xl relative mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search houses, residents..."
              />
            </div>
          </div>
          
          {/* User menu */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="relative">
              <button
                className="flex items-center focus:outline-none"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">Admin User</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-900 bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <h1 className="text-lg font-semibold text-blue-700">Housing Society</h1>
              <button 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowMobileMenu(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Mobile search */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search houses, residents..."
                />
              </div>
            </div>
            
            {/* Mobile navigation */}
            <nav className="px-4 py-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-base font-medium text-blue-700 bg-blue-50 rounded-md">
                Dashboard
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                House Registration
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                Bill Management
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                Fine Management
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                House Listing
              </a>
            </nav>
            
            <div className="px-4 py-3 border-t border-gray-200">
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;