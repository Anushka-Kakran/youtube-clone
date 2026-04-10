const FilterBar = () => {
  const filters = ["All", "Music", "Gaming", "Live", "Coding", "News", "Sports", "Podcasts"];
  
  return (
    <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar bg-yt-bg sticky top-[56px] z-40">
      {filters.map((filter) => (
        <button key={filter} className="whitespace-nowrap bg-yt-secondary border border-yt-border px-3 py-1 rounded-lg text-sm font-medium hover:bg-yt-grayHover active:bg-yt-text active:text-white transition-colors">
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;