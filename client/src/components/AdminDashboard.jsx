import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCamera, FaMapMarkerAlt, FaBell, FaUsers, FaSignOutAlt, FaPlus, FaEdit, FaTrashAlt, FaSave } from 'react-icons/fa';

export default function AdminDashboard() {
    const [admin, setAdmin] = useState({ name: "Admin User" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState("campus");
    const [campusData, setCampusData] = useState({
        campusName: "NIT Hamirpur Campus",
        location: {
            address: "NIT Hamirpur, Anu, Himachal Pradesh 177005, India",
            latitude: "31.7084",
            longitude: "76.5274"
        },
        buildings: [
            {
                id: "admin-block",
                name: "Administrative Block",
                type: "academic",
                coordinates: { latitude: "31.7089", longitude: "76.5278" },
                exits: [
                    {
                        id: "admin-exit-main",
                        name: "Main Entrance",
                        type: "main",
                        coordinates: { latitude: "31.7090", longitude: "76.5279" }
                    },
                    {
                        id: "admin-exit-emergency",
                        name: "Emergency Exit",
                        type: "emergency",
                        coordinates: { latitude: "31.7088", longitude: "76.5280" }
                    }
                ]
            },
            {
                id: "auditorium",
                name: "Auditorium",
                type: "gathering",
                coordinates: { latitude: "31.7082", longitude: "76.5281" },
                exits: [
                    {
                        id: "auditorium-exit-main",
                        name: "Main Entrance",
                        type: "main",
                        coordinates: { latitude: "31.7083", longitude: "76.5282" }
                    },
                    {
                        id: "auditorium-exit-side1",
                        name: "Side Exit 1",
                        type: "emergency",
                        coordinates: { latitude: "31.7081", longitude: "76.5280" }
                    }
                ]
            }
        ]
    });
    const [editingBuildingId, setEditingBuildingId] = useState(null);
    const [newBuilding, setNewBuilding] = useState({ name: "", type: "academic", coordinates: { latitude: "", longitude: "" } });
    const [editingExit, setEditingExit] = useState(null);
    const [newExit, setNewExit] = useState({ name: "", type: "main", coordinates: { latitude: "", longitude: "" } });
    const [alertMessage, setAlertMessage] = useState("");
    const [alertRecipients, setAlertRecipients] = useState(["authorities", "crpf"]);
    const [activeUsers, setActiveUsers] = useState([
        { id: 1, name: "Akshat Jain", email: "akshatjain042004@gmail.com" },
        { id: 2, name: "Om Bhayde", email: "ombhayde@gmail.com" },
        { id: 3, name: "User", email: "user@gmail.com" },
        { id: 4, name: "Tanmay", email: "tanmaysawankar@gmail.com" },
    ]);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        const roleFromUrl = searchParams.get("role");
        if (tokenFromUrl) {
            localStorage.setItem("token", tokenFromUrl);
            localStorage.setItem("role", roleFromUrl);
        }

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
    }, [navigate, searchParams]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const handleAddBuilding = () => {
        const newBuildingData = {
            id: `building-${campusData.buildings.length + 1}`,
            ...newBuilding,
            exits: []
        };
        setCampusData(prevData => ({
            ...prevData,
            buildings: [...prevData.buildings, newBuildingData]
        }));
        setNewBuilding({ name: "", type: "academic", coordinates: { latitude: "", longitude: "" } });
        setActiveSection("campus");
    };

    const handleEditBuilding = (building) => {
        setEditingBuildingId(building.id);
    };

    const handleSaveBuilding = (buildingId) => {
        setEditingBuildingId(null);
    };

    const handleInputChangeBuilding = (buildingId, field, subfield = null, value) => {
        setCampusData(prevData => ({
            ...prevData,
            buildings: prevData.buildings.map(building =>
                building.id === buildingId
                    ? {
                        ...building,
                        [field]: subfield ? { ...building[field], [subfield]: value } : value
                    }
                    : building
            )
        }));
    };

    const handleAddExit = (buildingId) => {
        const newExitData = {
            id: `exit-${campusData.buildings.find(b => b.id === buildingId).exits.length + 1}`,
            ...newExit
        };
        setCampusData(prevData => ({
            ...prevData,
            buildings: prevData.buildings.map(building =>
                building.id === buildingId
                    ? { ...building, exits: [...building.exits, newExitData] }
                    : building
            )
        }));
        setNewExit({ name: "", type: "main", coordinates: { latitude: "", longitude: "" } });
        setEditingBuildingId(buildingId);
        setActiveSection("exits");
    };

    const handleEditExit = (buildingId, exit) => {
        setEditingExit({ ...exit, buildingId });
    };

    const handleSaveExit = () => {
        setEditingExit(null);
    };

    const handleInputChangeExit = (field, subfield = null, value) => {
        setEditingExit(prev => ({
            ...prev,
            [field]: subfield ? { ...prev[field], [subfield]: value } : value
        }));
    };

    const handleSendAlert = () => {
        if (!alertMessage.trim() || alertRecipients.length === 0) {
            setError("Please enter a message and select at least one recipient.");
            return;
        }
        alert(`Alert sent to ${alertRecipients.join(", ")}: ${alertMessage}`);
        setAlertMessage("");
        setError(null);
    };

    const filteredBuildings = campusData?.buildings
        ? campusData.buildings.filter(building =>
            building.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading Dashboard...</p></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="bg-gray-800 text-gray-100 w-64 py-6 px-4 flex flex-col justify-between">
                <div>
                    <h1 className="text-xl font-bold mb-6 text-red-500">Admin Dashboard</h1>
                    <nav>
                        <ul>
                            <li className="mb-4">
                                <button
                                    onClick={() => setActiveSection("campus")}
                                    className={`flex items-center py-2 px-4 rounded transition duration-300 ease-in-out ${activeSection === "campus" ? 'bg-gray-700' : 'hover:bg-gray-600'}`}
                                >
                                    <FaCamera className="mr-2" />
                                    Campus & Cameras
                                </button>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={() => setActiveSection("exits")}
                                    className={`flex items-center py-2 px-4 rounded transition duration-300 ease-in-out ${activeSection === "exits" ? 'bg-gray-700' : 'hover:bg-gray-600'}`}
                                >
                                    <FaMapMarkerAlt className="mr-2" />
                                    Manage Exits
                                </button>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={() => setActiveSection("alerts")}
                                    className={`flex items-center py-2 px-4 rounded transition duration-300 ease-in-out ${activeSection === "alerts" ? 'bg-gray-700' : 'hover:bg-gray-600'}`}
                                >
                                    <FaBell className="mr-2" />
                                    Send Alerts
                                </button>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={() => setActiveSection("users")}
                                    className={`flex items-center py-2 px-4 rounded transition duration-300 ease-in-out ${activeSection === "users" ? 'bg-gray-700' : 'hover:bg-gray-600'}`}
                                >
                                    <FaUsers className="mr-2" />
                                    Active Users
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div>
                    <p className="mb-2">Logged in as: {admin?.name}</p>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-sm bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300"
                    >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-6 overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                    {activeSection === "campus" && "Manage Campus & Cameras"}
                    {activeSection === "exits" && "Manage Exit Points"}
                    {activeSection === "alerts" && "Send Alerts"}
                    {activeSection === "users" && "Active Users"}
                </h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}

                {activeSection === "campus" && campusData && (
                    <div>
                        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Campus Information</h3>
                            <div className="space-y-2">
                                <p><span className="font-semibold">Name:</span> {campusData.campusName}</p>
                                <p><span className="font-semibold">Address:</span> {campusData.location.address}</p>
                                <p><span className="font-semibold">Latitude:</span> {campusData.location.latitude}, <span className="font-semibold">Longitude:</span> {campusData.location.longitude}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search buildings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <h3 className="text-xl font-medium text-gray-900 mb-4">Buildings</h3>
                        {filteredBuildings.map((building) => (
                            <div key={building.id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{building.name}</h4>
                                        <p className="text-sm text-gray-600">Type: {building.type}</p>
                                        {editingBuildingId === building.id ? (
                                            <>
                                                <input type="text" value={building.coordinates.latitude} onChange={(e) => handleInputChangeBuilding(building.id, 'coordinates', 'latitude', e.target.value)} className="border rounded-lg px-2 py-1 text-sm mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Lat" />
                                                <input type="text" value={building.coordinates.longitude} onChange={(e) => handleInputChangeBuilding(building.id, 'coordinates', 'longitude', e.target.value)} className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Long" />
                                                <button onClick={() => handleSaveBuilding(building.id)} className="ml-2 text-blue-500 hover:text-blue-700"><FaSave /></button>
                                            </>
                                        ) : (
                                            <p className="text-sm">Lat: {building.coordinates.latitude}, Long: {building.coordinates.longitude}</p>
                                        )}
                                    </div>
                                    <div>
                                        <button onClick={() => handleEditBuilding(building)} className="text-yellow-500 hover:text-yellow-700 mr-2"><FaEdit /></button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h5 className="font-medium text-gray-700 mb-2">Exits:</h5>
                                    {building.exits.length > 0 ? (
                                        <ul className="space-y-2">
                                            {building.exits.map(exit => (
                                                <li key={exit.id} className="text-sm ml-2">
                                                    {exit.name} ({exit.type}) - Lat: {exit.coordinates.latitude}, Long: {exit.coordinates.longitude}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm ml-2">No exits defined.</p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Form to Add New Building */}
                        <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Building</h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input type="text" placeholder="Building Name" value={newBuilding.name} onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <select value={newBuilding.type} onChange={(e) => setNewBuilding({ ...newBuilding, type: e.target.value })} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="academic">Academic</option>
                                    <option value="residential">Residential</option>
                                    <option value="other">Other</option>
                                </select>
                                <input type="text" placeholder="Latitude" value={newBuilding.coordinates.latitude} onChange={(e) => setNewBuilding({ ...newBuilding, coordinates: { ...newBuilding.coordinates, latitude: e.target.value } })} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <input type="text" placeholder="Longitude" value={newBuilding.coordinates.longitude} onChange={(e) => setNewBuilding({ ...newBuilding, coordinates: { ...newBuilding.coordinates, longitude: e.target.value } })} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <button onClick={handleAddBuilding} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                                <FaPlus className="mr-1" /> Add Building
                            </button>
                        </div>
                    </div>
                )}

                {activeSection === "exits" && campusData && (
                    <div>
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search buildings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {filteredBuildings.map((building) => (
                            <div key={building.id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{building.name}</h4>
                                    </div>
                                    <div>
                                        <button onClick={() => setEditingBuildingId(building.id)} className="text-blue-500 hover:text-blue-700">
                                            {editingBuildingId === building.id ? "Close" : "Manage Exits"}
                                        </button>
                                    </div>
                                </div>
                                {editingBuildingId === building.id && (
                                    <div className="mt-4">
                                        <h5 className="font-medium text-gray-700 mb-4">Exits for {building.name}:</h5>
                                        {building.exits.map(exit => (
                                            <div key={exit.id} className="bg-gray-50 p-4 rounded-lg mb-4 flex justify-between items-center">
                                                {editingExit?.id === exit.id ? (
                                                    <>
                                                        <input type="text" value={editingExit.name} onChange={(e) => handleInputChangeExit('name', null, e.target.value)} className="border rounded-lg px-2 py-1 text-sm mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Name" />
                                                        <select value={editingExit.type} onChange={(e) => handleInputChangeExit('type', null, e.target.value)} className="border rounded-lg px-2 py-1 text-sm mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                            <option value="main">Main</option>
                                                            <option value="secondary">Secondary</option>
                                                            <option value="emergency">Emergency</option>
                                                        </select>
                                                        <input type="text" value={editingExit.coordinates.latitude} onChange={(e) => handleInputChangeExit('coordinates', 'latitude', e.target.value)} className="border rounded-lg px-2 py-1 text-sm mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Lat" />
                                                        <input type="text" value={editingExit.coordinates.longitude} onChange={(e) => handleInputChangeExit('coordinates', 'longitude', e.target.value)} className="border rounded-lg px-2 py-1 text-sm mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Long" />
                                                        <button onClick={handleSaveExit} className="text-blue-500 hover:text-blue-700"><FaSave /></button>
                                                        <button onClick={() => setEditingExit(null)} className="text-gray-500 hover:text-gray-700 ml-2">Cancel</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>{exit.name} ({exit.type}) - Lat: {exit.coordinates.latitude}, Long: {exit.coordinates.longitude}</span>
                                                        <button onClick={() => handleEditExit(building.id, exit)} className="text-yellow-500 hover:text-yellow-700"><FaEdit /></button>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                        {/* Form to Add New Exit */}
                                        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                                            <h6 className="font-medium text-gray-700 mb-4">Add New Exit</h6>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <input type="text" placeholder="Exit Name" value={newExit.name} onChange={(e) => setNewExit({ ...newExit, name: e.target.value })} className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <select value={newExit.type} onChange={(e) => setNewExit({ ...newExit, type: e.target.value })} className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option value="main">Main</option>
                                                    <option value="secondary">Secondary</option>
                                                    <option value="emergency">Emergency</option>
                                                </select>
                                                <input type="text" placeholder="Latitude" value={newExit.coordinates.latitude} onChange={(e) => setNewExit({ ...newExit, coordinates: { ...newExit.coordinates, latitude: e.target.value } })} className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <input type="text" placeholder="Longitude" value={newExit.coordinates.longitude} onChange={(e) => setNewExit({ ...newExit, coordinates: { ...newExit.coordinates, longitude: e.target.value } })} className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <button onClick={() => handleAddExit(building.id)} className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                                                <FaPlus className="mr-1" /> Add Exit
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === "alerts" && (
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Send Alert</h3>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message:</label>
                            <textarea
                                id="message"
                                value={alertMessage}
                                onChange={(e) => setAlertMessage(e.target.value)}
                                rows="3"
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Recipients:</label>
                            <div className="flex flex-wrap">
                                <label className="inline-flex items-center mr-4">
                                    <input
                                        type="checkbox"
                                        checked={alertRecipients.includes("authorities")}
                                        onChange={() => setAlertRecipients(prev =>
                                            prev.includes("authorities") ? prev.filter(r => r !== "authorities") : [...prev, "authorities"]
                                        )}
                                        className="form-checkbox"
                                    />
                                    <span className="ml-2">Authorities</span>
                                </label>
                                <label className="inline-flex items-center mr-4">
                                    <input
                                        type="checkbox"
                                        checked={alertRecipients.includes("crpf")}
                                        onChange={() => setAlertRecipients(prev =>
                                            prev.includes("crpf") ? prev.filter(r => r !== "crpf") : [...prev, "crpf"]
                                        )}
                                        className="form-checkbox"
                                    />
                                    <span className="ml-2">CRPF</span>
                                </label>
                            </div>
                        </div>
                        <button onClick={handleSendAlert} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300">
                            <FaBell className="mr-1" /> Send Alert
                        </button>
                    </div>
                )}

                {activeSection === "users" && (
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Users</h3>
                        {activeUsers.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {activeUsers.map(user => (
                                    <li key={user.id} className="py-3">
                                        <p className="text-sm font-medium text-gray-900">{user.name} ({user.email})</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No active users at the moment.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}