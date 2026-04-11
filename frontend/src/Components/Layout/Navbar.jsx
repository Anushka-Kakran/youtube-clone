import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();

  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false); // dropdown
  const [mobileMenu, setMobileMenu] = useState(false); // ✅ mobile menu

  const dropdownRef = useRef(null);

  // 🌙 DARK MODE
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  // close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const email = localStorage.getItem("email") || "";
  const name = localStorage.getItem("channelName") || "User";
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    setMobileMenu(false);
    navigate("/login");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="flex  items-center justify-between px-3 py-2 sticky top-0 z-50 
        bg-white dark:bg-yt-darkBg 
        border-b border-yt-border dark:border-yt-darkBorder
        font-youtube">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* ✅ HAMBURGER (MOBILE) */}
          <button
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-yt-darkSecondary sm:hidden"
            onClick={() => setMobileMenu(true)}
          >
            <i className="fa-solid fa-bars text-lg"></i>
          </button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <i className="fa-brands fa-youtube text-red-600 text-2xl"></i>
            <span className="font-bold">YouTube</span>
          </Link>
        </div>

        {/* SEARCH (desktop only) */}
        <div className="hidden sm:flex flex-1 justify-center">
          <input
            className="w-[60%] px-3 py-2 border rounded-full"
            placeholder="Search"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* DARK */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-yt-darkSecondary"
          >
            {dark ? "🌞" : "🌙"}
          </button>

          {/* PROFILE */}
          {email ? (
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-full bg-red-600 text-white font-bold"
            >
              {initial}
            </button>
          ) : (
            <Link to="/login" className="text-blue-600">
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* ================= DROPDOWN ================= */}
     {/* ================= DROPDOWN ================= */}
{open && (
  <div
    ref={dropdownRef}
    /* Added z-[100] and relative positioning context to ensure it floats above everything */
    className="absolute right-2 top-14 w-52 bg-white dark:bg-[#212121] shadow-2xl rounded-lg border dark:border-white/10 z-[100]"
  >
    <div className="px-4 py-3 border-b dark:border-white/10">
      <p className="font-semibold dark:text-white">{name}</p>
      <p className="text-xs text-gray-500">{email}</p>
    </div>

    <div className="py-2">
      <Link to="/account" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white">
        <i className="fa-solid fa-user-circle mr-3"></i> My Account
      </Link>

      <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white">
        <i className="fa-solid fa-clapperboard mr-3"></i> Dashboard
      </Link>

      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-white/10 border-t dark:border-white/10 mt-1"
      >
        <i className="fa-solid fa-right-from-bracket mr-3"></i>
        Sign out
      </button>
    </div>
  </div>
)}

      {/* ================= MOBILE SIDEBAR ================= */}
      {mobileMenu && (
        <>
          {/* OVERLAY */}
          <div
            onClick={() => setMobileMenu(false)}
            className="fixed inset-0 bg-black/40 z-40"
          ></div>

          {/* SIDEBAR */}
          <div className="fixed top-0 left-0 w-64 h-full bg-white dark:bg-yt-darkSecondary z-50 p-4 transition-transform">

            {/* CLOSE */}
            <button
              onClick={() => setMobileMenu(false)}
              className="mb-4 text-xl"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* LINKS */}
            <div className="flex flex-col gap-3">

              <Link to="/dashboard" onClick={() => setMobileMenu(false)}>
                <i className="fa-solid fa-house mr-2"></i> Home
              </Link>

              <Link to="/account" onClick={() => setMobileMenu(false)}>
                <i className="fa-solid fa-user mr-2"></i> My Account
              </Link>

              <Link to="/upload" onClick={() => setMobileMenu(false)}>
                <i className="fa-solid fa-upload mr-2"></i> Upload Video
              </Link>

              <button
                onClick={handleLogout}
                className="text-left text-red-500"
              >
                <i className="fa-solid fa-right-from-bracket mr-2"></i>
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;