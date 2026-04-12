import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen font-youtube bg-yt-bg dark:bg-yt-darkBg transition-colors">
      {/* NAVBAR */}
      <Navbar
        onMenuToggle={() => setSidebarOpen(!isSidebarOpen)}
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
      />

      {/* MAIN */}
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          {/* pass search globally */}
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}
