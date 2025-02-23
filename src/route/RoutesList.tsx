
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import ManageUsers from "../pages/ManageUsers";
import RegisterUserAdmin from "../pages/RegisterUserAdmin";
import LandingPage from "../pages/LandingPage";
//import FilterTest from "../pages/FilterTest";
import DistributionMenu from "../pages/MenuButtons/DistributionMenu";
import MaterialsMenu from "../pages/MenuButtons/MaterialsMenu";
import StockMenu from "../pages/MenuButtons/StockMenu";
import TreatmentMenu from "../pages/MenuButtons/TreatmentMenu";
import UsersMenu from "../pages/MenuButtons/UsersMenu";

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
    path: "/menu",
    element: <LandingPage />,
  },
  /*
  {
    path: "/filtertest",
    element: <FilterTest />,
  },
  */
  {
    path: "/users-menu",
    element: <UsersMenu />,
  },
  {
    path: "/distribution-menu",
    element: <DistributionMenu />,
  },
  {
    path: "/materials-menu",
    element: <MaterialsMenu />,
  },
  {
    path: "/stock-menu",
    element: <StockMenu />,
  },
  {
    path: "/treatment-menu",
    element: <TreatmentMenu />,
  },
  {
    path: "/users-register",
    element: <RegisterUserAdmin />,
  },
  {
    path: "/users-management",
    element: <ManageUsers />,
  },
]);
