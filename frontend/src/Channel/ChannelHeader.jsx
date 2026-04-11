import React from 'react';

const ChannelHeader = ({ channelName, logoUrl, videoCount, onUploadClick }) => {
  return (
    <div className="w-full">
      {/* Professional Banner */}
      <div className="w-full h-32 md:h-48 bg-gradient-to-r from-[#2196f3] to-[#f44336] rounded-xl overflow-hidden shadow-inner">
        {/* Placeholder for actual banner image if available */}
      </div>

      {/* Profile & Action Area */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start gap-6 py-6 border-b dark:border-white/10">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-[#0f0f0f] bg-gray-200 overflow-hidden -mt-12 md:-mt-16 shadow-lg">
          <img 
            src={logoUrl || "https://via.placeholder.com/150"} 
            className="w-full h-full object-cover" 
            alt="Channel Logo" 
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold dark:text-white">{channelName || "Channel Name"}</h1>
          <p className="text-gray-500 text-sm mt-1">
            @{channelName?.replace(/\s+/g, '').toLowerCase()} • {videoCount} videos
          </p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
            <button 
              onClick={onUploadClick}
              className="px-6 py-2 bg-black dark:bg-white dark:text-black text-white rounded-full font-bold hover:opacity-80 transition"
            >
              Upload Video
            </button>
            <button className="px-6 py-2 bg-gray-100 dark:bg-[#272727] dark:text-white rounded-full font-bold hover:bg-gray-200">
              Customize Channel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;