import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VideoCard({
  video,
  isChannelPage,
  onEdit,
  onDelete,
  onChannelClick,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  // Close dropdown menu when clicking anywhere else on the window
  useEffect(() => {
    const closeMenu = () => setShowMenu(false);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    navigate(`/video/${video._id}`);
  };

  const handleChannel = (e) => {
    e.stopPropagation();
    if (onChannelClick) {
      onChannelClick(video);
    }
  };

  // ✅ Fallback for broken thumbnails (Fixes ERR_CONNECTION_CLOSED)
  const addDefaultImg = (ev) => {
    ev.target.src =
      "https://via.assets.so/img.jpg?w=400&h=225&tc=white&bg=#cecece&t=No+Thumbnail";
  };

  // ✅ Fallback for broken avatars
  const addDefaultAvatar = (ev) => {
    ev.target.src =
      "https://api.dicebear.com/7.x/initials/svg?seed=" +
      (video.user_id?.channelName || "U");
  };

  return (
    <div className="flex flex-col gap-3 cursor-pointer group relative overflow-visible">
      {/* THUMBNAIL SECTION */}
      <div
        onClick={handleVideoClick}
        className="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          onError={addDefaultImg} // ✅ Handles thumbnail load errors
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] px-1.5 py-0.5 rounded">
          {video.duration || "12:45"}
        </span>
      </div>

      {/* DETAILS SECTION */}
      <div className="flex gap-3 px-1 overflow-visible">
        {/* CHANNEL AVATAR */}
        {!isChannelPage && (
          <img
            onClick={handleChannel}
            src={video.user_id?.logoUrl || video.user_id?.profilePic}
            onError={addDefaultAvatar} // ✅ Handles avatar load errors
            className="w-9 h-9 rounded-full object-cover mt-1 cursor-pointer"
            alt="channel logo"
          />
        )}

        <div className="flex flex-1 flex-col relative overflow-visible">
          <div className="flex justify-between items-start">
            {/* VIDEO TITLE */}
            <h3
              onClick={handleVideoClick}
              className="font-semibold text-[15px] text-[#0f0f0f] dark:text-white line-clamp-2 cursor-pointer"
            >
              {video.title}
            </h3>

            {/* OPTIONS MENU (Visible on Channel Page) */}
            {isChannelPage && (
              <div
                className="relative ml-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleMenuToggle}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800"
                >
                  <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-8 w-32 bg-white dark:bg-[#212121] shadow-2xl rounded-lg z-[9999] border dark:border-zinc-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(video);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <i className="fa-solid fa-pen"></i> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(video._id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 text-red-600 flex items-center gap-2"
                    >
                      <i className="fa-solid fa-trash"></i> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CHANNEL NAME */}
          <p
            onClick={handleChannel}
            className="text-[#606060] dark:text-[#aaa] text-[13px] mt-1 hover:text-black dark:hover:text-white cursor-pointer"
          >
            {video.user_id?.channelName}
          </p>

          {/* METADATA */}
          <p className="text-[#606060] dark:text-[#aaa] text-[13px]">
            {video.views || 0} views •{" "}
            {new Date(video.createdAt).toLocaleDateString()}
          </p>

          {/* CATEGORY TAG */}
          {!isChannelPage && video.category && (
            <p className="text-[12px] text-zinc-500 capitalize">
              {video.category}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
