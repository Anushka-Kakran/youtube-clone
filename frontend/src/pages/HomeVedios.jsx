import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryBar from "../Components/CategoryBar";
import VideoCard from "../Components/Video/VideoCard";
import { useOutletContext } from "react-router-dom";

export default function HomeVideos() {
  const { searchQuery } = useOutletContext(); // ✅ GET FROM LAYOUT

  const [allVideos, setAllVideos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // FETCH VIDEOS
  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "https://youtube-clone-zd16.onrender.com/video/all-videos",
        );

        const data = res.data.videos || [];

        setAllVideos(data);
        setVideos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllVideos();
  }, []);

  // FILTER LOGIC (SEARCH + CATEGORY)
  useEffect(() => {
    const term = searchQuery?.toLowerCase().trim();

    const filtered = allVideos.filter((v) => {
      const matchesCategory =
        activeCategory === "All" ||
        v.category?.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        !term ||
        v.title?.toLowerCase().includes(term) ||
        v.description?.toLowerCase().includes(term) ||
        v.user_id?.channelName?.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });

    setVideos(filtered);
  }, [searchQuery, activeCategory, allVideos]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading your feed...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0f0f0f]">
      {/* CATEGORY BAR */}
      <CategoryBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* VIDEOS */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.length > 0 ? (
          videos.map((video) => <VideoCard key={video._id} video={video} />)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <i className="fas fa-video-slash text-5xl text-gray-300 mb-4"></i>

            <h3 className="text-xl font-semibold text-gray-700">
              No videos available
            </h3>
            <p className="text-gray-500 mt-1">
              We couldn't find any videos matching your criteria. Try adjusting
              your filters or upload a new one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
