export default function GoogleLoginButton() {
  return (
    <a
      href="http://localhost:5000/auth/google"
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-lg transition duration-300"
    >
      Login with Google
    </a>
  );
}

