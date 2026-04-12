import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./Components/auth/Signup";
import Login from "./Components/auth/Login";

import Account from "./pages/Account";
import VideoPlayer from "./pages/VideoPlayer";
import Home from "./pages/Home";
import SearchResults from "./Components/SearchResults";

import Layout from "./Components/Layout/Layout";

function App() {
  const myRoutes = createBrowserRouter([
    { path: "/", element: <Signup /> },
    { path: "/signup", element: <Signup /> },
    { path: "/login", element: <Login /> },

    {
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "home", element: <Home /> },
        { path: "video/:id", element: <VideoPlayer /> },
        { path: "account", element: <Account /> },
        { path: "results", element: <SearchResults /> },
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
