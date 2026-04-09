import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yt-secondary font-youtube">
      
      <div className="w-full max-w-md bg-yt-bg p-8 rounded-xl shadow-md border border-yt-border">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-bold text-yt-red">YouTube</h1>
        </div>

        <h2 className="text-xl font-medium text-center text-yt-text mb-6">
          Sign in
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email or phone"
          className="w-full border border-yt-border px-4 py-3 rounded-md mb-4 
          focus:outline-none focus:ring-2 focus:ring-yt-red"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full border border-yt-border px-4 py-3 rounded-md mb-6 
          focus:outline-none focus:ring-2 focus:ring-yt-red"
        />

        {/* Button */}
        <button className="w-full bg-yt-red hover:bg-yt-redHover text-white py-3 rounded-md font-medium transition">
          Next
        </button>

        {/* Links */}
        <div className="flex justify-between mt-4 text-sm">
          <span className="text-blue-600 cursor-pointer">
            Forgot email?
          </span>
          <Link to="/signup" className="text-blue-600">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;