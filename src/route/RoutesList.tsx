import { Navigate, createBrowserRouter } from "react-router-dom";
import { FieldType } from "../components/generics/InputField.tsx";
import LandingPage from "../pages/LandingPage.jsx";
import Login from "../pages/Login.tsx";
import ManageUsers from "../pages/ManageUsers.jsx";
import { Page } from "../components/Page.tsx";
import React from "react";
import RegisterUserAdmin from "../pages/RegisterUserAdmin.jsx";
import TreatmentMenu from "../pages/MenuButtons/TreatmentMenu.jsx";
import api from "../services/api/Api.ts";
import UsersMenu from "../pages/MenuButtons/UsersMenu.jsx";
import DistributionMenu from "../pages/MenuButtons/DistributionMenu.jsx";
import MaterialsMenu from "../pages/MenuButtons/MaterialsMenu.jsx";
import StockMenu from "../pages/MenuButtons/StockMenu.jsx";


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
