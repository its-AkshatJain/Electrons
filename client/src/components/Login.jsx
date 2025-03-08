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
      localStorage.setItem("role", data.role);
      alert("Login successful!");
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
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="m-auto w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative header */}
          <div className="h-24 bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white tracking-wide">Welcome Back</h2>
          </div>
          
          <div className="px-8 py-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <input
                    className="w-full border-0 border-b-2 border-gray-300 px-0 py-2 focus:ring-0 focus:border-violet-500 transition-colors bg-transparent"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    className="w-full border-0 border-b-2 border-gray-300 px-0 py-2 focus:ring-0 focus:border-violet-500 transition-colors bg-transparent"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="text-right">
                <a href="#" className="text-sm text-violet-600 hover:text-violet-800 transition-colors">
                  Forgot password?
                </a>
              </div>
              
              <button
                className="w-full py-3 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium text-lg tracking-wide shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                type="submit"
              >
                Sign In
              </button>
            </form>
            
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6">
              <GoogleLoginButton />
            </div>
            
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-violet-600 hover:text-violet-800 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}