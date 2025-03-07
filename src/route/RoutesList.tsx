import { Navigate, createBrowserRouter } from "react-router-dom";
import { FieldType } from "../components/generics/InputField";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import ManageUsers from "../pages/ManageUsers";
import { Page } from "../components/Page";
import RegisterUserAdmin from "../pages/RegisterUserAdmin";
import TreatmentMenu from "../pages/MenuButtons/TreatmentMenu";
import {
  DriverService, VehicleService, DonatorService, TypologyService, CollectionService, DonationService, InputMaterialService,
  OutputMaterialService, SaleService, PressingService, SubTypologyService, TriageService
} from "../services";
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
  {
    path: "/typology-list",
    element: <Page name="Tipologias" restService={TypologyService} fields={[
      {
        label: "Nome",
        identifier: "nome",
        type: FieldType.TEXT
      },
      {
        label: "Valor",
        identifier: "valor",
        type: FieldType.NUMBER
      },
      {
        label: "Ativo",
        identifier: "ativo",
        type: FieldType.BOOLEAN,
      },
    ]} />,
  },
  {
    path: "/subtypology-list",
    element: <Page name="Subtipologias" restService={SubTypologyService} fields={[
      {
        label: "Nome",
        identifier: "nome",
        type: FieldType.TEXT
      },
      {
        label: "Valor",
        identifier: "valor",
        type: FieldType.NUMBER
      },
      {
        label: "Ativo",
        identifier: "ativo",
        type: FieldType.BOOLEAN,
      },
      {
        label: "Tipologia",
        identifier: "tipologiaId",
        type: FieldType.REFERENCE,
        referenceConfig: {
          restService: TypologyService,
          identity: "nome"
        }
      },
    ]} />,
  },
  {
    path: "/collection-list",
    element: <Page name="Coletas" restService={CollectionService} fields={[
      {
        label: "Data de realização",
        identifier: "dataRealizacao",
        type: FieldType.DATE,
      },
      {
        label: "Data de chegada",
        identifier: "dataChegada",
        type: FieldType.DATE,
      },
      {
        label: "Data de saída",
        identifier: "dataSaida",
        type: FieldType.DATE,
      },
      {
        label: "Pesagem",
        identifier: "pesagem",
        type: FieldType.NUMBER,
      },
      {
        label: "Quilometragem",
        identifier: "quilometragem",
        type: FieldType.NUMBER,
      },
      {
        label: "Ativo",
        identifier: "ativo",
        type: FieldType.BOOLEAN,
      },
      {
        label: "Veículo",
        identifier: "veiculoId",
        type: FieldType.REFERENCE,
        referenceConfig: {
          restService: VehicleService,
          identity: "placa"
        }
      },
      {
        label: "Motorista",
        identifier: "motoristaId",
        type: FieldType.REFERENCE,
        referenceConfig: {
          restService: DriverService,
          identity: "nome"
        }
      },
      {
        label: "Gerador",
        identifier: "mtrGeradorId",
        type: FieldType.FILE,
      },
      {
        label: "Destinador",
        identifier: "mtrDestinadorId",
        type: FieldType.FILE,

      },
      {
        label: "Transportador",
        identifier: "mtrTransportadorId",
        type: FieldType.FILE,

      },
      {
        label: "Diário de coleta",
        identifier: "diarioColetaId",
        type: FieldType.FILE,
      },
    ]} />,
  },
  {
    path: "/donation-list",
    element: <Page name="Doações" restService={DonationService} fields={[
      {
        label: "Pesagem",
        identifier: "pesagem",
        type: FieldType.NUMBER,
      },
      {
        label: "Tipologia",
        identifier: "tipologiaId",
        type: FieldType.REFERENCE,
        referenceConfig: {
          restService: TypologyService,
          identity: "nome"
        }
      },
      {
        label: "Subtipologia",
        identifier: "subtipologiaId",
        type: FieldType.REFERENCE,
        referenceConfig: {
          restService: SubTypologyService,
          identity: "nome"
        }
      },
      {
        label: "Doador",
        identifier: "doadorId",
        type: FieldType.REFERENCE,
        referenceConfig: {
          restService: DonatorService,
          identity: "cadastralNacional"
        }
      }
    ]} />,
  },
  {
    path: "/input-material-list",
    element: <Page name="Materiais de entrada" restService={InputMaterialService} fields={[
      {
        label: "Quantidade",
        identifier: "quantidade",
        type: FieldType.NUMBER,
      },
      {
        label: "Tipo",
        identifier: "tipo",
        type: FieldType.SELECT,
        options: [
          {
            value: "Doação",
            identifier: "DOACAO"
          },
          {
            value: "Coleta",
            identifier: "COLETA"
          }
        ]
      },
      {
        label: "Subtipologia",
        identifier: "subtipologiaId",
        type: FieldType.REFERENCE,
        referenceConfig: {
          restService: SubTypologyService,
          identity: "nome"
        }
      }
    ]} />,
  },
  {
    path: "/output-material-list",
    element: <Page name="Materiais de saída" restService={OutputMaterialService} fields={[
      {
        label: "Quantidade",
        identifier: "quantidade",
        type: FieldType.NUMBER,
      },
      {
        label: "Nota Fiscal",
        identifier: "notaFiscalId",
        type: FieldType.FILE,
      },
      {
        label: "Subtipologia",
        identifier: "subtipologiaId",
        type: FieldType.REFERENCE,
        referenceConfig: {
          restService: SubTypologyService,
          identity: "nome"
        }
      }
    ]} />,
  },
  {
    path: "/sale-list",
    element: <Page name="Vendas" restService={SaleService} fields={[
      {
        label: "Comprador",
        identifier: "comprador",
        type: FieldType.TEXT,
      },
      {
        label: "Data",
        identifier: "data",
        type: FieldType.DATE,
      },
      {
        label: "Valor",
        identifier: "valor",
        type: FieldType.NUMBER,
      },
      {
        label: "Nota Fiscal",
        identifier: "notaFiscalId",
        type: FieldType.FILE,
      },
      {
        label: "Gerador",
        identifier: "mtrGeradorId",
        type: FieldType.FILE,
      },
      {
        label: "Transportador",
        identifier: "mtrTransportadorId",
        type: FieldType.FILE,
      },
      {
        label: "Destinador",
        identifier: "mtrDestinadorId",
        type: FieldType.FILE,
      }
    ]} />,
  },
  {
    path: "/pressing-list",
    element: <Page name="Prensagens" restService={PressingService} fields={[
      {
        label: "Data",
        identifier: "data",
        type: FieldType.DATE,
      },
      {
        label: "Volume total",
        identifier: "volumeTotal",
        type: FieldType.NUMBER,
      },
      {
        label: "Tipo de origem",
        identifier: "tipoOrigem",
        type: FieldType.SELECT,
        options: [
          {
            value: "Doação",
            identifier: "DOACAO"
          },
          {
            value: "Coleta",
            identifier: "COLETA"
          }
        ]
      },
      {
        label: "Tipo de destino",
        identifier: "tipoDestino",
        type: FieldType.SELECT,
        options: [
          {
            value: "Doação",
            identifier: "DOACAO"
          },
          {
            value: "Coleta",
            identifier: "COLETA"
          }
        ]
      },
      {
        label: "Subtipologia",
        identifier: "subtipologiaId",
        type: FieldType.REFERENCE,
        referenceConfig: {
          restService: SubTypologyService,
          identity: "nome"
        }
      }
    ]} />,
  },
  {
    path: "/triage-list",
    element: <Page name="Triagens" restService={TriageService} fields={[
      {
        label: "Data",
        identifier: "data",
        type: FieldType.DATE,
      },
      {
        label: "Tipo",
        identifier: "tipo",
        type: FieldType.SELECT,
        options: [
          {
            value: "Total",
            identifier: "TOTAL"
          },
          {
            value: "Parcial",
            identifier: "PARCIAL"
          }
        ]
      },
      {
        label: "Volume total",
        identifier: "volumeTotal",
        type: FieldType.NUMBER,
      },
      {
        label: "Volume de rejeito",
        identifier: "volumeRejeito",
        type: FieldType.NUMBER,
      },
      {
        label: "Tipo de origem",
        identifier: "tipoOrigem",
        type: FieldType.SELECT,
        options: [
          {
            value: "Doação",
            identifier: "DOACAO"
          },
          {
            value: "Coleta",
            identifier: "COLETA"
          }
        ]
      },
      {
        label: "Tipo de destino",
        identifier: "tipoDestino",
        type: FieldType.SELECT,
        options: [
          {
            value: "Doação",
            identifier: "DOACAO"
          },
          {
            value: "Coleta",
            identifier: "COLETA"
          }
        ]
      },
      {
        label: "Subtipologia",
        identifier: "subtipologiaId",
        type: FieldType.REFERENCE,
        referenceConfig: {
          restService: SubTypologyService,
          identity: "nome"
        }
      }
    ]} />,
  },
];


export const publicRoutes = createBrowserRouter(commonRoutes);
export const privateRoutes = createBrowserRouter([...commonRoutes, ...privateRoutesList]);
