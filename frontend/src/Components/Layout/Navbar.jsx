import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const email = localStorage.getItem("email") || "";
  const initial = email.charAt(0).toUpperCase();

  return (
    <nav className="flex items-center justify-between px-3 sm:px-4 py-2 sticky top-0 z-50 
      bg-white dark:bg-yt-darkBg 
      text-yt-text dark:text-yt-darkText 
      border-b border-yt-border dark:border-yt-darkBorder 
      font-youtube transition-colors duration-300">

      {/* 🔹 LEFT */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-full hover:bg-yt-secondary dark:hover:bg-yt-darkSecondary transition"
        >
          <i className="fa-solid fa-bars text-lg"></i>
        </button>

        <Link to="/" className="flex items-center gap-1">
          <i className="fa-brands fa-youtube text-red-600 text-3xl"></i>
          <span className="text-lg sm:text-xl font-bold tracking-tight hidden xs:block">
            YouTube
          </span>
        </Link>
      </div>

      {/* 🔍 SEARCH */}
      <div className="hidden sm:flex flex-1 justify-center mx-4">
        <div className="flex w-full max-w-[600px] overflow-hidden 
          border border-yt-border dark:border-yt-darkBorder 
          rounded-full focus-within:ring-1 focus-within:ring-blue-500">

          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 text-sm 
              bg-white dark:bg-yt-darkBg 
              text-yt-text dark:text-white 
              outline-none"
          />

          <button
            className="px-5 flex items-center justify-center 
              bg-yt-secondary dark:bg-yt-darkSecondary 
              border-l border-yt-border dark:border-yt-darkBorder 
              hover:bg-gray-200 dark:hover:bg-yt-border transition"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      {/* 🔹 RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* 🌙 DARK MODE */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full hover:bg-yt-secondary dark:hover:bg-black transition"
        >
          {dark ? "🌞" : "🌙"}
        </button>

        {/* 👤 USER */}
        {email ? (
          <Link
            to="/account"
            className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center 
              text-white font-bold hover:ring-2 hover:ring-blue-400 transition"
          >
            {initial}
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 border border-yt-border 
              dark:border-yt-darkBorder px-3 py-1.5 rounded-full 
              text-blue-600 dark:text-blue-400 font-medium 
              hover:bg-blue-50 dark:hover:bg-yt-darkSecondary transition"
          >
            <i className="fa-regular fa-user"></i>
            <span className="hidden sm:block">Sign in</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;