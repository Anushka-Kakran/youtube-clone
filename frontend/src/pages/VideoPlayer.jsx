import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [isExpanded, setExpanded] = useState(false);
  const [video, setVideo] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Retrieve individual keys from localStorage
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const formatTimeAgo = (date) => {
    if (!date) return "Long ago";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    return "Just now";
  };

  const fetchData = async () => {
    try {
      // ✅ ADDED: Increment view count on the backend first
      await axios.put(
        `https://youtube-clone-zd16.onrender.com/video/views/${id}`,
      );

      // Rest of your existing logic remains exactly the same
      const res = await axios.get(
        `https://youtube-clone-zd16.onrender.com/video/all-videos`,
      );

      const allVideos = res.data.videos || [];
      const currentVideo = allVideos.find((v) => v._id === id);

      if (currentVideo) {
        setVideo({
          ...currentVideo,
          likedBy: currentVideo.likedBy || [],
          dislikedBy: currentVideo.dislikedBy || [],
        });

        const subbed = currentVideo?.user_id?.subscribedBy?.some(
          (uid) => uid.toString() === currentUserId?.toString(),
        );
        setIsSubscribed(!!subbed);
      }

      setPlaylist(allVideos);
      fetchComments();
    } catch (err) {
      console.error("View update or data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `https://youtube-clone-zd16.onrender.com/comment/${id}`,
      );
      setAllComments(res.data.commentList || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleSubscribeToggle = async () => {
    const channelId = video?.user_id?._id;
    // Check currentUserId instead of currentUser
    if (!channelId || !currentUserId) return;

    if (channelId === currentUserId) {
      alert("You cannot subscribe to your own channel");
      return;
    }

    const prevSubState = isSubscribed;
    setIsSubscribed(!prevSubState);

    setVideo((prev) => ({
      ...prev,
      user_id: {
        ...prev.user_id,
        subscribers: prevSubState
          ? Math.max(0, (prev.user_id.subscribers || 1) - 1)
          : (prev.user_id.subscribers || 0) + 1,
      },
    }));

    try {
      const url = prevSubState
        ? `https://youtube-clone-zd16.onrender.com/user/unsubscribe/${channelId}`
        : `https://youtube-clone-zd16.onrender.com/user/subscribe/${channelId}`;

      await axios.put(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      setIsSubscribed(prevSubState);
      fetchData();
      console.error("Subscription failed", err);
    }
  };

  const handleLike = async () => {
    // 1. Prevent action if already liked
    if (video?.likedBy?.includes(currentUserId)) return;

    // 2. Optimistic Update
    setVideo((prev) => ({
      ...prev,
      likes: (prev.likes || 0) + 1,
      // Decrease dislike only if user was in the dislikedBy array
      dislike: prev.dislikedBy?.includes(currentUserId)
        ? Math.max(0, prev.dislike - 1)
        : prev.dislike,
      likedBy: [...(prev.likedBy || []), currentUserId],
      dislikedBy: prev.dislikedBy?.filter((uid) => uid !== currentUserId),
    }));

    try {
      await axios.put(
        `https://youtube-clone-zd16.onrender.com/video/like/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (e) {
      fetchData(); // Rollback on error
    }
  };

  const handleDislike = async () => {
    // 1. Prevent action if already disliked
    if (video?.dislikedBy?.includes(currentUserId)) return;

    // 2. Optimistic Update
    setVideo((prev) => ({
      ...prev,
      dislike: (prev.dislike || 0) + 1,
      // Decrease likes only if user was in the likedBy array
      likes: prev.likedBy?.includes(currentUserId)
        ? Math.max(0, prev.likes - 1)
        : prev.likes,
      dislikedBy: [...(prev.dislikedBy || []), currentUserId],
      likedBy: prev.likedBy?.filter((uid) => uid !== currentUserId),
    }));

    try {
      await axios.put(
        `https://youtube-clone-zd16.onrender.com/video/dislike/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (e) {
      fetchData(); // Rollback on error
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post(
        `https://youtube-clone-zd16.onrender.com/comment/new-comment/${id}`,
        { commentText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCommentText("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(
        `https://youtube-clone-zd16.onrender.com/comment/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await axios.put(
        `https://youtube-clone-zd16.onrender.com/comment/${commentId}`,
        { commentText: editValue },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setEditingCommentId(null);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-black">Loading...</div>;
  if (!video) return <div className="p-10 text-black">Video not found</div>;

  return (
    <div className="bg-white min-h-screen text-black font-sans pb-10">
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:px-20">
        <div className="flex-1">
          <div className="rounded-xl overflow-hidden bg-black aspect-video">
            <video
              ref={videoRef}
              key={video._id}
              src={video.vedioUrl}
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>

          <h1 className="text-xl font-bold mt-4">{video.title}</h1>

          <div className="flex flex-wrap items-center justify-between mt-3 gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <img
                src={video.user_id?.logoUrl}
                className="w-10 h-10 rounded-full object-cover"
                alt="logo"
              />
              <div className="mr-6">
                <p className="font-bold text-base">
                  {video.user_id?.channelName}
                </p>
                <p className="text-xs text-zinc-500">
                  {video?.user_id?.subscribers || 0} subscribers
                </p>
              </div>

              <button
                onClick={handleSubscribeToggle}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                  isSubscribed
                    ? "bg-zinc-200 text-black"
                    : "bg-black text-white"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>

            <div className="flex bg-zinc-100 rounded-full h-9 overflow-hidden">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-5 hover:bg-zinc-200 border-r border-zinc-300 transition-colors ${
                  video?.likedBy?.includes(currentUserId)
                    ? "text-blue-600"
                    : "text-black"
                }`}
              >
                👍 <span className="font-bold text-sm">{video.likes || 0}</span>
              </button>

              <button
                onClick={handleDislike}
                className={`flex items-center gap-2 px-5 hover:bg-zinc-200 transition-colors ${
                  video?.dislikedBy?.includes(currentUserId)
                    ? "text-red-600"
                    : "text-black"
                }`}
              >
                👎{" "}
                <span className="font-bold text-sm">{video.dislike || 0}</span>
              </button>
            </div>
          </div>

          <div className="bg-zinc-100 p-3 rounded-xl mt-4 text-sm">
            <p className="font-bold">
              {video.views || 0} views • {formatTimeAgo(video.createdAt)}
            </p>
            <p className="text-zinc-700 mt-1 whitespace-pre-line">
              {isExpanded
                ? video?.description
                : video?.description?.split(" ")?.slice(0, 30).join(" ")}
              {video?.description?.split(" ")?.length > 30 && (
                <span
                  onClick={() => setExpanded(!isExpanded)}
                  className="ml-2 text-blue-600 cursor-pointer font-semibold"
                >
                  {isExpanded ? "view less" : "view more"}
                </span>
              )}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-bold mb-4">{allComments.length} Comments</h3>
            <div className="flex gap-4 mb-8">
              {/* Fixed: Use userLogo instead of currentUser */}
              <img
                src={video.user_id?.logoUrl}
                className="w-10 h-10 rounded-full shrink-0"
                alt="me"
              />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-300 focus:border-black outline-none pb-1 text-sm"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleCommentSubmit}
                    className="bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-bold"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {allComments.map((comment) => {
                // 1. Check if comment and userId actually exist (Defensive Programming)
                const userData = comment.userId;
                const isUserPopulated =
                  userData && typeof userData === "object";

                // 2. Logic for Ownership (Check string ID vs string ID)
                const isOwner =
                  currentUserId &&
                  isUserPopulated &&
                  String(userData._id) === String(currentUserId);

                // 3. Fallback values if the backend failed to populate logoUrl or channelName
                const commenterLogo =
                  isUserPopulated && userData.logoUrl
                    ? userData.logoUrl
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.channelName || "U")}&background=random`;

                const commenterName =
                  isUserPopulated && userData.channelName
                    ? userData.channelName
                    : "Anonymous User";

                return (
                  <div
                    key={comment._id}
                    className="flex gap-3 items-start group py-2"
                  >
                    {/* Profile Image with Error Handling */}
                    <img
                      src={commenterLogo}
                      className="w-10 h-10 rounded-full object-cover shrink-0 bg-zinc-200"
                      alt="user"
                      onError={(e) => {
                        // Final fallback if the URL itself is dead
                        e.target.src =
                          "https://ui-avatars.com/api/?name=User&background=gray";
                      }}
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold">@{commenterName}</p>
                          <span className="text-[10px] text-zinc-500">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>

                        {/* Edit/Delete Logic */}
                        {isOwner && (
                          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingCommentId(comment._id);
                                setEditValue(comment.commentText);
                              }}
                              className="text-[10px] text-blue-600 font-bold hover:underline"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-[10px] text-red-600 font-bold hover:underline"
                            >
                              DELETE
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Comment Body */}
                      {editingCommentId === comment._id ? (
                        <div className="mt-2">
                          <input
                            className="w-full border-b border-black outline-none text-sm py-1 bg-transparent"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <div className="flex gap-4 mt-2">
                            <button
                              onClick={() => handleUpdateComment(comment._id)}
                              className="text-xs font-bold text-green-600"
                            >
                              SAVE
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="text-xs font-bold text-gray-500"
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm mt-1 text-zinc-800">
                          {comment.commentText}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-sm">
            <div className="p-3 border-b bg-zinc-50 font-bold text-sm">
              Next Videos
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {playlist.map((item, index) => (
                <div
                  key={item._id}
                  className={`flex gap-2 p-2 cursor-pointer hover:bg-zinc-100 ${item._id === id ? "bg-zinc-100" : ""}`}
                  onClick={() => navigate(`/video/${item._id}`)}
                >
                  <span className="text-[10px] text-zinc-400 self-center w-4 text-center">
                    {index + 1}
                  </span>
                  <img
                    src={item.thumbnailUrl}
                    className="w-28 h-16 rounded-lg object-cover"
                    alt="thumb"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold line-clamp-2 leading-tight">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {item.user_id?.channelName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
