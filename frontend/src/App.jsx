import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";

function App() {
  const myRoutes = createBrowserRouter([
    {
      path: "/",
      element: <Signup />,   // 👈 Home route
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <>
      <RouterProvider router={myRoutes} />
    </>
  );
}

export default App;