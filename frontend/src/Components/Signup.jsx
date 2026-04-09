import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [channelName, setChannelName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [logo, setLogo] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // handle form submission logic here
    console.log({ channelName, email, password, phone, logo });

    const formData = new FormData();
    formData.append('channelName', channelName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('logo', logo);

   async function userData() {
   try {
    // Wait for the axios POST request
    const res = await axios.post(
      "https://youtube-clone-zd16.onrender.com/user/signup",
      formData, // your FormData object
      {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      }
    );

    // Axios response data
    const data = res.data;

    console.log("Response data:", data);
    return data; // optional: return it if you want to use it
  } catch (error) {
    console.error("Error signing up:", error);
  }
}
    

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yt-secondary font-youtube px-4">
      <div className="w-full max-w-md bg-yt-bg p-8 rounded-xl shadow-md border border-yt-border">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-bold text-yt-red">YouTube</h1>
        </div>

        <h2 className="text-xl font-medium text-center text-yt-text mb-6">
          Create your account
        </h2>

        {/* Form */}
        <form onSubmit={submitHandler}>
          {/* Channel Name */}
          <input
            type="text"
            placeholder="Channel Name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            required
            className="w-full border border-yt-border px-4 py-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yt-red"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-yt-border px-4 py-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yt-red"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-yt-border px-4 py-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yt-red"
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full border border-yt-border px-4 py-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yt-red"
          />

          {/* File upload / logo */}
          <div className="flex justify-center mb-6">
            <label className="cursor-pointer">
              <input type="file" onChange={fileHandler} className="hidden" />
              <div className="w-16 h-16 sm:w-20 sm:h-20 border border-yt-border rounded-full flex items-center justify-center bg-yt-secondary overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="logo preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-yt-textSecondary text-sm">Upload</span>
                )}
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yt-red hover:bg-yt-redHover text-white py-3 rounded-md font-medium transition"
          >
            Create Account
          </button>

          {/* Link */}
          <p className="text-sm text-center mt-4 text-yt-textSecondary">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;