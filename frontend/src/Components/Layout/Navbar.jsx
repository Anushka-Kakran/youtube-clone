import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();

  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false); // ✅ dropdown state

  const dropdownRef = useRef(null);

  // =========================
  // 🌙 DARK MODE
  // =========================
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  // =========================
  // 👇 CLOSE DROPDOWN ON OUTSIDE CLICK
  // =========================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========================
  // 👤 USER DATA
  // =========================
  const email = localStorage.getItem("email") || "";
  const name = localStorage.getItem("channelName") || "User";
  const initial = name.charAt(0).toUpperCase();

  // =========================
  // 🚪 LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-3 py-2 sticky top-0 z-50 
      bg-white dark:bg-yt-darkBg 
      text-yt-text dark:text-yt-darkText 
      border-b border-yt-border dark:border-yt-darkBorder 
      font-youtube">

      {/* 🔹 LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-yt-darkSecondary"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        <Link to="/dashboard" className="flex items-center gap-2">
          <i className="fa-brands fa-youtube text-yt-red text-2xl"></i>
          <span className="font-bold">YouTube</span>
        </Link>
      </div>

      {/* 🔍 SEARCH */}
      <div className="hidden sm:flex flex-1 justify-center">
        <input
          className="w-[60%] px-3 py-2 border rounded-full"
          placeholder="Search"
        />
      </div>

      {/* 🔹 RIGHT */}
      <div className="flex items-center gap-3">

        {/* 🌙 DARK */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-yt-darkSecondary"
        >
          {dark ? "🌞" : "🌙"}
        </button>

        {/* 👤 USER */}
        {email ? (
          <div className="relative" ref={dropdownRef}>

            {/* PROFILE BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-full bg-yt-red text-white font-bold"
            >
              {initial}
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-yt-darkSecondary shadow-lg rounded-lg border border-gray-200 dark:bg-gray-100 overflow-hidden">

                {/* USER INFO */}
                <div className="px-4 py-2 border-b ">
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs ">{email}</p>
                </div>

                {/* MY ACCOUNT */}
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 "
                >
                  <i className="fa-solid fa-user mr-2"></i>
                  My Account
                </Link>

                {/* DASHBOARD */}
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 "
                >
                  <i className="fa-solid fa-video mr-2"></i>
                  Dashboard
                </Link>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 bg-yt-red hover:bg-gray-100 "
                >
                  <i className="fa-solid fa-right-from-bracket mr-2"></i>
                  Sign out
                </button>

              </div>
            )}

          </div>
        ) : (
          // ❌ NOT LOGGED IN
          <Link
            to="/login"
            className="px-3 py-1 border rounded-full text-blue-600"
          >
            <i className="fa-regular fa-user mr-1"></i>
            Sign in
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Navbar;