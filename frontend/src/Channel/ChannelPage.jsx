import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import VideoCard from "../Videos/VideoCard";
import VideoModal from "../Modals/VideoModal";

export default function ChannelPage() {
  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null); // Null for upload, object for edit
  
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const fetchMyVideos = useCallback(async () => {
    try {
      const res = await axios.get("https://youtube-clone-zd16.onrender.com/video/get-video", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter videos to only show those belonging to the logged-in user
      const myVideos = (res.data.videos || []).filter(v => v.user_id?._id === currentUserId);
      setVideos(myVideos);
    } catch (err) { console.error(err); }
  }, [token, currentUserId]);

  useEffect(() => { fetchMyVideos(); }, [fetchMyVideos]);

  const openUpload = () => { setSelectedVideo(null); setIsModalOpen(true); };
  const openEdit = (video) => { setSelectedVideo(video); setIsModalOpen(true); };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0f0f0f]">
      {/* 1. Channel Header (Visual Banner) */}
      <div className="w-full">
        <div className="h-32 md:h-48 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
             {/* You can add a <img> for banner here */}
        </div>
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-end -mt-12 md:-mt-16 gap-6 pb-6 border-b dark:border-white/10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-gray-300 overflow-hidden shadow-lg">
             <img src={videos[0]?.user_id?.logoUrl} className="w-full h-full object-cover" alt="logo" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
              {videos[0]?.user_id?.channelName || "My Channel"}
            </h1>
            <p className="text-gray-500 text-sm">@{videos[0]?.user_id?.channelName?.replace(/\s/g, '')} • {videos.length} videos</p>
            <button 
              onClick={openUpload}
              className="mt-4 px-6 py-2 bg-black dark:bg-white dark:text-black text-white rounded-full font-medium hover:opacity-80 transition"
            >
              Upload New Video
            </button>
          </div>
        </div>
      </div>

      {/* 2. Video Grid */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div key={video._id} className="relative group">
            <VideoCard video={video} currentUserId={currentUserId} />
            {/* Overlay Edit/Delete Buttons for Channel View */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(video)} className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:scale-110">
                <i className="fa-solid fa-pen"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. The Shared Modal */}
      <VideoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedVideo}
        onRefresh={fetchMyVideos}
      />
    </div>
  );
}