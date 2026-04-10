import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Account = () => {
  const [videos, setVideos] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [logo, setLogo] = useState("");

  // ✅ FORM STATES
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ LOAD DATA
  useEffect(() => {
    setChannelName(localStorage.getItem("channelName") || "User");
    setLogo(localStorage.getItem("logo") || "");
    fetchVideos();
  }, []);

  // ✅ GET VIDEOS
  const fetchVideos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/videos/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ UPLOAD VIDEO
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!videos|| !thumbnail) {
      alert("Please upload video and thumbnail");
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("video", videos);    
    formData.append("thumbnail", thumbnail);  

    try {
      await axios.post("https://youtube-clone-zd16.onrender.com/video/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      console.log(res.data);
       toast("Vedio is uploaded...")

      // ✅ RESET FORM
      setTitle("");
      setDescription("");
      setCategory("");
      setTags("");
      setVideos(null);
      setThumbnail(null);

      fetchVideos();
      alert("Video Uploaded Successfully 🎉");
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err.response.data.error)
    }
  };

  // ✅ DELETE VIDEO
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVideos();
    } catch (err) {
      console.log(err);
    }
  };
   
  const videoHandler = (e) => {
    setVideos(e.target.value);

  }

 const thumbnailHandler = (e) => {
  const file = e.target.files[0];

  if (file) {
    setThumbnail(file); // for backend upload

    // ✅ create preview URL
    const preview = URL.createObjectURL(file);
    setImageUrl(preview);
  }
};
useEffect(() => {
  return () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  };
}, [imageUrl]);

  return (
  <div className="flex min-h-screen bg-yt-bg dark:bg-yt-darkBg text-yt-text dark:text-yt-darkText font-youtube">

  <div className="flex-1 max-w-5xl mx-auto p-6">

    {/* 🔥 CHANNEL HEADER */}
    <div className="flex items-center gap-4 mb-8">
      <img
        src={logo || "https://via.placeholder.com/150"}
        className="w-12 h-12 rounded-full border"
      />
      <h2 className="text-2xl font-semibold">{channelName}</h2>
    </div>

    {/* 🚀 UPLOAD SECTION */}
    <div className="bg-white dark:bg-yt-darkSecondary p-6 rounded-2xl shadow mb-8">

      <h2 className="text-lg font-semibold mb-6">Upload Video</h2>

      <form onSubmit={submitHandler} className="grid md:grid-cols-2 gap-5">

        {/* TITLE */}
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-yt-border dark:border-yt-darkBorder p-2.5 rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-yt-red"
          required
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-yt-border dark:border-yt-darkBorder p-2.5 rounded-lg bg-transparent outline-none"
          required
        >
          <option value="">Select Category</option>
          <option value="science">Science</option>
          <option value="technology">Technology</option>
          <option value="education">Education</option>
          <option value="motivation">Motivation</option>
          <option value="story">Story</option>
        </select>

        {/* TAGS */}
        <input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border border-yt-border p-2.5 rounded-lg md:col-span-2"
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="border border-yt-border p-2.5 rounded-lg md:col-span-2 resize-none"
        />

        {/* VIDEO UPLOAD */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={videoHandler}
            className="border p-2 rounded-lg cursor-pointer"
            required
          />
        </div>

        {/* THUMBNAIL UPLOAD */}
        <div className="flex flex-col gap-2 items-center">
          <label className="text-sm font-medium">Thumbnail</label>

          <input
            type="file"
            accept="image/*"
            onChange={thumbnailHandler}
            className="border p-2 rounded-lg cursor-pointer w-full"
          />

          {imageUrl && (
            <img
              src={imageUrl}
              alt="thumbnail preview"
              className="w-48 h-28 object-cover rounded-lg border shadow mt-2"
            />
          )}
        </div>

        {/* 🔥 BUTTON */}
        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            className="bg-yt-red hover:bg-yt-redHover text-white px-6 py-2 rounded-md flex items-center gap-2 text-md font-medium transition"
          >
            <i className="fa-solid fa-upload"></i>

            {isLoading ? "Uploading..." : "Upload"}

            {isLoading && (
              <i className="fa-solid fa-spinner fa-spin"></i>
            )}
          </button>
        </div>

      </form>
    </div>

    {/* 🎬 VIDEO LIST */}
    <div className="bg-white dark:bg-yt-darkSecondary p-6 rounded-2xl shadow">

      <h2 className="text-lg font-semibold mb-6">Your Videos</h2>

      {videos.length === 0 ? (
        <p className="text-gray-500 text-center">No videos uploaded yet</p>
      ) : (
        <div className="space-y-4">
          {videos.map((v) => (
            <div
              key={v._id}
              className="flex items-center gap-4 border-b border-yt-border pb-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition"
            >

              {/* 🎥 VIDEO */}
              <video
                src={v.videoUrl}
                controls
                className="w-44 h-24 rounded-lg object-cover"
              />

              {/* 📄 INFO */}
              <div className="flex-1">
                <h3 className="font-medium">{v.title}</h3>
                <p className="text-sm text-gray-500">
                  {v.views || 0} views
                </p>
              </div>

              {/* 🗑 DELETE */}
              <button
                onClick={() => handleDelete(v._id)}
                className="text-red-500 hover:text-red-600"
              >
                <i className="fa-solid fa-trash"></i>
              </button>

            </div>
          ))}
        </div>
      )}
    </div>

  </div>
</div>
  );
};

export default Account;