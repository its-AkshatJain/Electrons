import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if token exists in URL query parameters and store it
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
    
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate, searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {user ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
          <p className="mb-2">Email: {user.email}</p>
          <p className="mb-2">Mobile: {user.mobile}</p>
          <p className="mb-4">Role: {user.role}</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
