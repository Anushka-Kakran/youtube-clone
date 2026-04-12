import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryBar from "../CategoryBar";
import VideoCard from "./VideoCard";
import ChannelHeader from "../Channel/ChannelHeader";
import VideoModal from "../Modals/VideoModal";

export default function MyVideos({ searchQuery, isAccountPage = true }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [videos, setVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const fetchVideos = async () => {
    try {
      const res = await axios.get(
        "https://youtube-clone-zd16.onrender.com/video/own-video",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const allVideos = res.data.videos || [];

      const displayVideos = isAccountPage
        ? allVideos.filter((v) => v.user_id?._id === currentUserId)
        : allVideos;

      setVideos(displayVideos);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    if (token) fetchVideos();
  }, [token, isAccountPage]);

  // ✅ CATEGORY FILTER (ADDED)
  const filteredVideos =
    activeCategory === "All"
      ? videos
      : videos.filter(
          (video) =>
            video.category?.toLowerCase() === activeCategory.toLowerCase(),
        );

  // Modal Handlers
  const handleOpenUpload = () => {
    setSelectedVideo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await axios.delete(
        `https://youtube-clone-zd16.onrender.com/video/${videoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchVideos();
    } catch (err) {
      alert("Error deleting video");
    }
  };

  return (
    <div className="w-full  min-h-screen bg-white dark:bg-[#0f0f0f]">
      {isAccountPage && (
        <ChannelHeader
          channelName={
            videos[0]?.user_id?.channelName || user?.channelName || "My Channel"
          }
          logoUrl={videos[0]?.user_id?.logoUrl || user?.logoUrl}
          videoCount={videos.length}
          onUploadClick={handleOpenUpload}
        />
      )}

      <CategoryBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* ✅ UPDATED GRID */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10 overflow-visible">
        {filteredVideos.length === 0 ? (
          // ✅ EMPTY MESSAGE (ADDED)
          <div className="col-span-full text-center mt-20">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
              {activeCategory === "All"
                ? "No videos uploaded yet 🚫"
                : `No videos found in "${activeCategory}"`}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Try uploading a video or switch category
            </p>
          </div>
        ) : (
          filteredVideos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              isChannelPage={isAccountPage}
              onDelete={() => handleDelete(video._id)}
              onEdit={() => handleOpenEdit(video)}
            />
          ))
        )}
      </div>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedVideo}
        onRefresh={fetchVideos}
      />
    </div>
  );
}
