const ChannelPage = () => {
  return (
    <div className="bg-yt-bg min-h-screen">
      <div className="h-32 md:h-48 bg-gray-200 w-full"></div> {/* Banner */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-6 -mt-8 md:-mt-12 pb-6">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white p-1 rounded-full">
            <div className="w-full h-full bg-gray-300 rounded-full border-4 border-white"></div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-yt-text">Channel Name</h1>
            <p className="text-yt-textSecondary">@handle • 10 videos</p>
            <button className="mt-4 bg-yt-secondary px-4 py-2 rounded-full font-medium hover:bg-yt-grayHover">
              Customize Channel
            </button>
          </div>
        </div>
        <div className="border-b border-yt-border mb-4">
          <button className="pb-2 border-b-2 border-yt-text font-medium px-4">Videos</button>
        </div>
        {/* List of Channel Videos with Edit/Delete options [cite: 551] */}
      </div>
    </div>
  );
};

export default ChannelPage; 