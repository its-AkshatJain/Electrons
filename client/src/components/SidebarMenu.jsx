import React from 'react';
import { User, Settings, FileText, Shield, MapPin } from 'lucide-react';

const SidebarMenu = ({ isMenuOpen, isDarkMode, userLocation, requestLocationPermission }) => {
  return (
    <div className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-30 w-72 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl transition-transform duration-300 ease-in-out`}>
      <div className="flex flex-col h-full pt-16 pb-4">
        {/* Profile section */}
        <div className={`flex items-center justify-center py-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-blue-600 text-white">
              <User size={20} />
            </div>
            <div>
              <p className="font-semibold">User Name</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID: #456789</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 mt-6 px-4 space-y-1">
          <button className={`flex items-center w-full px-4 py-3 rounded-lg ${isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>
            <User size={18} className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span>Profile</span>
          </button>
          <button className={`flex items-center w-full px-4 py-3 rounded-lg ${isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>
            <Settings size={18} className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span>Settings</span>
          </button>
          <button className={`flex items-center w-full px-4 py-3 rounded-lg ${isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>
            <FileText size={18} className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span>Event Information</span>
          </button>
          <button className={`flex items-center w-full px-4 py-3 rounded-lg ${isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>
            <Shield size={18} className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span>Safety Guide</span>
          </button>
          
          {/* Location details */}
          {userLocation && (
            <div className={`mt-4 px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center mb-2">
                <MapPin size={18} className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="font-medium">Your Location</span>
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>Lat: {userLocation.latitude.toFixed(6)}</p>
                <p>Long: {userLocation.longitude.toFixed(6)}</p>
              </div>
            </div>
          )}
        </nav>
        
        {/* Footer */}
        <div className="px-6 mt-auto">
          <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md">
            Emergency Contact
          </button>
          <p className={`text-xs text-center mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Version 1.0.3
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
