import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Component Imports
import Navbar from "./Components/Layout/Navbar";
import Sidebar from "./Components/Layout/Sidebar";
import Signup from "./Components/auth/Signup";
import Login from "./Components/auth/Login";

// Page Imports
import Account from "./pages/Account";
import Home from "./pages/Home";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";

/**
 * Layout Component:
 * This wraps our main content to ensure Navbar and Sidebar
 * are consistent across the dashboard, video, and channel pages.
 */
const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen font-youtube bg-yt-bg dark:bg-yt-darkBg transition-colors">
      {/* Top Navigation */}
      <Navbar onMenuToggle={() => setSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Persistent Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet /> {/* This renders the specific page (Home, Video, etc.) */}
        </main>
      </div>
    </div>
  );
};

function App() {
  const myRoutes = createBrowserRouter([
    // Auth Routes (No Navbar/Sidebar here)
    {
      path: "/",
      element: <Signup />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },

    // Main App Routes (Wrapped in Layout)
    {
      element: <Layout />,
      children: [
        {
          path: "/dashboard",
          element: <Home />,
        },
        {
          path: "/video/:id", // Dynamic route for specific videos
          element: <VideoPlayer />,
        },
        {
          path: "/channel/:userId", // CRUD management page
          element: <Channel />,
        },
        {
          path: "/account",
          element: <Account />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={myRoutes} />
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default App;
