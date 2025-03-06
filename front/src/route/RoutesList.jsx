import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import LandingPage from "../pages/LandingPage";
import DonationForm from "../pages/DonationForm";
import CollectionForm from "../pages/CollectionForm";
import UserDetails from "../pages/UserDetails";

// Aqui ficarão as rotas que podem ser acessada SEM LOGAR
export const publicRoutes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <LandingPage />,
  },
  {
    path: "/donationForm",
    element: <DonationForm />,
  },
  {
    path: "/collectionForm",
    element: <CollectionForm />,
  },
  {
    path: "/userDeatils",
    element: <UserDetails />,
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
]);

// Aqui ficarão as rotas que podem ser acessadas SOMENTE LOGADO
export const privateRoutes = createBrowserRouter([
  {
    path: "*",
    element: <Navigate to="/login" />,
  },

]);


