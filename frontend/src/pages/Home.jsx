import MyVideos from "../Components/Video/MyVideos";

const Home = () => {
  const categories = ["All", "Live", "Gaming", "Music", "Coding", "News", "Sports"]; // At least 6 [cite: 482]

  return (
    <div className="bg-yt-bg dark:bg-yt-darkBg min-h-screen">
      {/* Category Filter - Scrollable on mobile */}
     <MyVideos/>
    </div>
  );
};

export default Home;