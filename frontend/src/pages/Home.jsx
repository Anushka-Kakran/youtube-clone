const Home = () => {
  const categories = ["All", "Live", "Gaming", "Music", "Coding", "News", "Sports"]; // At least 6 [cite: 482]

  return (
    <div className="bg-yt-bg dark:bg-yt-darkBg min-h-screen">
      {/* Category Filter - Scrollable on mobile */}
      <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar border-b border-yt-border dark:border-yt-darkBorder sticky top-0 bg-yt-bg dark:bg-yt-darkBg z-30">
        {categories.map(cat => (
          <button key={cat} className="whitespace-nowrap px-3 py-1 bg-yt-secondary dark:bg-yt-darkSecondary dark:text-yt-darkText rounded-lg text-sm hover:bg-gray-200 transition-colors">
            {cat}
          </button>
        ))}
      </div>

      {/* Grid: 1 col on mobile, 2 on tablet, 3-4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 p-4">
        {/* Video Card Logic goes here */}
        <div className="flex flex-col gap-2">
          <div className="aspect-video bg-gray-200 dark:bg-yt-darkSecondary rounded-xl overflow-hidden">
             <img src="https://via.placeholder.com/640x360" className="w-full h-full object-cover" alt="thumb" />
          </div>
          <div className="flex gap-3 px-1">
            <div className="w-9 h-9 rounded-full bg-gray-400 shrink-0"></div>
            <div>
              <h3 className="text-sm font-bold text-yt-text dark:text-yt-darkText line-clamp-2">Responsive MERN Capstone Tutorial</h3>
              <p className="text-xs text-yt-textSecondary mt-1">Channel Name</p>
              <p className="text-xs text-yt-textSecondary">50K views • 1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;