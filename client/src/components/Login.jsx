import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import GoogleLoginButton from "./GoogleLoginButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); // Save role
      alert("Login successful!");
      // Redirect based on role
      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      alert("Login failed!");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form
        className="w-80 flex flex-col gap-3 bg-white p-6 rounded shadow-lg"
        onSubmit={handleLogin}
      >
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          type="submit"
        >
          Login
        </button>
      </form>
      <GoogleLoginButton />
      <p className="mt-4">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
