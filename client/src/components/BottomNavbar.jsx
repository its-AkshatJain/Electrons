import React from 'react';
import { MapIcon, Bell, Shield } from 'lucide-react';

const BottomNavbar = ({ currentTab, setCurrentTab, isDarkMode }) => {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-100 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-around">
        <button 
          className={`flex flex-col items-center py-3 px-6 ${
            currentTab === 'map'
              ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
              : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
          } transition-colors`}
          onClick={() => setCurrentTab('map')}
        >
          <MapIcon size={20} />
          <span className="text-xs mt-1">Map</span>
        </button>
        
        <button 
          className={`flex flex-col items-center py-3 px-6 ${
            currentTab === 'alerts'
              ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
              : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
          } transition-colors`}
          onClick={() => setCurrentTab('alerts')}
        >
          <Bell size={20} />
          <span className="text-xs mt-1">Alerts</span>
        </button>
        
        <button 
          className={`flex flex-col items-center py-3 px-6 ${
            currentTab === 'safety'
              ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
              : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
          } transition-colors`}
          onClick={() => setCurrentTab('safety')}
        >
          <Shield size={20} />
          <span className="text-xs mt-1">Safety</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavbar;
