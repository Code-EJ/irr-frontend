import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import ManageUsers from "../pages/ManageUsers";
import RegisterUserAdmin from "../pages/RegisterUserAdmin";
import VehicleRegistration from "../pages/VehicleRegistration";
import CollectionList from "../pages/CollectionsList";
import LandingPage from "../pages/LandingPage";
import TreatmentMenu from "../pages/TreatmentMenu";
import ScreeningPage from "../pages/ScreeningPage";
import EntryMenu from "../pages/EntryMenu";
import DonationRegistration from "../pages/DonationRegistration";
import CollectionRegistration from "../pages/CollectionRegister";
import PressPage from "../pages/PressPage";

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
    path: "/cadastro-usuarios",
    element: <RegisterUserAdmin />,
  },
  {
    path: "/cadastro-veiculo",
    element: <VehicleRegistration />,
  },
  {
    path: "/lista-coletas",
    element: <CollectionList />,
  },
  {
    path: "/menu",
    element: <LandingPage />,
  },
  {
    path: "/menu-entradas-saidas",
    element: <EntryMenu />
  },
  {
    path: "/manejo-usuarios",
    element: <ManageUsers />,
  },
  {
    path: "/menu-tratamentos",
    element: <TreatmentMenu />,
  },
  {
    path: "/cadastro-triagens",
    element: <ScreeningPage />,
  },
  {
    path: "/cadastro-prensagem",
    element: <PressPage />,
  },
  {
    path: "/cadastro-coleta",
    element: <CollectionRegistration />,
  },
  {
    path: "/cadastro-doacao",
    element: <DonationRegistration />,
  },
  {
    path: "/cadastro-veiculo",
    element: <PressPage />,
  },
]);
