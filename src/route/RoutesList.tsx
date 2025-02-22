import { Navigate, createBrowserRouter } from "react-router-dom";

import CollectionList from "../pages/CollectionsList.jsx";
import CollectionRegistration from "../pages/CollectionRegister.jsx";
import DonationRegistration from "../pages/DonationRegistration.jsx";
import EntryMenu from "../pages/EntryMenu.jsx";
import { FieldType } from "../components/generics/InputField.tsx";
import LandingPage from "../pages/LandingPage.jsx";
import Login from "../pages/Login.tsx";
import ManageUsers from "../pages/ManageUsers.jsx";
import { Page } from "../components/Page.tsx";
import PressPage from "../pages/PressPage.jsx";
import React from "react";
import RegisterUserAdmin from "../pages/RegisterUserAdmin.jsx";
import ScreeningPage from "../pages/ScreeningPage.jsx";
import TreatmentMenu from "../pages/TreatmentMenu.jsx";
import VehicleRegistration from "../pages/VehicleRegistration.jsx";
import api from "../services/api/Api.ts";

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
  // {
  //   path: "/cadastro-usuarios",
  //   element: <RegisterUserAdmin />,
  // },
  // {
  //   path: "/cadastro-veiculo",
  //   element: <VehicleRegistration />,
  // },
  // {
  //   path: "/lista-coletas",
  //   element: <CollectionList />,
  // },
  {
    path: "/menu",
    element: <LandingPage />,
  },
  // {
  //   path: "/menu-entradas-saidas",
  //   element: <EntryMenu />
  // },
  // {
  //   path: "/manejo-usuarios",
  //   element: <ManageUsers />,
  // },
  // {
  //   path: "/menu-tratamentos",
  //   element: <TreatmentMenu />,
  // },
  // {
  //   path: "/cadastro-triagens",
  //   element: <ScreeningPage />,
  // },
  // {
  //   path: "/cadastro-prensagem",
  //   element: <PressPage />,
  // },
  // {
  //   path: "/cadastro-coleta",
  //   element: <CollectionRegistration />,
  // },
  // {
  //   path: "/cadastro-doacao",
  //   element: <DonationRegistration />,
  // },
  // {
  //   path: "/cadastro-veiculo",
  //   element: <PressPage />,
  // },
  {
    path: "/motoristas",
    element: <Page name="Motoristas" restService={api.driver} fields={[
      {
        label: "Nome",
        identifier: "nome",
        type: FieldType.TEXT
      },
      {
        label: "CPF",
        identifier: "cpf",
        type: FieldType.TEXT
      },
    ]} />,
  },
  {
    path: "/veiculos",
    element: <Page name="Veículos" restService={api.vehicle} fields={[
      {
        label: "Modelo",
        identifier: "modelo",
        type: FieldType.TEXT
      },
      {
        label: "Placa",
        identifier: "placa",
        type: FieldType.TEXT
      },
    ]} />,
  },
  {
    path: "/doadores",
    element: <Page name="Doadores" restService={api.donator} fields={[
      {
        label: "Nome",
        identifier: "nome",
        type: FieldType.TEXT
      },
      {
        label: "Endereço",
        identifier: "endereco",
        type: FieldType.TEXT
      },
      {
        label: "Cadastro nacional (CPF/CNPJ)",
        identifier: "cadastroNacional",
        type: FieldType.TEXT
      },
      {
        label: "Tipo",
        identifier: "tipo",
        type: FieldType.SELECT,
        options: [
          {
            value: "Pessoa física",
            identifier: "PESSOA_FISICA"
          },
          {
            value: "Pessoa jurídica",
            identifier: "PESSOA_JURIDICA"
          }
        ]
      },
    ]} />,
  }
]);
