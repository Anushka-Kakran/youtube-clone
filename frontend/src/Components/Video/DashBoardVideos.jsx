import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryBar from "../CategoryBar";
import { useNavigate } from "react-router-dom";
import VideoCard from "./VideoCard";

export default function DashboardVideos({ searchQuery }) {
  const [videos, setVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // =========================
  // FETCH VIDEOS (YOUR API)
  // =========================
  const fetchVideos = async () => {
    try {
      const res = await axios.get(
        "https://youtube-clone-zd16.onrender.com/video/own-video",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVideos(res.data.videos || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) fetchVideos();
  }, [token]);

  // =========================
  // CATEGORY FILTER
  // =========================
  const filteredVideos =
    activeCategory === "All"
      ? videos
      : videos.filter(
          (v) =>
            v.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  // =========================
  // SEARCH FILTER
  // =========================
  const finalVideos = filteredVideos.filter((v) =>
    v.title?.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  );

  // =========================
  // OPEN CHANNEL
  // =========================
  const handleChannelClick = (video) => {
    localStorage.setItem("channelName", video.user_id?.channelName);
    localStorage.setItem("logo", video.user_id?.logoUrl);
    localStorage.setItem("userId", video.user_id?._id);

    navigate("/account"); // 👉 open MyAccount
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
      
      {/* CATEGORY BAR */}
      <CategoryBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* VIDEOS GRID */}
       <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
  {finalVideos.length === 0 ? (
    /* ✅ LOGIC ADDED: Category-specific empty state */
    <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50 dark:text-white">
      <i className="fa-solid fa-video-slash text-5xl mb-4 text-gray-400"></i>
      <h2 className="text-xl font-semibold text-gray-500">
        {activeCategory === "All"
          ? "No videos uploaded yet 🚫"
          : `No videos found in "${activeCategory}"`}
      </h2>
      <p className="text-sm text-gray-400 mt-2">
        Try switching categories or searching for something else.
      </p>
    </div>
  ) : (
    /* ✅ MAPPING: Using VideoCard for consistent views/date/timing */
  finalVideos.map((video) => (
  <VideoCard 
    key={video._id}
    video={video}
    isChannelPage={false}
    onChannelClick={handleChannelClick} // ✅ pass function only
  />
))
  )}
</div>
    </div>
  );
}