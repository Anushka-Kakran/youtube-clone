import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import FilterBar from "../Video/FilterBar";
import VideoCard from "../Video/MyVideos";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [videos, setVideos] = useState([]);

  // ✅ Fetch videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          "https://youtube-clone-zd16.onrender.com/video"
        );
        setVideos(res.data.videos);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar onMenuToggle={() => setSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-yt-bg">
          <FilterBar />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            
            {/* ✅ Real videos */}
            {videos.length > 0 ? (
              videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))
            ) : (
              <p>Loading videos...</p>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;