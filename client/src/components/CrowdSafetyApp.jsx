import React, { useState, useEffect } from 'react';
import { Bell, Users, Map, AlertTriangle, Navigation, Menu, X, Settings, User, Shield, Zap, Clock, FileText, RefreshCw, Sun, Moon } from 'lucide-react';

const CrowdSafetyApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('map');
  const [alertLevel, setAlertLevel] = useState('normal'); // normal, warning, danger
  const [crowdDensity, setCrowdDensity] = useState(42);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "High crowd density detected near Gate 3", time: "12:42 PM", severity: "warning" },
    { id: 2, message: "Your area is currently safe", time: "12:30 PM", severity: "info" },
    { id: 3, message: "Recommended route updated", time: "12:15 PM", severity: "info" }
  ]);

  // Simulate changing crowd density
  useEffect(() => {
    const interval = setInterval(() => {
      setCrowdDensity(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        const newValue = Math.max(10, Math.min(95, prev + change));
        
        // Update alert level based on crowd density
        if (newValue > 80) setAlertLevel('danger');
        else if (newValue > 60) setAlertLevel('warning');
        else setAlertLevel('normal');
        
        return newValue;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Determine color based on alert level
  const getAlertColor = () => {
    switch(alertLevel) {
      case 'danger': return 'bg-red-600';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  const getAlertTextColor = () => {
    switch(alertLevel) {
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-amber-500';
      default: return 'text-emerald-500';
    }
  };

  const getAlertText = () => {
    switch(alertLevel) {
      case 'danger': return 'Critical Crowd Density';
      case 'warning': return 'High Crowd Density';
      default: return 'Normal Conditions';
    }
  };

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`relative z-20 px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getAlertColor()} text-white transition-colors duration-500`}>
              <Users size={18} />
              <span className="text-sm font-medium">{getAlertText()}</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Sliding menu */}
      <div className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-30 w-72 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full pt-16 pb-4">
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
          </nav>
          
          <div className="px-6 mt-auto">
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md">
              Emergency Contact
            </button>
            <p className={`text-xs text-center mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Version 1.0.2 • Last Updated: March 7, 2025
            </p>
          </div>
        </div>
      </div>
      
      {/* Alert banner - only show on warning/danger */}
      {alertLevel !== 'normal' && (
        <div className={`${alertLevel === 'danger' ? 'bg-red-600' : 'bg-amber-500'} p-2 text-center text-white z-10`}>
          <div className="flex items-center justify-center space-x-2">
            <AlertTriangle size={16} />
            <span className="text-sm font-medium">
              {alertLevel === 'danger' 
                ? 'EMERGENCY: High risk area detected. Move to safety immediately.' 
                : 'Warning: Increasing crowd density detected in your vicinity'}
            </span>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-1 relative overflow-hidden">
        {/* Map View */}
        {currentTab === 'map' && (
          <div className="relative h-full">
            {/* Simulated map */}
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              {/* This would be your actual map component */}
              <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/api/placeholder/800/800')] opacity-30 bg-center bg-cover"></div>
                
                {/* Crowd density overlay visualization (simplified) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-4/5 h-4/5">
                    {/* Heat map blobs representing crowd density */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500 opacity-30 blur-xl"></div>
                    <div className="absolute top-1/3 left-1/2 w-48 h-48 rounded-full bg-yellow-500 opacity-30 blur-xl"></div>
                    <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-red-500 opacity-40 blur-xl"></div>
                    
                    {/* User location */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping absolute opacity-75"></div>
                      <div className="w-6 h-6 bg-blue-600 rounded-full relative flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className={`absolute bottom-24 left-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-lg`}>
                  <div className="text-sm font-medium mb-2">Crowd Density</div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs">Low</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-xs">Medium</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs">High</span>
                    </div>
                  </div>
                  <div className={`mt-2 pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>Last updated:</span>
                      <span>Just now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Density meter */}
            <div className={`absolute top-4 right-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Density</span>
                <span className={`text-sm font-bold ${
                  crowdDensity > 80 ? 'text-red-600' : 
                  crowdDensity > 60 ? 'text-amber-500' : 'text-emerald-500'
                }`}>{crowdDensity}%</span>
              </div>
              <div className={`h-2 w-48 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <div 
                  className={`h-full ${
                    crowdDensity > 80 ? 'bg-red-600' : 
                    crowdDensity > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                  } transition-all duration-500 ease-in-out`}
                  style={{ width: `${crowdDensity}%` }}
                ></div>
              </div>
              <div className={`flex justify-between mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
            
            {/* Navigation suggestion */}
            <div className="absolute bottom-24 right-4 max-w-xs">
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg border-l-4 border-blue-600`}>
                <div className="flex items-start">
                  <Navigation size={20} className="mr-3 mt-1 flex-shrink-0 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-sm">Recommended Route</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Take the eastern exit and proceed north to avoid high crowd areas</p>
                    <div className={`flex items-center justify-between mt-2 pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Est. time: 7 min</span>
                      <button className="text-xs text-blue-600 font-medium">View</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Alerts Tab */}
        {currentTab === 'alerts' && (
          <div className={`h-full p-4 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Safety Alerts</h2>
              <div className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <RefreshCw size={16} />
                <span className="text-xs">Live</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${
                    notification.severity === 'warning' ? 'border-l-4 border-amber-500' :
                    notification.severity === 'danger' ? 'border-l-4 border-red-600' :
                    'border-l-4 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm font-medium">{notification.message}</span>
                      <div className="flex items-center mt-2">
                        <Clock size={14} className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mr-1`} />
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notification.time}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notification.severity === 'warning' ? 
                        isDarkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-800' :
                      notification.severity === 'danger' ? 
                        isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800' :
                        isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {notification.severity === 'warning' ? 'Warning' :
                       notification.severity === 'danger' ? 'Emergency' : 'Info'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className={`w-full mt-4 py-2 text-sm ${isDarkMode ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-300'} border rounded-lg`}>
              View All Alerts
            </button>
          </div>
        )}
        
        {/* Status Tab */}
        {currentTab === 'status' && (
          <div className={`h-full p-4 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">System Status</h2>
              <button className="text-sm text-blue-600 font-medium">Refresh</button>
            </div>
            
            <div className="grid gap-4">
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Wristband Status</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs text-emerald-500">Active</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Battery</div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                        <div className="h-full bg-emerald-500 w-4/5"></div>
                      </div>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Signal</div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                        <div className="h-full bg-blue-500 w-full"></div>
                      </div>
                      <span className="text-sm font-medium">Strong</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4`}>
                <h3 className="font-medium mb-3">Current Location Zone</h3>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'} rounded-lg`}>
                    <Map size={20} />
                  </div>
                  <div>
                    <div className="text-lg font-bold">Zone B-7</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Near Main Stage</div>
                  </div>
                </div>
              </div>
              
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4`}>
                <h3 className="font-medium mb-3">Safety Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alert Response Time</div>
                    <div className="text-lg font-bold flex items-center">
                      <Zap size={16} className="text-amber-500 mr-1" />
                      1.2s
                    </div>
                  </div>
                  <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Emergency Exits</div>
                    <div className="text-lg font-bold">3 nearby</div>
                  </div>
                  <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Security Personnel</div>
                    <div className="text-lg font-bold">8 nearby</div>
                  </div>
                  <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Medical Stations</div>
                    <div className="text-lg font-bold">2 nearby</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Navigation Bar */}
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} py-3 px-6 shadow-lg z-10`}>
        <div className="flex justify-around max-w-md mx-auto">
          <button 
            className={`p-2 rounded-lg flex flex-col items-center transition-colors ${currentTab === 'map' ? 'text-blue-600' : isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setCurrentTab('map')}
          >
            <Map size={22} />
            <span className="text-xs mt-1">Map</span>
          </button>
          <button 
            className={`p-2 rounded-lg flex flex-col items-center transition-colors ${currentTab === 'alerts' ? 'text-blue-600' : isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setCurrentTab('alerts')}
          >
            <Bell size={22} />
            <span className="text-xs mt-1">Alerts</span>
          </button>
          <button 
            className={`p-2 rounded-lg flex flex-col items-center transition-colors ${currentTab === 'status' ? 'text-blue-600' : isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setCurrentTab('status')}
          >
            <Shield size={22} />
            <span className="text-xs mt-1">Status</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default CrowdSafetyApp;