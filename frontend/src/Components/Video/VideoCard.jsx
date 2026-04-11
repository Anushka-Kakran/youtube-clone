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

  useEffect(() => {
    const closeMenu = () => setShowMenu(false);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // ✅ VIDEO CLICK → OPEN PLAYER
  const handleVideoClick = (e) => {
    e.stopPropagation(); // ✅ FIX
    navigate(`/video/${video._id}`); // ✅ ONLY NAVIGATE
  };

  // ✅ CHANNEL CLICK → OPEN ACCOUNT
  const handleChannel = (e) => {
    e.stopPropagation();
    if (onChannelClick) {
      onChannelClick(video);
    }
  };

  return (
    <div className="flex flex-col gap-3 cursor-pointer group relative overflow-visible">

      {/* ✅ THUMBNAIL CLICK */}
      <div
        onClick={handleVideoClick}
        className="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] px-1.5 py-0.5 rounded">
          {video.duration || "12:45"}
        </span>
      </div>

      {/* DETAILS */}
      <div className="flex gap-3 px-1 overflow-visible">

        {/* ✅ CHANNEL LOGO CLICK */}
        {!isChannelPage && (
          <img
            onClick={handleChannel}
            src={video.user_id?.logoUrl || "https://via.placeholder.com/36"}
            className="w-9 h-9 rounded-full object-cover mt-1 cursor-pointer"
            alt="channel logo"
          />
        )}

        <div className="flex flex-1 flex-col relative overflow-visible">

          {/* TITLE + MENU */}
          <div className="flex justify-between items-start">

            {/* ✅ TITLE CLICK */}
            <h3
              onClick={handleVideoClick}
              className="font-semibold text-[15px] text-[#0f0f0f] dark:text-white line-clamp-2 cursor-pointer"
            >
              {video.title}
            </h3>

            {/* ACCOUNT MENU */}
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

          {/* ✅ CHANNEL NAME CLICK */}
          <p
            onClick={handleChannel}
            className="text-[#606060] dark:text-[#aaa] text-[13px] mt-1 hover:text-black dark:hover:text-white cursor-pointer"
          >
            {video.user_id?.channelName}
          </p>

          {/* VIEWS */}
          <p className="text-[#606060] dark:text-[#aaa] text-[13px]">
            {video.views || 0} views •{" "}
            {new Date(video.createdAt).toLocaleDateString()}
          </p>

          {/* CATEGORY */}
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