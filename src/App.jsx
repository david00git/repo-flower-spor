import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import LatestSightings from "./pages/LatestSightings";
import Flowers from "./pages/Flowers";
import AppLayout from "./ui/AppLayout";
import ErrorPage from "./pages/ErrorPage";
import ModalAuth from "./ui/ModalAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { action as logoutAction } from "./pages/Logout";
import { AuthProvider } from "./hooks/AuthContext";
import FlowerDetail from "./pages/FlowerDetail";
import AddNewSighting from "./pages/AddNewSighting";
import SightingDetail from "./pages/SightingDetail";
import { QueryClient, QueryClientProvider } from "react-query";
import PropTypes from "prop-types";
import { LikesProvider } from "./hooks/LikeContext";

const queryClient = new QueryClient();

function App() {
  const [totalSightings, setTotalSightings] = useState(344);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "/", element: <Home totalSightings={totalSightings} /> },
        { path: "/auth", element: <ModalAuth /> },
        { path: "/favorites", element: <Favorites /> },
        { path: "/flowers", element: <Flowers /> },
        { path: "/flowers/:id", element: <FlowerDetail /> },
        {
          path: "/sightings/flower/:id",
          element: (
            <AddNewSighting
              setTotalSightings={setTotalSightings}
              totalSightings={totalSightings}
            />
          ),
        },
        { path: "/sightings/:id", element: <SightingDetail /> },
        {
          path: "/latest-sightings",
          element: <LatestSightings totalSightings={totalSightings} />,
        },
        { path: "*", element: <ErrorPage /> },
        { path: "logout", action: logoutAction },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-center"
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 2000,
          },
          error: {
            duration: 4000,
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "red",
              color: "black",
            },
          },
        }}
      />
      <AuthProvider>
        <LikesProvider>
          <RouterProvider router={router} />
        </LikesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

AddNewSighting.propTypes = {
  setTotalSightings: PropTypes.func.isRequired,
  totalSightings: PropTypes.number.isRequired,
};

export default App;
