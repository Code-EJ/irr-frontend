import { Navigate, createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import ManageUsers from "../pages/UsersPages/ManageUsers";
import RegisterUserAdmin from "../pages/UsersPages/RegisterUserAdmin";
import TreatmentMenu from "../pages/MenuButtons/TreatmentMenu";
import UsersMenu from "../pages/MenuButtons/UsersMenu";
import DistributionMenu from "../pages/MenuButtons/DistributionMenu";
import MaterialsMenu from "../pages/MenuButtons/MaterialsMenu";
import StockMenu from "../pages/MenuButtons/StockMenu";
import FilterTest from "../pages/FilterTest";
import UserDetails from "../pages/Profile/UserDetails";
import { UserEdit } from "../pages/Profile/UserEdit";

// Rotas comuns (ex: login)
const commonRoutes = [
  { path: "/login", element: <Login /> },
  { path: "*", element: <Navigate to="/login" /> },
];

// Rotas privadas (ex: acessíveis após autenticação)
const privateRoutesList = [
  { path: "/menu", element: <LandingPage /> },
  { path: "/filtertest", element: <FilterTest /> },
  { path: "/users-menu", element: <UsersMenu /> },
  { path: "/distribution-menu", element: <DistributionMenu /> },
  { path: "/materials-menu", element: <MaterialsMenu /> },
  { path: "/stock-menu", element: <StockMenu /> },
  { path: "/treatment-menu", element: <TreatmentMenu /> },
  { path: "/users-register", element: <RegisterUserAdmin /> },
  { path: "/users-management", element: <ManageUsers /> },
  { path: "/profile", element: <UserDetails /> },
  { path: "/edit/:id", element: <UserEdit /> },
];


export const publicRoutes = createBrowserRouter(commonRoutes);
export const privateRoutes = createBrowserRouter([...commonRoutes, ...privateRoutesList]);
