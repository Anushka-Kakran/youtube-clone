import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// ✅ Added searchTerm and setSearchTerm as props
const Navbar = ({ onMenuToggle, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false); // profile dropdown
  const [mobileMenu, setMobileMenu] = useState(false); // mobile sidebar overlay

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
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
      <nav
        className="flex items-center justify-between px-3 py-2 sticky top-0 z-50 
        bg-white border-b border-gray-200 font-youtube"
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded hover:bg-gray-100 sm:hidden"
            onClick={() => setMobileMenu(true)}
          >
            <i className="fa-solid fa-bars text-lg text-gray-700"></i>
          </button>

          <button
            className="hidden sm:block p-2 rounded hover:bg-gray-100"
            onClick={onMenuToggle}
          >
            <i className="fa-solid fa-bars text-lg text-gray-700"></i>
          </button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <i className="fa-brands fa-youtube text-red-600 text-2xl"></i>
            <span className="font-bold text-black">YouTube</span>
          </Link>
        </div>

        {/* SEARCH (Desktop only) */}
        <div className="hidden sm:flex flex-1 justify-center">
          <input
            className="w-[60%] px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 bg-gray-50"
            placeholder="Search"
            // ✅ Uses the props passed from Dashboard
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {email ? (
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-full bg-red-600 text-white font-bold flex items-center justify-center"
            >
              {initial}
            </button>
          ) : (
            <Link
              to="/login"
              className="text-blue-600 font-medium px-3 py-1 border border-blue-600 rounded-full hover:bg-blue-50"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* ================= DROPDOWN & MOBILE MENU (Remaining logic stays same) ================= */}
      {/* ... keeping your existing dropdown and mobile menu code ... */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-4 top-14 w-52 bg-white shadow-2xl rounded-lg border border-gray-200 z-[100]"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-800">{name}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>
          <div className="py-2">
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <i className="fa-solid fa-user-circle mr-3"></i> My Account
            </Link>
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <i className="fa-solid fa-clapperboard mr-3"></i> Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 border-t border-gray-100 mt-1"
            >
              <i className="fa-solid fa-right-from-bracket mr-3"></i> Sign out
            </button>
          </div>
        </div>
      )}

      {mobileMenu && (
        <>
          <div
            onClick={() => setMobileMenu(false)}
            className="fixed inset-0 bg-black/40 z-[110]"
          ></div>
          <div className="fixed top-0 left-0 w-64 h-full bg-white z-[120] p-4 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setMobileMenu(false)}
                className="text-xl p-1 rounded hover:bg-gray-100"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="flex items-center gap-2">
                <i className="fa-brands fa-youtube text-red-600 text-2xl"></i>
                <span className="font-bold">YouTube</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenu(false)}
                className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-700"
              >
                <i className="fa-solid fa-house w-8"></i> Home
              </Link>
              <Link
                to="/account"
                onClick={() => setMobileMenu(false)}
                className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-700"
              >
                <i className="fa-solid fa-user w-8"></i> My Account
              </Link>
              <Link
                to="/upload"
                onClick={() => setMobileMenu(false)}
                className="flex items-center p-2 rounded hover:bg-gray-100 text-gray-700"
              >
                <i className="fa-solid fa-upload w-8"></i> Upload
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center p-2 rounded hover:bg-red-50 text-red-500 text-left"
              >
                <i className="fa-solid fa-right-from-bracket w-8"></i> Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
