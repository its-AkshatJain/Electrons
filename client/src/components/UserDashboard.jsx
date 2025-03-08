import React, { useState, useEffect } from 'react';
import { 
  Bell, Users, MapIcon, AlertTriangle, Navigation, Menu, X, Settings, User, Shield, 
  Zap, Clock, FileText, RefreshCw, Sun, Moon, MapPin, LogOut 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import HeaderNavbar from './HeaderNavbar';
import SidebarMenu from './SidebarMenu';
import BottomNavbar from './BottomNavbar';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to recenter map when location changes
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);
  return null;
};

const UserDasboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('map');
  const [alertLevel, setAlertLevel] = useState('normal'); // normal, warning, danger
  const [crowdDensity, setCrowdDensity] = useState(42);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [locationError, setLocationError] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "High crowd density detected near Gate 3", time: "12:42 PM", severity: "warning" },
    { id: 2, message: "Your area is currently safe", time: "12:30 PM", severity: "info" },
    { id: 3, message: "Recommended route updated", time: "12:15 PM", severity: "info" }
  ]);
  const [crowdHotspots, setCrowdHotspots] = useState([
    { id: 1, lat: 0, lng: 0, density: 78, radius: 50 },
    { id: 2, lat: 0, lng: 0, density: 65, radius: 40 },
    { id: 3, lat: 0, lng: 0, density: 82, radius: 30 }
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Request location permission when component mounts
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Function to request location permission
  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLocationPermission('denied');
      return;
    }

    setLocationPermission('loading');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setUserLocation(newLocation);
        setLocationPermission('granted');
        setLocationError(null);
        
        // Update crowd hotspots based on user location (simulating real data)
        if (newLocation) {
          const newHotspots = crowdHotspots.map((hotspot) => ({
            ...hotspot,
            lat: newLocation.latitude + (Math.random() * 0.005 - 0.0025),
            lng: newLocation.longitude + (Math.random() * 0.005 - 0.0025)
          }));
          setCrowdHotspots(newHotspots);
        }
        
        // Add notification about location
        const newNotification = {
          id: Date.now(),
          message: "Your location has been updated",
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          severity: "info"
        };
        setNotifications(prev => [newNotification, ...prev]);
      },
      (error) => {
        setLocationPermission('denied');
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError("An unknown error occurred");
        }
      },
      { enableHighAccuracy: true }
    );
  };

  // Set up watch position for continuous location updates
  useEffect(() => {
    if (locationPermission === 'granted') {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error("Error watching position:", error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [locationPermission]);

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
      {/* Header Navbar */}
      <HeaderNavbar 
        isMenuOpen={isMenuOpen}
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
        getAlertColor={getAlertColor}
        getAlertTextColor={getAlertTextColor}
        getAlertText={getAlertText}
      />
      
      {/* Sidebar Menu */}
      <SidebarMenu 
        isMenuOpen={isMenuOpen}
        isDarkMode={isDarkMode}
        userLocation={userLocation}
        requestLocationPermission={requestLocationPermission}
      />
      
      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto pb-16">
        {/* Map View */}
        {currentTab === 'map' && (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-3">Crowd Density Map</h2>
            <div className="max-w-md mx-auto">
              {/* Current Crowd Density */}
              <div className={`mb-4 p-3 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">Current Crowd Density</p>
                  <span className={`text-sm font-semibold ${getAlertTextColor()}`}>
                    {crowdDensity}%
                  </span>
                </div>
                <div className="relative">
                  <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                    <div 
                      style={{ width: `${crowdDensity}%` }} 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getAlertColor()} transition-all duration-500`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <div className={`w-2 h-2 rounded-full ${getAlertColor()} mr-2`}></div>
                  <span className="text-xs font-medium">{getAlertText()}</span>
                </div>
              </div>
              
              {/* Map container */}
              <div className="relative rounded-lg overflow-hidden shadow-md h-64 md:h-72">
                {locationPermission === 'granted' && userLocation ? (
                  <MapContainer 
                    center={[userLocation.latitude, userLocation.longitude]} 
                    zoom={16} 
                    style={{ height: '100%', width: '100%' }}
                    attributionControl={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url={isDarkMode ? 
                        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" : 
                        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      }
                    />
                    
                    {/* User location marker */}
                    <Marker position={[userLocation.latitude, userLocation.longitude]}>
                      <Popup>
                        <div>
                          <p className="font-semibold">Your Location</p>
                          <p className="text-xs text-gray-600">
                            Accuracy: ±{userLocation.accuracy.toFixed(0)}m
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                    
                    {/* Keep map centered on user's location */}
                    <RecenterMap position={[userLocation.latitude, userLocation.longitude]} />
                  </MapContainer>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    {locationPermission === 'denied' ? (
                      <div className="text-center p-6">
                        <AlertTriangle size={32} className="mx-auto mb-3 text-amber-500" />
                        <p className="font-medium mb-1">Location access required</p>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Enable location services to view crowd density map
                        </p>
                        <button 
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                          onClick={requestLocationPermission}
                        >
                          Enable Location
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <MapIcon size={40} className={`mx-auto mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Loading map...
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Floating map actions */}
                <div className={`absolute bottom-3 right-3 p-1.5 rounded-full shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <button className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md">
                    <Navigation size={18} />
                  </button>
                </div>
                
                <div className={`absolute bottom-3 left-3 p-1.5 rounded-full shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <button className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md" onClick={requestLocationPermission}>
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>
              
              {/* Current safety status */}
              <div className={`mt-4 p-4 rounded-lg ${getAlertColor()} text-white`}>
                <div className="flex items-start">
                  {alertLevel === 'danger' && <AlertTriangle className="mr-2 flex-shrink-0" size={20} />}
                  {alertLevel === 'warning' && <AlertTriangle className="mr-2 flex-shrink-0" size={20} />}
                  {alertLevel === 'normal' && <Users className="mr-2 flex-shrink-0" size={20} />}
                  <div>
                    <h3 className="font-bold">{getAlertText()}</h3>
                    <p className="text-sm mt-1">
                      {alertLevel === 'danger' && 'Move to a less crowded area immediately. Keep emergency exits in mind.'}
                      {alertLevel === 'warning' && 'Be cautious of your surroundings. Consider moving to safer zones.'}
                      {alertLevel === 'normal' && 'Conditions are currently safe. Enjoy the event responsibly.'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Safe spots nearby */}
              <h3 className="font-medium mt-5 mb-2">Safe Spots Nearby</h3>
              <div className="space-y-2">
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm flex justify-between items-center`}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span>Rest Area</span>
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>150m NE</span>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm flex justify-between items-center`}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span>Food Court Section B</span>
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>210m W</span>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm flex justify-between items-center`}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span>South Entrance Plaza</span>
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>180m S</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Alerts View */}
        {currentTab === 'alerts' && (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Safety Alerts</h2>
            
            <div className="max-w-md mx-auto">
              <div className={`mb-4 p-4 rounded-lg ${getAlertColor()} text-white`}>
                <div className="flex items-start">
                  {alertLevel === 'danger' && <AlertTriangle className="mr-2 flex-shrink-0" size={20} />}
                  {alertLevel === 'warning' && <AlertTriangle className="mr-2 flex-shrink-0" size={20} />}
                  {alertLevel === 'normal' && <Users className="mr-2 flex-shrink-0" size={20} />}
                  <div>
                    <h3 className="font-bold">{getAlertText()}</h3>
                    <p className="text-sm mt-1">
                      {alertLevel === 'danger' && 'Move to a less crowded area immediately.'}
                      {alertLevel === 'warning' && 'Be cautious of your surroundings.'}
                      {alertLevel === 'normal' && 'Conditions are currently safe.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium text-sm uppercase tracking-wider mb-2 mt-6 text-gray-500 dark:text-gray-400">Recent Notifications</h3>
              
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
                  >
                    <div className="flex items-start">
                      {notification.severity === 'warning' && (
                        <AlertTriangle size={18} className="text-amber-500 mr-2 flex-shrink-0 mt-1" />
                      )}
                      {notification.severity === 'danger' && (
                        <AlertTriangle size={18} className="text-red-500 mr-2 flex-shrink-0 mt-1" />
                      )}
                      {notification.severity === 'info' && (
                        <Bell size={18} className="text-blue-500 mr-2 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Clock size={12} className="inline mr-1" />
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Safety View */}
        {currentTab === 'safety' && (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Safety Information</h2>
            
            <div className="max-w-md mx-auto">
              <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className="font-bold flex items-center">
                  <Shield size={18} className="text-blue-600 mr-2" />
                  Emergency Contacts
                </h3>
                
                <div className="mt-3 space-y-3">
                  <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                    Call Emergency Services
                  </button>
                  <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                    Contact Event Security
                  </button>
                </div>
              </div>
              
              <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className="font-bold flex items-center">
                  <Zap size={18} className="text-amber-500 mr-2" />
                  Quick Safety Tips
                </h3>
                
                <ul className={`mt-3 space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    Stay aware of your surroundings at all times
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    Move to less crowded areas if density is high
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    Keep belongings secure and close to your body
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                    Establish meeting points with companions
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-2 mt-0.5">5</span>
                    Follow official guidance and instructions
                  </li>
                </ul>
              </div>
              
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className="font-bold flex items-center">
                  <MapIcon size={18} className="text-green-600 mr-2" />
                  Safe Zones & Exits
                </h3>
                
                {userLocation ? (
                  <div className="mt-3 h-40 rounded overflow-hidden">
                    <MapContainer 
                      center={[userLocation.latitude, userLocation.longitude]} 
                      zoom={15} 
                      style={{ height: '100%', width: '100%' }}
                      attributionControl={false}
                      zoomControl={false}
                      dragging={false}
                      touchZoom={false}
                      scrollWheelZoom={false}
                      doubleClickZoom={false}
                    >
                      <TileLayer
                        url={isDarkMode ? 
                          "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" : 
                          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        }
                      />
                      <Marker position={[userLocation.latitude, userLocation.longitude]} />
                    </MapContainer>
                  </div>
                ) : (
                  <div className="mt-3 bg-gray-200 dark:bg-gray-700 h-40 rounded flex items-center justify-center">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Enable location to view safe zones
                    </p>
                  </div>
                )}
                
                <div className="mt-3 space-y-2">
                  <div className={`p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} text-sm flex items-center`}>
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Main Exit - 300m northeast</span>
                  </div>
                  <div className={`p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} text-sm flex items-center`}>
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Medical Station - 150m west</span>
                  </div>
                  <div className={`p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} text-sm flex items-center`}>
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>Emergency Exit - 200m south</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavbar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDarkMode={isDarkMode}
      />
      
      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default UserDasboard;
