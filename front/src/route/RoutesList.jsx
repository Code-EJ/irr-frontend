import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import ManageUsers from "../pages/ManageUsers";
import RegisterUserAdmin from "../pages/RegisterUserAdmin";
import VehicleRegistration from "../pages/VehicleRegistration";
import CollectionList from "../pages/CollectionsList";
import LandingPage from "../pages/LandingPage";
import TreatmentMenu from "../pages/TreatmentMenu";

// Aqui ficarão as rotas que podem ser acessada SEM LOGAR
export const publicRoutes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
]);

// Aqui ficarão as rotas que podem ser acessadas SOMENTE LOGADO
export const privateRoutes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
  {
    path: "/register-admin",
    element: <RegisterUserAdmin />,
  },
  {
    path: "/vehicle-registration",
    element: <VehicleRegistration />,
  },
  {
    path: "/collections-list",
    element: <CollectionList />,
  },
  {
    path: "/home",
    element: <LandingPage />,
  },
  {
    path: "/manage-users",
    element: <ManageUsers />,
  },
  {
    path: "/menu-tratamentos",
    element: <TreatmentMenu />,
  },
]);
