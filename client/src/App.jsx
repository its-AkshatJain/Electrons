import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import CrowdSafetyApp from "./components/CrowdSafetyApp";

export default function App() {
  return (
    <Router>

        <Routes>
          <Route path="/" element={<Login />} /> {/* Default to Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<CrowdSafetyApp />} />
        </Routes>

    </Router>
  );
}
