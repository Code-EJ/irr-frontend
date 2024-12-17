import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import LandingPage from "../pages/LandingPage";

export const publicRoutes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export const privateRoutes = createBrowserRouter([
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);
