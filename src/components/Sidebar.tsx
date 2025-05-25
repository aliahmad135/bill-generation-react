import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Building2, FileText, AlertCircle, ListFilter, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-blue-700">Housing Society</h1>
      </div>
      
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
            end
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/house-registration" 
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Building2 className="mr-3 h-5 w-5" />
            House Registration
          </NavLink>
          
          <NavLink 
            to="/bill-management" 
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <FileText className="mr-3 h-5 w-5" />
            Bill Management
          </NavLink>
          
          <NavLink 
            to="/fine-management" 
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <AlertCircle className="mr-3 h-5 w-5" />
            Fine Management
          </NavLink>
          
          <NavLink 
            to="/house-listing" 
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <ListFilter className="mr-3 h-5 w-5" />
            House Listing
          </NavLink>
        </nav>
        
        <div className="px-2 py-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;