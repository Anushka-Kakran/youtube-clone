import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import VideoCard from "./Video/VideoCard"; // Adjust path based on your file structure

export default function SearchResults() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use useLocation to get the query string (?search_query=...)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search_query")?.toLowerCase() || "";

  useEffect(() => {
    const fetchAndFilterVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://youtube-clone-zd16.onrender.com/video/all-videos",
        );
        const allVideos = res.data.videos || [];

        // Filter videos based on title or description matching the search query
        const filtered = allVideos.filter(
          (v) =>
            v.title?.toLowerCase().includes(searchQuery) ||
            v.description?.toLowerCase().includes(searchQuery) ||
            v.category?.toLowerCase().includes(searchQuery),
        );

        setVideos(filtered);
      } catch (err) {
        console.error("Search fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchAndFilterVideos();
    }
  }, [searchQuery]); // Re-run whenever the search query changes

  if (loading) return <div className="p-10">Searching...</div>;

  return (
    <div className="p-4 lg:px-20 bg-white min-h-screen">
      <h2 className="text-xl mb-4">
        Results for: <b>{searchQuery}</b>
      </h2>

      {videos.length === 0 ? (
        <p>No videos found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
