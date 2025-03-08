import React, { useState } from 'react';
import { MapIcon, Bell, Shield, AlertTriangle, Navigation, Clock, FileText } from 'lucide-react';

const BottomNavbar = ({ currentTab, setCurrentTab, isDarkMode, notifications, alertLevel, crowdDensity }) => {
  const [expandedPanel, setExpandedPanel] = useState(null);
  
  const togglePanel = (panel) => {
    if (expandedPanel === panel) {
      setExpandedPanel(null);
    } else {
      setExpandedPanel(panel);
      setCurrentTab(panel);
    }
  };
  
  const getAlertColor = () => {
    switch(alertLevel) {
      case 'danger': return 'bg-red-600';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  const getAlertText = () => {
    switch(alertLevel) {
      case 'danger': return 'Critical Crowd Density';
      case 'warning': return 'High Crowd Density';
      default: return 'Normal Conditions';
    }
  };
  
  const getAlertTextColor = () => {
    switch(alertLevel) {
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-amber-500';
      default: return 'text-emerald-500';
    }
  };
  
  return (
    <>
      {/* Expandable Panels */}
      {expandedPanel === 'alerts' && (
        <div className={`fixed bottom-16 left-0 right-0 z-90 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-t-lg max-h-[70vh] overflow-y-auto p-4`}>
          <h2 className="text-xl font-bold mb-3">Recent Alerts</h2>
          <div className="space-y-3">
            {notifications && notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}
                >
                  <div className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                    notification.severity === 'warning' ? 'bg-amber-100 text-amber-500' : 
                    notification.severity === 'danger' ? 'bg-red-100 text-red-500' : 
                    'bg-blue-100 text-blue-500'
                  }`}>
                    {notification.severity === 'warning' ? <AlertTriangle size={18} /> : 
                     notification.severity === 'danger' ? <AlertTriangle size={18} /> : 
                     <Bell size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{notification.message}</p>
                    <div className="flex items-center mt-1">
                      <Clock size={14} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-1`} />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notification.time}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">No recent alerts</p>
            )}
          </div>
        </div>
      )}
      
      {expandedPanel === 'safety' && (
        <div className={`fixed bottom-16 left-0 right-0 z-90 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-t-lg max-h-[70vh] overflow-y-auto p-4`}>
          <h2 className="text-xl font-bold mb-3">Safety Dashboard</h2>
          
          {/* Current Status */}
          <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Current Status</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlertColor()} text-white`}>
                {getAlertText()}
              </span>
            </div>
            
            <div className="mb-2">
              <p className="text-sm mb-1">Crowd Density</p>
              <div className="h-3 relative rounded-full overflow-hidden bg-gray-300">
                <div 
                  className={`absolute left-0 top-0 bottom-0 ${
                    crowdDensity > 80 ? 'bg-red-600' : 
                    crowdDensity > 60 ? 'bg-amber-500' : 
                    'bg-emerald-500'
                  }`} 
                  style={{ width: `${crowdDensity}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs">Low</span>
                <span className="text-xs font-medium">{crowdDensity}%</span>
                <span className="text-xs">High</span>
              </div>
            </div>
          </div>
          
          {/* Safety Tips */}
          <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-2">Safety Tips</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                  <Shield size={14} className="text-blue-600" />
                </div>
                <p className="text-sm">Stay aware of your surroundings and follow crowd flow</p>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                  <Navigation size={14} className="text-blue-600" />
                </div>
                <p className="text-sm">Use recommended routes to avoid high density areas</p>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                  <FileText size={14} className="text-blue-600" />
                </div>
                <p className="text-sm">Follow venue instructions and signage</p>
              </li>
            </ul>
          </div>
          
          {/* Emergency Contacts */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-2">Emergency Contacts</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Emergency Services</span>
                <button className="px-3 py-1 bg-red-600 text-white rounded-full text-xs">Call 100</button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Event Security</span>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs">Call Security</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 z-100 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="flex items-center justify-around">
          <button 
            className={`flex flex-col items-center py-3 px-6 ${
              currentTab === 'map'
                ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
            } transition-colors`}
            onClick={() => {
              setCurrentTab('map');
              setExpandedPanel(null);
            }}
          >
            <MapIcon size={20} />
            <span className="text-xs mt-1">Map</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-3 px-6 ${
              currentTab === 'alerts'
                ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
            } transition-colors relative`}
            onClick={() => togglePanel('alerts')}
          >
            <Bell size={20} />
            <span className="text-xs mt-1">Alerts</span>
            {notifications && notifications.length > 0 && (
              <span className="absolute top-2 right-4 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          
          <button 
            className={`flex flex-col items-center py-3 px-6 ${
              currentTab === 'safety'
                ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
            } transition-colors`}
            onClick={() => togglePanel('safety')}
          >
            <Shield size={20} />
            <span className="text-xs mt-1">Safety</span>
            {alertLevel !== 'normal' && (
              <span className={`absolute top-2 right-4 ${alertLevel === 'danger' ? 'bg-red-500' : 'bg-amber-500'} text-white text-xs rounded-full w-4 h-4 flex items-center justify-center`}>
                !
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

export default BottomNavbar;