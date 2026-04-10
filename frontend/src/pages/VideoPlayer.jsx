import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(
          `https://youtube-clone-zd16.onrender.com/video/${id}`
        );
        setVideo(res.data.video);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVideo();
  }, [id]);

  if (!video) return <p className="p-4">Loading...</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 bg-yt-bg">
      <div className="flex-1">

        {/* 🎬 Video */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <video
            src={video.vedioUrl}   // ✅ USE THIS (backend typo handled)
            controls
            autoPlay
            className="w-full h-full"
          />
        </div>

        {/* 🎯 Title */}
        <h1 className="text-xl font-bold mt-4 text-yt-text">
          {video.title}
        </h1>

        {/* 📊 Info */}
        <div className="flex flex-col md:flex-row justify-between mt-2 gap-4">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

            <div>
              <p className="font-bold">{video.channelName || "Channel Name"}</p>
              <p className="text-xs text-gray-500">
                {video.views || 0} views
              </p>
            </div>

            <button className="ml-4 bg-black text-white px-4 py-2 rounded-full text-sm">
              Subscribe
            </button>
          </div>

          {/* 👍 👎 */}
          <div className="flex bg-gray-200 rounded-full">
            <button className="px-4 py-2 border-r">
              👍 {video.likes || 0}
            </button>
            <button className="px-4 py-2">
              👎
            </button>
          </div>
        </div>

        {/* 📝 Description */}
        <div className="mt-4 bg-gray-100 p-3 rounded-lg">
          {video.description}
        </div>

      </div>
    </div>
  );
};

export default VideoPlayer;