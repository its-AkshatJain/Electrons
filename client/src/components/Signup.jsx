import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import GoogleLoginButton from "./GoogleLoginButton";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", { name, email, password, mobile, role });
      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      alert("Signup failed!");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form
        className="w-80 flex flex-col gap-3 bg-white p-6 rounded shadow-lg"
        onSubmit={handleSignup}
      >
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          type="submit"
        >
          Sign Up
        </button>
      </form>
      <GoogleLoginButton />
      <p className="mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
