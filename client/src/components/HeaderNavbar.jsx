import React from 'react';
import { X, Menu, Sun, Moon, LogOut, Users } from 'lucide-react';

const HeaderNavbar = ({
  isMenuOpen,
  toggleMenu,
  isDarkMode,
  toggleTheme,
  handleLogout,
  getAlertColor,
  getAlertText,
  getAlertTextColor
}) => {
  return (
    <header className={`relative z-20 px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className="text-xl font-bold">CrowdSafe</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-700'} transition-colors`}
            onClick={toggleTheme}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-red-400' : 'bg-gray-100 hover:bg-gray-200 text-red-500'} transition-colors`}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span className="text-sm font-medium ml-1">Logout</span>
          </button>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getAlertColor()} text-white transition-colors duration-500`}>
            <Users size={18} />
            <span className="text-sm font-medium">{getAlertText()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNavbar;
