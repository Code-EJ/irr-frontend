import { Navigate, createBrowserRouter } from "react-router-dom";
import { FieldType } from "../components/generics/InputField";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import ManageUsers from "../pages/ManageUsers";
import { Page } from "../components/Page";
import RegisterUserAdmin from "../pages/RegisterUserAdmin";
import TreatmentMenu from "../pages/MenuButtons/TreatmentMenu";
import { DriverService, VehicleService, DonatorService } from "../services";
import UsersMenu from "../pages/MenuButtons/UsersMenu";
import DistributionMenu from "../pages/MenuButtons/DistributionMenu";
import MaterialsMenu from "../pages/MenuButtons/MaterialsMenu";
import StockMenu from "../pages/MenuButtons/StockMenu";
import FilterTest from "../pages/FilterTest";
import UserDetails from "../pages/UserDetails";
import { UserEdit } from "../pages/UserEdit";

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
  {
    path: "/driver-list",
    element: (
      <Page
        name="Motoristas"
        restService={DriverService}
        fields={[
          { label: "Nome", identifier: "nome", type: FieldType.TEXT },
          { label: "CPF", identifier: "cpf", type: FieldType.TEXT },
        ]}
      />
    ),
  },
  {
    path: "/vehicle-list",
    element: (
      <Page
        name="Veículos"
        restService={VehicleService}
        fields={[
          { label: "Modelo", identifier: "modelo", type: FieldType.TEXT },
          { label: "Placa", identifier: "placa", type: FieldType.TEXT },
        ]}
      />
    ),
  },
  {
    path: "/donator-list",
    element: (
      <Page
        name="Doadores"
        restService={DonatorService}
        fields={[
          { label: "Nome", identifier: "nome", type: FieldType.TEXT },
          { label: "Endereço", identifier: "endereco", type: FieldType.TEXT },
          {
            label: "Cadastro nacional (CPF/CNPJ)",
            identifier: "cadastroNacional",
            type: FieldType.TEXT,
          },
          {
            label: "Tipo",
            identifier: "tipo",
            type: FieldType.SELECT,
            options: [
              { value: "Pessoa física", identifier: "PESSOA_FISICA" },
              { value: "Pessoa jurídica", identifier: "PESSOA_JURIDICA" },
            ],
          },
        ]}
      />
    ),
  },
];

export const publicRoutes = createBrowserRouter(commonRoutes);
export const privateRoutes = createBrowserRouter([...commonRoutes, ...privateRoutesList]);
