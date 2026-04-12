// import MyVideos from "../Components/Video/MyVideos";
import HomeVideos from "./HomeVedios";

const Home = () => {
  return (
    <div className="bg-yt-bg dark:bg-yt-darkBg min-h-screen">
      {/* Category Filter - Scrollable on mobile */}
      {/* <MyVideos/> */}
      <HomeVideos />
    </div>
  );
};

export default Home;
