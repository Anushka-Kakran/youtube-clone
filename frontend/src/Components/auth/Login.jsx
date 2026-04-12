import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Async function to login
  async function userData() {
    try {
      const res = await axios.post(
        "https://youtube-clone-zd16.onrender.com/user/login",
        { email, password },
      );

      // Save token and userId in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("email", email); // Store the email entered in the form
      localStorage.setItem("channelName", res.data.channelName);
      localStorage.setItem("logoUrl", res.data.logoUrl);

      // Store the complete user object
      const userData = {
        _id: res.data._id,
        channelName: res.data.channelName,
        email: res.data.email,
        phone: res.data.phone,
        logoId: res.data.logoId,
        logoUrl: res.data.logoUrl,
        subscribers: res.data.subscribers,
        subscribedChannels: res.data.subcribedChannels,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      //     console.log("ChannelName:", localStorage.getItem("channelName"));
      // console.log("Email:", localStorage.getItem("email"));

      toast.success("Login successful!");
      // console.log(res.data);

      navigate("/");

      return res.data;
    } catch (error) {
      // Show server error message
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error("Login failed. Please try again.");
      }
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  }

  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading
    await userData();
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="min-h-screen flex items-center bg-yt-bg dark:bg-yt-darkBg text-yt-text dark:text-yt-darkText justify-center font-youtube">
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
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-yt-border px-4 py-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yt-red"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-yt-border px-4 py-3 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-yt-red"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading
                ? "bg-yt-red/70 cursor-not-allowed"
                : "bg-yt-red hover:bg-yt-redHover"
            } text-white py-3 rounded-md font-medium transition flex items-center justify-center gap-2`}
          >
            {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
            Submit
          </button>

          {/* Links */}
          <div className="flex justify-between mt-4 text-sm">
            <Link to="/signup" className="text-blue-600">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Login;
