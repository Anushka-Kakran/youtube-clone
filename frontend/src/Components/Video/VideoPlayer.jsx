import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function VideoPlayer() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("token");

  // =========================
  // FETCH VIDEO
  // =========================
  const fetchVideo = async () => {
    try {
      const res = await axios.get(
        `https://youtube-clone-zd16.onrender.com/video/own-video`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const all = res.data.videos || [];
      const current = all.find((v) => v._id === id);

      setVideo(current);
      setSuggested(all.filter((v) => v._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [id]);

  // =========================
  // LIKE / DISLIKE
  // =========================
  const handleLike = async () => {
    await axios.put(
      `https://youtube-clone-zd16.onrender.com/video/like/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    fetchVideo();
  };

  const handleDislike = async () => {
    await axios.put(
      `https://youtube-clone-zd16.onrender.com/video/dislike/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    fetchVideo();
  };

  if (!video) return <div className="p-5 text-white">Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-4 bg-black text-white">
      {/* ================= LEFT (VIDEO) ================= */}
      <div className="flex-1">
        {/* VIDEO PLAYER */}
        <video
          src={video.videoUrl}
          controls
          className="w-full rounded-lg max-h-[500px]"
        />

        {/* TITLE */}
        <h2 className="text-xl font-semibold mt-3">{video.title}</h2>

        {/* CHANNEL + ACTIONS */}
        <div className="flex justify-between items-center mt-3 flex-wrap gap-3">
          {/* CHANNEL */}
          <div className="flex items-center gap-3">
            <img
              src={video.user_id?.logoUrl}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{video.user_id?.channelName}</p>
              <button className="bg-white text-black px-3 py-1 rounded-full text-sm mt-1">
                Subscribe
              </button>
            </div>
          </div>

          {/* LIKE / DISLIKE */}
          <div className="flex gap-3">
            <button
              onClick={handleLike}
              className="bg-zinc-800 px-3 py-1 rounded"
            >
              👍 {video.likes || 0}
            </button>
            <button
              onClick={handleDislike}
              className="bg-zinc-800 px-3 py-1 rounded"
            >
              👎 {video.dislike || 0}
            </button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-zinc-900 p-3 rounded mt-4">
          <p className="text-sm">{video.description}</p>
        </div>

        {/* COMMENTS */}
        <div className="mt-5">
          <h3 className="font-semibold mb-2">Comments</h3>

          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 rounded bg-zinc-800"
          />

          <button className="mt-2 bg-blue-600 px-3 py-1 rounded">
            Comment
          </button>
        </div>
      </div>

      {/* ================= RIGHT (SUGGESTED) ================= */}
      <div className="w-full lg:w-[350px] space-y-3">
        {suggested.map((v) => (
          <div key={v._id} className="flex gap-2 cursor-pointer">
            <img
              src={v.thumbnailUrl}
              className="w-40 h-24 object-cover rounded"
            />

            <div>
              <p className="text-sm font-semibold line-clamp-2">{v.title}</p>
              <p className="text-xs text-gray-400">{v.user_id?.channelName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
