import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import MyVideos from "../Components/Video/MyVideos";

const Account = () => {

  // =========================
  // 📌 STATES
  // =========================
  const [videos, setVideos] = useState([]); // ✅ FIX: missing state (YOU NEEDED THIS)
  const [videoFile, setVideoFile] = useState(null);

  const [channelName, setChannelName] = useState("");
  const [logo, setLogo] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [isLoading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // =========================
  // 📌 LOAD USER DATA
  // =========================
  useEffect(() => {
    setChannelName(localStorage.getItem("channelName") || "User");
    setLogo(localStorage.getItem("logo") || "");

    // ❌ YOU COMMENTED THIS BUT KEPT CALLING IT
    // fetchVideos(); ❌ FIX: removed call OR define function properly
  }, []);

  // =========================
  // 📌 FETCH VIDEOS (OPTIONAL FOR NOW)
  // =========================
  // const fetchVideos = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:8000/api/videos/my", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     // ✅ FIX: backend should return array
  //     setVideos(res.data.videos || []);
  //   } catch (err) {
  //     console.log(err);
  //     setVideos([]); // safety
  //   }
  // };

  // =========================
  // 📌 UPLOAD VIDEO
  // =========================
  const submitHandler = async (e) => {
    e.preventDefault();

    // ❌ FIX YOU MISSED THIS (you were using videos instead of videoFile)
    if (!videoFile || !thumbnail) {
      alert("Please upload video and thumbnail");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("video", videoFile);       // ✅ FIXED
    formData.append("thumbnail", thumbnail);   // ✅ FIXED

    try {
      const res = await axios.post(
        "https://youtube-clone-zd16.onrender.com/video/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);

      console.log(res.data); // ❌ FIXED (you were missing res)

      toast.success("Video uploaded successfully 🎉");

      // =========================
      // RESET FORM
      // =========================
      setTitle("");
      setDescription("");
      setCategory("");
      setTags("");
      setVideoFile(null);     
      setThumbnail(null);
      setImageUrl(null);

    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err?.response?.data?.error || "Upload failed");
    }
  };

  // =========================
  // 📌 VIDEO HANDLER
  // =========================
  const videoHandler = (e) => {
    setVideoFile(e.target.files[0]); // ✅ FIXED
  };

  // =========================
  // 📌 THUMBNAIL HANDLER
  // =========================
  const thumbnailHandler = (e) => {
    const file = e.target.files[0];

    if (file) {
      setThumbnail(file);

      const preview = URL.createObjectURL(file);
      setImageUrl(preview);
    }
  };

  // cleanup preview memory
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  // =========================
  // 📌 DELETE VIDEO
  // =========================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // fetchVideos(); ❌ commented for now
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-yt-bg dark:bg-yt-darkBg text-yt-text dark:text-yt-darkText font-youtube">

      <div className="flex-1 max-w-5xl mx-auto p-6">

        {/* CHANNEL HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={logo || "/images/default-avatar.png"}
            className="w-12 h-12 rounded-full border"
          />
          <h2 className="text-2xl font-semibold">{channelName}</h2>
        </div>

        {/* UPLOAD SECTION */}
        <div className="bg-white dark:bg-yt-darkSecondary p-6 rounded-2xl shadow mb-8">

          <h2 className="text-lg font-semibold mb-6">Upload Video</h2>

          <form onSubmit={submitHandler} className="grid md:grid-cols-2 gap-5">

            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2.5 rounded-lg"
              required
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2.5 rounded-lg"
              required
            >
              <option value="">Select Category</option>
              <option value="science">Science</option>
              <option value="technology">Technology</option>
              <option value="education">Education</option>
              <option value="motivation">Motivation</option>
              <option value="story">Story</option>
            </select>

            <input
              placeholder="Tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border p-2.5 rounded-lg md:col-span-2"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2.5 rounded-lg md:col-span-2"
            />

            {/* VIDEO */}
            <input
              type="file"
              accept="video/*"
              onChange={videoHandler}
              className="border p-2 rounded-lg"
              required
            />

            {/* THUMBNAIL */}
            <div className="flex flex-col gap-2 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={thumbnailHandler}
                className="border p-2 rounded-lg"
              />

              {imageUrl && (
                <img
                  src={imageUrl}
                  className="w-48 h-28 object-cover rounded-lg border"
                />
              )}
            </div>

            {/* BUTTON */}
            <div className="md:col-span-2 flex justify-center">
              <button
                type="submit"
                className="bg-yt-red text-white px-6 py-2 rounded-md"
              >
              {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </div>

          </form>
        </div>

        {/* VIDEO LIST */}
        <div className="bg-white dark:bg-yt-darkSecondary p-6 rounded-2xl shadow">

          <h2 className="text-lg font-semibold mb-6">Your Videos</h2>

          <MyVideos/>

        </div>

      </div>
    </div>
  );
};

export default Account;