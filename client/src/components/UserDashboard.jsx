import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bell, Users, MapIcon, AlertTriangle, Navigation, Menu, X, Settings, User, Shield, 
  Zap, Clock, FileText, RefreshCw, Sun, Moon, MapPin, LogOut 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Import Leaflet Routing Machine and its CSS
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
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

// New Component: RoutingMachine using Leaflet Routing Machine
const RoutingMachine = ({ start, end }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !start || !end) return;
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      lineOptions: { styles: [{ color: 'blue', weight: 4 }] },
      createMarker: function(i, waypoint, n) {
        return L.marker(waypoint.latLng, {
          icon: L.icon({
            iconUrl: i === 0
              ? 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png'
              : 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })
        });
      },
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      }),
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);
  return null;
};

const UserDashboard = () => {
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
  
  // Arduino-related state
  const [serialPort, setSerialPort] = useState(null);
  const [isArduinoConnected, setIsArduinoConnected] = useState(false);
  const [isArduinoConnecting, setIsArduinoConnecting] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [alertThreshold, setAlertThreshold] = useState(40);
  const lastNotificationSent = useRef(0);
  const autoConnectAttempted = useRef(false);

  // Route mapping state
  const [showRoute, setShowRoute] = useState(false);
  const [selectedExit, setSelectedExit] = useState(null);
  const [evacuationPoints, setEvacuationPoints] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Arduino auto-connect (unchanged)
  useEffect(() => {
    const tryAutoConnect = async () => {
      if (autoConnectAttempted.current || isArduinoConnected || isArduinoConnecting) return;
      
      autoConnectAttempted.current = true;
      setIsArduinoConnecting(true);
      
      try {
        const ports = await navigator.serial.getPorts();
        if (ports.length > 0) {
          const port = ports[0];
          try {
            await port.open({ baudRate: 9600 });
            setSerialPort(port);
            setIsArduinoConnected(true);
            const newNotification = {
              id: Date.now(),
              message: "Arduino connected automatically",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }),
              severity: "info"
            };
            setNotifications(prev => [newNotification, ...prev]);
            setTimeout(() => {
              sendAlertToArduino(`ALERT:DENSITY:${crowdDensity}`);
            }, 500);
          } catch (error) {
            console.error("Error auto-connecting to Arduino:", error);
            manualConnectToArduino();
          }
        } else {
          manualConnectToArduino();
        }
      } catch (error) {
        console.error("Error checking for Arduino ports:", error);
        setIsArduinoConnecting(false);
      }
    };
    
    const timer = setTimeout(() => { tryAutoConnect(); }, 2000);
    return () => clearTimeout(timer);
  }, [crowdDensity]);

  const manualConnectToArduino = async () => {
    setIsArduinoConnecting(true);
    setConnectionAttempts(prev => prev + 1);
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setSerialPort(port);
      setIsArduinoConnected(true);
      const newNotification = {
        id: Date.now(),
        message: "Arduino connected successfully",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }),
        severity: "info"
      };
      setNotifications(prev => [newNotification, ...prev]);
      setTimeout(() => {
        sendAlertToArduino(`ALERT:DENSITY:${crowdDensity}`);
      }, 1000);
    } catch (error) {
      console.error("Error connecting to Arduino:", error);
      const newNotification = {
        id: Date.now(),
        message: "Failed to connect to Arduino: " + error.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }),
        severity: "warning"
      };
      setNotifications(prev => [newNotification, ...prev]);
    } finally {
      setIsArduinoConnecting(false);
    }
  };
  
  // Request location permission on mount
  useEffect(() => { requestLocationPermission(); }, []);

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
        const newNotification = {
          id: Date.now(),
          message: "Your location has been updated",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }),
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
  
  const sendAlertToArduino = useCallback(async (message) => {
    if (!serialPort) {
      console.error("No serial port available");
      return;
    }
    try {
      const writer = serialPort.writable.getWriter();
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(message + '\n'));
      console.log("Sent to Arduino:", message);
      writer.releaseLock();
      const newNotification = {
        id: Date.now(),
        message: "Alert sent to Arduino device",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }),
        severity: "warning"
      };
      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error("Error sending alert to Arduino:", error);
      setIsArduinoConnected(false);
      const newNotification = {
        id: Date.now(),
        message: "Lost connection to Arduino: " + error.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }),
        severity: "warning"
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  }, [serialPort]);

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
        (error) => { console.error("Error watching position:", error); },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 3000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [locationPermission]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCrowdDensity(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        const newValue = Math.max(10, Math.min(95, prev + change));
        if (newValue > 80) setAlertLevel('danger');
        else if (newValue > 60) setAlertLevel('warning');
        else setAlertLevel('normal');
        if (newValue > alertThreshold && isArduinoConnected && Date.now() - lastNotificationSent.current > 15000) {
          lastNotificationSent.current = Date.now();
          sendAlertToArduino(`ALERT:DENSITY:${newValue}`);
          console.log(`Crowd density ${newValue}% exceeds threshold ${alertThreshold}%, alert sent`);
        }
        return newValue;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isArduinoConnected, sendAlertToArduino, alertThreshold]);

  const handleThresholdChange = (e) => {
    const newThreshold = parseInt(e.target.value);
    setAlertThreshold(newThreshold);
    const newNotification = {
      id: Date.now(),
      message: `Alert threshold updated to ${newThreshold}%`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }),
      severity: "info"
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

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

  // Compute evacuation route by marking 4 points: one stampede alert zone and three safe evacuation zones.
  const computeSafeRoute = () => {
    if (!userLocation) return;
    // Define 4 points relative to the user's location:
    const stampedeZone = { id: 'Stampede', lat: userLocation.latitude, lng: userLocation.longitude };
    const safeZoneA = { id: 'Gate 1', lat: 31.70184318199131, lng: 76.52270246412306 };
    const safeZoneB = { id: 'Gate 2', lat: 31.7088754, lng: 76.5226386 };
    
    // Save these points in state for rendering.
    setEvacuationPoints([stampedeZone, safeZoneA, safeZoneB]);
    
    // Choose the nearest safe zone (exclude the stampede zone) based on Euclidean distance.
    const safeZones = [safeZoneA, safeZoneB];
    const distance = (point) =>
      Math.sqrt(Math.pow(point.lat - userLocation.latitude, 2) + Math.pow(point.lng - userLocation.longitude, 2));
    const nearestSafeZone = safeZones.reduce((prev, curr) => distance(curr) < distance(prev) ? curr : prev, safeZones[0]);
    
    setSelectedExit(nearestSafeZone);
    setShowRoute(true);
    const newNotification = {
      id: Date.now(),
      message: `Evacuation route computed via Safe Zone ${nearestSafeZone.id}. Stampede Alert Zone is marked separately.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }),
      severity: "info"
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  useEffect(() => {
    if (locationPermission === 'granted' && userLocation) {
      const updateUserLocationInDatabase = async () => {
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          const ipAddress = ipData.ip;
          const userId = localStorage.getItem("userId");
          if (!userId) {
            console.error("User ID not found in localStorage");
            return;
          }
          const payload = {
            userId,
            ip: ipAddress,
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          };
          console.log("Sending payload to backend:", payload);
          const response = await fetch('http://localhost:5000/api/update-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Location updated:', data);
        } catch (error) {
          console.error('Error updating location in database:', error);
        }
      };
  
      updateUserLocationInDatabase();
      const intervalId = setInterval(updateUserLocationInDatabase, 10000);
      return () => clearInterval(intervalId);
    }
  }, [locationPermission, userLocation]);
  

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
              
              {/* Arduino Connection */}
              <div className={`mb-4 p-3 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">Arduino Alert Device</p>
                  {isArduinoConnecting ? (
                    <div className="flex items-center">
                      <RefreshCw size={16} className="animate-spin mr-1 text-blue-500" />
                      <span className="text-xs text-blue-500">Connecting...</span>
                    </div>
                  ) : (
                    <button 
                      className={`px-3 py-1 text-xs rounded-lg ${
                        isArduinoConnected 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      onClick={manualConnectToArduino}
                      disabled={isArduinoConnected || isArduinoConnecting}
                    >
                      {isArduinoConnected ? "Connected" : "Connect Device"}
                    </button>
                  )}
                </div>
                <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                  {isArduinoConnected 
                    ? `Connected. Will alert when crowd density exceeds ${alertThreshold}%` 
                    : isArduinoConnecting
                      ? "Attempting to connect automatically..."
                      : connectionAttempts === 0
                        ? "Connecting to device automatically..."
                        : "Please connect your Arduino device"}
                </p>
                {isArduinoConnected && (
                  <button 
                    className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    onClick={() => sendAlertToArduino(`ALERT:DENSITY:${crowdDensity}`)}
                  >
                    Test Arduino Alert
                  </button>
                )}
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
                    
                    {/* Recenter map on user's location */}
                    <RecenterMap position={[userLocation.latitude, userLocation.longitude]} />
                    
                    {/* Render crowd hotspot markers */}
                    {crowdHotspots.map(hotspot => (
                      <Marker 
                        key={hotspot.id}
                        position={[hotspot.lat, hotspot.lng]}
                        icon={L.divIcon({
                          className: 'custom-div-icon',
                          html: `<div style="background-color: rgba(255, 0, 0, ${hotspot.density/100}); width: ${hotspot.radius}px; height: ${hotspot.radius}px; border-radius: 50%; opacity: 0.7;"></div>`,
                          iconSize: [hotspot.radius, hotspot.radius],
                          iconAnchor: [hotspot.radius/2, hotspot.radius/2]
                        })}
                      >
                        <Popup>
                          <div>
                            <p className="font-semibold">Crowd Hotspot</p>
                            <p className="text-xs text-red-600">
                              Density: {hotspot.density}%
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    
                    {/* Render evacuation and stampede markers if available */}
                    {evacuationPoints.length > 0 && evacuationPoints.map(point => (
                      <Marker 
                        key={point.id}
                        position={[point.lat, point.lng]}
                        icon={L.divIcon({
                          className: 'custom-div-icon',
                          html: `<div style="background-color: ${point.id === 'Stampede' ? 'red' : 'green'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
                          iconSize: [20, 20],
                          iconAnchor: [10, 10]
                        })}
                      >
                        <Popup>
                          <div>
                            {point.id === 'Stampede' ? (
                              <>
                                <p className="font-semibold">Stampede Alert Zone</p>
                                <p className="text-xs text-red-600">Potential stampede area</p>
                              </>
                            ) : (
                              <>
                                <p className="font-semibold">Evacuation Zone {point.id}</p>
                                <p className="text-xs text-green-600">Safe for evacuation</p>
                              </>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    
                    {/* Render safe route using RoutingMachine if route is computed */}
                    {showRoute && selectedExit && (
                      <RoutingMachine 
                        start={[userLocation.latitude, userLocation.longitude]} 
                        end={[selectedExit.lat, selectedExit.lng]} 
                      />
                    )}
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
                      <div className="text-center p-6">
                        <RefreshCw size={32} className="mx-auto mb-3 animate-spin text-blue-500" />
                        <p className="font-medium">Loading map...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Button to compute evacuation route */}
              {locationPermission === 'granted' && userLocation && (
                <div className="mt-4 text-center">
                  <button 
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                    onClick={computeSafeRoute}
                  >
                    Compute Evacuation Route
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Notifications View */}
        {currentTab === 'notifications' && (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-3">Notifications</h2>
            <div className="max-w-md mx-auto">
              {notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map(notification => (
                    <li 
                      key={notification.id} 
                      className={`p-3 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          {notification.severity === 'warning' && (
                            <AlertTriangle size={16} className="text-amber-500" />
                          )}
                          {notification.severity === 'danger' && (
                            <AlertTriangle size={16} className="text-red-500" />
                          )}
                          {notification.severity === 'info' && (
                            <Bell size={16} className="text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Bell size={32} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Settings View */}
        {currentTab === 'settings' && (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-3">Settings</h2>
            <div className="max-w-md mx-auto space-y-4">
              <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="font-medium mb-3">Appearance</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dark Mode</span>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {isDarkMode ? (
                      <Sun size={20} className="text-amber-500" />
                    ) : (
                      <Moon size={20} className="text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="font-medium mb-3">Notification Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push Notifications</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="push-toggle" className="sr-only" defaultChecked />
                      <label
                        htmlFor="push-toggle"
                        className="block h-6 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer"
                      >
                        <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${true ? 'translate-x-4' : 'translate-x-0'}`}></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sound Alerts</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="sound-toggle" className="sr-only" defaultChecked />
                      <label
                        htmlFor="sound-toggle"
                        className="block h-6 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer"
                      >
                        <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${true ? 'translate-x-4' : 'translate-x-0'}`}></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="font-medium mb-3">Hardware Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm block">Arduino Alert Device</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {isArduinoConnected ? "Connected" : isArduinoConnecting ? "Connecting..." : "Not connected"}
                      </span>
                    </div>
                    <button 
                      className={`px-3 py-1 text-xs rounded-lg ${
                        isArduinoConnected 
                          ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      onClick={manualConnectToArduino}
                      disabled={isArduinoConnected || isArduinoConnecting}
                    >
                      {isArduinoConnected ? "Connected" : isArduinoConnecting ? "Connecting..." : "Connect"}
                    </button>
                  </div>
                  
                  {isArduinoConnected && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs">Alert Threshold</span>
                        <span className="text-xs font-semibold">{alertThreshold}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="90" 
                        step="5" 
                        value={alertThreshold}
                        onChange={handleThresholdChange}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-700"
                      />
                      
                      <button 
                        className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                        onClick={() => sendAlertToArduino(`ALERT:DENSITY:${crowdDensity}`)}
                      >
                        Test Arduino Alert
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center"
              >
                <LogOut size={16} className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavbar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDarkMode={isDarkMode}
        alertLevel={alertLevel}
        notifications={notifications}
      />
    </div>
  );
};

export default UserDashboard;