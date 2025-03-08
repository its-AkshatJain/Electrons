import { FcGoogle } from 'react-icons/fc';

export default function GoogleLoginButton() {
  return (
    <a
      href="http://localhost:5000/auth/google"
      className="group relative flex items-center justify-center gap-3 w-full max-w-xs mx-auto px-6 py-3 rounded-full shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* Gradient background that subtly moves on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
      
      {/* White background with slight transparency */}
      <div className="absolute inset-0.5 rounded-full bg-white z-10"></div>
      
      {/* Content */}
      <div className="flex items-center justify-center gap-3 z-20">
        <span className="bg-white p-1.5 rounded-full shadow-sm">
          <FcGoogle className="w-5 h-5" />
        </span>
        <span className="font-medium text-gray-700">Sign in with Google</span>
      </div>
      
      {/* Focus ring for accessibility */}
      <div className="absolute inset-0 rounded-full ring-0 group-hover:ring-2 ring-offset-2 ring-blue-500 z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </a>
  );
}