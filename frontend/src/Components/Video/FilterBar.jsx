// 1. Create the filtered list
const filteredVideos = videos.filter((video) => {
  const matchesCategory = activeCategory === "All" || 
    video.category?.toLowerCase() === activeCategory.toLowerCase();
  
  const matchesSearch = !searchQuery || 
    video.title?.toLowerCase().includes(searchQuery.toLowerCase());

  return matchesCategory && matchesSearch;
});

return (
  <div className="w-full min-h-screen bg-white dark:bg-[#0f0f0f]">
    {isAccountPage && (
      <ChannelHeader 
        channelName={videos[0]?.user_id?.channelName}
        logoUrl={videos[0]?.user_id?.logoUrl}
        videoCount={videos.length}
        onUploadClick={handleOpenUpload}
      />
    )}

    <CategoryBar 
      activeCategory={activeCategory} 
      setActiveCategory={setActiveCategory} 
    />

    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* 2. Check the length of filteredVideos, not the original videos array */}
      {filteredVideos.length > 0 ? (
        filteredVideos.map((video) => (
          <VideoCard 
            key={video._id} 
            video={video} 
            isOwner={isAccountPage} 
            onDelete={() => handleDelete(video._id)}
            onEdit={() => handleOpenEdit(video)}
          />
        ))
      ) : (
        /* 3. This matches the "No videos found" screen in your screenshot */
        <div className="col-span-full flex flex-col items-center justify-center py-32 opacity-50 dark:text-white">
          <i className="fa-solid fa-video-slash text-6xl mb-4 text-gray-400"></i>
          <p className="text-xl font-medium">No videos found matching your criteria.</p>
        </div>
      )}
    </div>

    <VideoModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      initialData={selectedVideo} 
      onSuccess={fetchVideos} 
    />
  </div>
);