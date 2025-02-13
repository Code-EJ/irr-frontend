import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login.tsx";
import ManageUsers from "../pages/ManageUsers.jsx";
import RegisterUserAdmin from "../pages/RegisterUserAdmin.jsx";
import VehicleRegistration from "../pages/VehicleRegistration.jsx";
import CollectionList from "../pages/CollectionsList.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import TreatmentMenu from "../pages/TreatmentMenu.jsx";
import ScreeningPage from "../pages/ScreeningPage.jsx";
import EntryMenu from "../pages/EntryMenu.jsx";
import DonationRegistration from "../pages/DonationRegistration.jsx";
import CollectionRegistration from "../pages/CollectionRegister.jsx";
import PressPage from "../pages/PressPage.jsx";
import React from "react";
import { DriverPage } from "../pages/DriverPoC.tsx";

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
  {
    path: "/motoristas",
    element: <DriverPage />,
  },
]);
