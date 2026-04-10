import axios from "axios";
import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [channelName, setChannelName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [logo, setLogo] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  async function userData(formData) {
    try {
      const res = await axios.post(
        "https://youtube-clone-zd16.onrender.com/user/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // console.log("Signup success:", res.data);
      navigate('/login')
      toast("Account is created...")
      return res.data;
    }catch (error) {
      setLoading(false);
      toast.error(error.response.data.error);
    } finally {
      setLoading(false); // always stop loading
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); 

    const formData = new FormData();
    formData.append("channelName", channelName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);
    if (logo) formData.append("logo", logoUrl);

    await userData(formData); // will setLoading(false) inside userData
  };

  return (
    <div className="min-h-screen flex items-center bg-yt-bg dark:bg-yt-darkBg text-yt-text dark:text-yt-darkText justify-center font-youtube px-4">
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


          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading} // disable button while loading
            className={`w-full ${
              isLoading
                ? "bg-yt-red/70 cursor-not-allowed"
                : "bg-yt-red hover:bg-yt-redHover"
            } text-white py-3 rounded-md font-medium transition flex items-center justify-center gap-2`}
          >
            {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
            {isLoading ? "Creating..." : "Create Account"}
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
