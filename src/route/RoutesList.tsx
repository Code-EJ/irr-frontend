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
import UserDetails from "../pages/Profile/UserDetails";
import { UserEdit } from "../pages/Profile/UserEdit";
import DocumentMenu from "../pages/MenuButtons/DocumentMenu";
import CollectionList from "../pages/CollectionPages/CollectionList";
import DocumentList from "../pages/DocumentPages/DocumentList";
import DonationList from "../pages/DonationPages/DonationList";
import DriverList from "../pages/DriverPages/DriverList";
import InputMaterialList from "../pages/InputMaterialPages/InputMaterialList";
import MediaList from "../pages/MediaPages/MediaList";
import OutputMaterialList from "../pages/OutputMaterialPages/OutputMaterialList";
import PressingList from "../pages/PressingPages/PressingList";
import SalesList from "../pages/SalesPages/SalesList";
import SubTypologyList from "../pages/SubTypologyPages/SubTypologyList";
import TriageList from "../pages/TriagePages/TriageList";
import DonatorList from "../pages/DonatorPages/DonatorList";
import VehicleList from "../pages/VehiclePages/VehicleList";
import TypologyList from "../pages/TypologyPages/TypologyList";
import CollectionCreate from "../pages/CollectionPages/CollectionCreate";
import DocumentCreate from "../pages/DocumentPages/DocumentCreate";
import DonationCreate from "../pages/PagesAntigas/DonationCreate";
import DriverCreate from "../pages/DriverPages/DriverCreate";
import InputMaterialCreate from "../pages/InputMaterialPages/InputMaterialCreate";
import MediaCreate from "../pages/MediaPages/MediaCreate";
import OutputMaterialCreate from "../pages/OutputMaterialPages/OutputMaterialCreate";
import PressingCreate from "../pages/PressingPages/PressingCreate";
import SalesCreate from "../pages/SalesPages/SalesCreate";
import SubTypologyCreate from "../pages/SubTypologyPages/SubTypologyCreate";
import TypologyCreate from "../pages/TypologyPages/TypologyCreate";
import TriageCreate from "../pages/TriagePages/TriageCreate";
import VehicleCreate from "../pages/PagesAntigas/VehicleCreate";
import DonatorCreate from "../pages/DonatorPages/DonatorCreate";
import CollectionUpdate from "../pages/CollectionPages/CollectionUpdate";
import DocumentUpdate from "../pages/DocumentPages/DocumentUpdate";
import DonationUpdate from "../pages/DonationPages/DonationUpdate";
import DriverUpdate from "../pages/DriverPages/DriverUpdate";
import InputMaterialUpdate from "../pages/InputMaterialPages/InputMaterialUpdate";
import MediaUpdate from "../pages/MediaPages/MediaUpdate";
import OutputMaterialUpdate from "../pages/OutputMaterialPages/OutputMaterialUpdate";
import PressingUpdate from "../pages/PressingPages/PressingUpdate";
import SalesUpdate from "../pages/SalesPages/SalesUpdate";
import SubTypologyUpdate from "../pages/SubTypologyPages/SubTypologyUpdate";
import TypologyUpdate from "../pages/TypologyPages/TypologyUpdate";
import TriageUpdate from "../pages/TriageDrivers/TriageDriversUpdate";
import VehicleUpdate from "../pages/VehiclePages/VehicleUpdate";
import DonatorUpdate from "../pages/DonatorPages/DonatorUpdate";

// Rotas comuns (ex: login)
const commonRoutes = [
  { path: "/login", element: <Login /> },
  { path: "*", element: <Navigate to="/login" /> },
];

// Rotas privadas (ex: acessíveis após autenticação)
const privateRoutesList = [
  { path: "/menu", element: <LandingPage /> },
  // Rotas de menu
  { path: "/users-menu", element: <UsersMenu /> },
  { path: "/distribution-menu", element: <DistributionMenu /> },
  { path: "/materials-menu", element: <MaterialsMenu /> },
  { path: "/stock-menu", element: <StockMenu /> },
  { path: "/treatment-menu", element: <TreatmentMenu /> },
  { path: "/document-menu", element: <DocumentMenu /> },
  // Rotas de listagem
  { path: "/collection-list", element: <CollectionList/> },
  { path: "/document-list", element: <DocumentList/> },
  { path: "/donation-list", element: <DonationList/> },
  { path: "/driver-list", element: <DriverList/> },
  { path: "/input-material-list", element: <InputMaterialList/> },
  { path: "/media-list", element: <MediaList/> },
  { path: "/output-material-list", element: <OutputMaterialList/> },
  { path: "/pressing-list", element: <PressingList/> },
  { path: "/sales-list", element: <SalesList/> },
  { path: "/subtypology-list", element: <SubTypologyList/> },
  { path: "/typology-list", element: <TypologyList/> },
  { path: "/triage-list", element: <TriageList/> },
  { path: "/vehicle-list", element: <VehicleList/> },
  { path: "/donator-list", element: <DonatorList/> },
  // Rotas de criação
  { path: "/collection-create", element: <CollectionCreate/> },
  { path: "/document-create", element: <DocumentCreate/> },
  { path: "/donation-create", element: <DonationCreate/> },
  { path: "/driver-create", element: <DriverCreate/> },
  { path: "/input-material-create", element: <InputMaterialCreate/> },
  { path: "/media-create", element: <MediaCreate/> },
  { path: "/output-material-create", element: <OutputMaterialCreate/> },
  { path: "/pressing-create", element: <PressingCreate/> },
  { path: "/sales-create", element: <SalesCreate/> },
  { path: "/subtypology-create", element: <SubTypologyCreate/> },
  { path: "/typology-create", element: <TypologyCreate/> },
  { path: "/triage-create", element: <TriageCreate/> },
  { path: "/vehicle-create", element: <VehicleCreate/> },
  { path: "/donator-create", element: <DonatorCreate/> },
  // Rotas de atualização
  { path: "/collection-update", element: <CollectionUpdate/> },
  { path: "/document-update", element: <DocumentUpdate/> },
  { path: "/donation-update", element: <DonationUpdate/> },
  { path: "/driver-update", element: <DriverUpdate/> },
  { path: "/input-material-update", element: <InputMaterialUpdate/> },
  { path: "/media-update", element: <MediaUpdate/> },
  { path: "/output-material-update", element: <OutputMaterialUpdate/> },
  { path: "/pressing-update", element: <PressingUpdate/> },
  { path: "/sales-update", element: <SalesUpdate/> },
  { path: "/subtypology-update", element: <SubTypologyUpdate/> },
  { path: "/typology-update", element: <TypologyUpdate/> },
  { path: "/triage-update", element: <TriageUpdate/> },
  { path: "/vehicle-update", element: <VehicleUpdate/> },
  { path: "/donator-update", element: <DonatorUpdate/> },
  // Rotas de Manipulação de Usuários
  { path: "/users-register", element: <RegisterUserAdmin /> },
  { path: "/users-management", element: <ManageUsers /> },
  // Rotas de Perfil
  { path: "/profile", element: <UserDetails /> },
  { path: "/edit/:id", element: <UserEdit /> }
];


export const publicRoutes = createBrowserRouter(commonRoutes);
export const privateRoutes = createBrowserRouter([...commonRoutes, ...privateRoutesList]);
