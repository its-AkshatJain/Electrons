import React, { useState, useEffect } from 'react';
import { Bell, Users, Map, AlertTriangle, Navigation, Menu, X, Settings, User } from 'lucide-react';

const CrowdSafetyApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('map');
  const [alertLevel, setAlertLevel] = useState('normal'); // normal, warning, danger
  const [crowdDensity, setCrowdDensity] = useState(42);
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

  // Determine color based on alert level
  const getAlertColor = () => {
    switch(alertLevel) {
      case 'danger': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-green-500';
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
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header with status indicator */}
      <header className="relative z-10 px-4 py-3 bg-gray-800 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 rounded-full hover:bg-gray-700" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold">CrowdSafe</h1>
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getAlertColor()} transition-colors duration-500`}>
            <Users size={18} />
            <span className="text-sm font-medium">{getAlertText()}</span>
          </div>
        </div>
      </header>
      
      {/* Sliding menu */}
      <div className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-30 w-64 bg-gray-800 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full pt-16 pb-4">
          <div className="flex items-center justify-center py-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-600">
                <User size={20} />
              </div>
              <div>
                <p className="font-medium">User Name</p>
                <p className="text-xs text-gray-400">ID: #456789</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 mt-6 px-4 space-y-2">
            <button className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-700">
              <User size={18} className="mr-3" />
              <span>Profile</span>
            </button>
            <button className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-700">
              <Settings size={18} className="mr-3" />
              <span>Settings</span>
            </button>
            <button className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-700">
              <Bell size={18} className="mr-3" />
              <span>Notifications</span>
            </button>
          </nav>
          
          <div className="px-4 mt-auto">
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
              Emergency Contact
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 relative overflow-hidden">
        {/* Map View */}
        {currentTab === 'map' && (
          <div className="relative h-full">
            {/* Simulated map */}
            <div className="absolute inset-0 bg-gray-800">
              {/* This would be your actual map component */}
              <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/api/placeholder/800/800')] opacity-40 bg-center bg-cover"></div>
                
                {/* Crowd density overlay visualization (simplified) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-3/4 h-3/4">
                    {/* Heat map blobs representing crowd density */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500 opacity-30 blur-xl"></div>
                    <div className="absolute top-1/3 left-1/2 w-48 h-48 rounded-full bg-yellow-500 opacity-30 blur-xl"></div>
                    <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-red-500 opacity-40 blur-xl"></div>
                    
                    {/* User location */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full animate-ping absolute"></div>
                      <div className="w-5 h-5 bg-blue-500 rounded-full relative"></div>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-80 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-2">Crowd Density</div>
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
              </div>
            </div>
            
            {/* Density meter */}
            <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-80 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Density</span>
                <span className={`text-sm font-bold ${
                  crowdDensity > 80 ? 'text-red-500' : 
                  crowdDensity > 60 ? 'text-amber-500' : 'text-green-500'
                }`}>{crowdDensity}%</span>
              </div>
              <div className="h-2 w-48 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    crowdDensity > 80 ? 'bg-red-500' : 
                    crowdDensity > 60 ? 'bg-amber-500' : 'bg-green-500'
                  } transition-all duration-500 ease-in-out`}
                  style={{ width: `${crowdDensity}%` }}
                ></div>
              </div>
            </div>
            
            {/* Navigation suggestion */}
            <div className="absolute bottom-24 inset-x-4">
              <div className="bg-blue-600 p-4 rounded-lg shadow-lg">
                <div className="flex items-start">
                  <Navigation size={24} className="mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Recommended Route</h3>
                    <p className="text-sm text-blue-100">Take the eastern exit and proceed north to avoid high crowd areas</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Alert banner - only show on warning/danger */}
            {alertLevel !== 'normal' && (
              <div className={`absolute top-0 inset-x-0 ${alertLevel === 'danger' ? 'bg-red-600' : 'bg-amber-500'} p-2 text-center`}>
                <div className="flex items-center justify-center space-x-2">
                  <AlertTriangle size={16} />
                  <span className="text-sm font-medium">
                    {alertLevel === 'danger' 
                      ? 'EMERGENCY: High risk area detected. Move to safety immediately.' 
                      : 'Warning: Increasing crowd density detected'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Alerts Tab */}
        {currentTab === 'alerts' && (
          <div className="h-full p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Safety Alerts</h2>
            <div className="space-y-3">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg ${
                    notification.severity === 'warning' ? 'bg-amber-500 bg-opacity-10 border-l-4 border-amber-500' :
                    notification.severity === 'danger' ? 'bg-red-500 bg-opacity-10 border-l-4 border-red-500' :
                    'bg-gray-800 border-l-4 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{notification.message}</span>
                    <span className="text-xs text-gray-400">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Status Tab */}
        {currentTab === 'status' && (
          <div className="h-full p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">System Status</h2>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Wristband Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Connected</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-400">Battery</span>
                <span>87%</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Current Location Zone</h3>
              <div className="text-xl font-bold">Zone B-7</div>
              <div className="text-sm text-gray-400 mt-1">Near Main Stage</div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-2">Safety Statistics</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="text-sm text-gray-400">Alert Response Time</div>
                  <div className="text-lg font-bold">1.2s</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Emergency Exits</div>
                  <div className="text-lg font-bold">3 nearby</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Security Personnel</div>
                  <div className="text-lg font-bold">8 nearby</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Medical Stations</div>
                  <div className="text-lg font-bold">2 nearby</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Navigation Bar */}
      <nav className="bg-gray-800 py-2 px-8 shadow-lg">
        <div className="flex justify-around">
          <button 
            className={`p-2 rounded-full flex flex-col items-center ${currentTab === 'map' ? 'text-blue-500' : 'text-gray-400'}`}
            onClick={() => setCurrentTab('map')}
          >
            <Map size={24} />
            <span className="text-xs mt-1">Map</span>
          </button>
          <button 
            className={`p-2 rounded-full flex flex-col items-center ${currentTab === 'alerts' ? 'text-blue-500' : 'text-gray-400'}`}
            onClick={() => setCurrentTab('alerts')}
          >
            <Bell size={24} />
            <span className="text-xs mt-1">Alerts</span>
          </button>
          <button 
            className={`p-2 rounded-full flex flex-col items-center ${currentTab === 'status' ? 'text-blue-500' : 'text-gray-400'}`}
            onClick={() => setCurrentTab('status')}
          >
            <AlertTriangle size={24} />
            <span className="text-xs mt-1">Status</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default CrowdSafetyApp;
