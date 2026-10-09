/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  SessionProvider,
  useSession,
} from "../features/identity/SessionProvider";
import { session } from "../shared/api/session";
import Login from "../pages/Login";
import VehicleList from "../pages/VehiclePages/VehicleList";
import VehicleForm from "../features/fleet/VehicleForm";
import MaterialsPage from "../features/materials/MaterialsPage";
import DonorsPage from "../features/parties/DonorsPage";
import TeamPage from "../features/parties/TeamPage";
import DocumentsPage from "../features/documents/DocumentsPage";
import IntakeList from "../features/intake/IntakeList";
import IntakeForm from "../features/intake/IntakeForm";
import OperationalReportPage from "../features/reporting/OperationalReportPage";
import ProcessingPage from "../features/processing/ProcessingPage";
import ProcessingForm from "../features/processing/ProcessingForm";
import InventoryPage from "../features/processing/InventoryPage";
import RoutesPage from "../features/routes/RoutesPage";
import RouteForm from "../features/routes/RouteForm";
import ExecutionsPage from "../features/routes/ExecutionsPage";
import ExecutionForm from "../features/routes/ExecutionForm";
import ExecutionPage from "../features/routes/ExecutionPage";
import ProfilePage from "../features/identity/ProfilePage";
import PasswordPage from "../features/identity/PasswordPage";
import UsersPage from "../features/identity/UsersPage";
import UserPage from "../features/identity/UserPage";
import RecoveryPage, {
  ResetPasswordPage,
} from "../features/identity/RecoveryPage";
import OrganizationsPage, {
  OrganizationPage,
} from "../features/identity/OrganizationsPage";
import Button from "../components/Button";
import Card from "../components/Card";
import Sidebar from "../components/Sidebar";
import {
  Recycle,
  Truck,
  Layers3,
  ArrowUpRight,
  PackagePlus,
  MapPinned,
} from "lucide-react";
function Protected() {
  const state = useSession();
  const location = useLocation();
  if (!session.getToken()) return <Navigate to="/login" replace />;
  if (state.loading) return <p role="status">Carregando sua conta…</p>;
  if (state.error)
    return (
      <Card>
        <p role="alert">{state.error}</p>
        <Button titulo="Tentar novamente" onClick={state.reload} />
        <Button titulo="Sair" onClick={() => session.clear()} />
      </Card>
    );
  if (state.account?.mustChangePassword)
    return location.pathname === "/profile/password" ? (
      <main className="restricted-account">
        <PasswordPage mandatory />
      </main>
    ) : (
      <Navigate to="/profile/password" replace />
    );
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo
      </a>
      <Sidebar
        name={state.account?.fullName ?? "Minha conta"}
        role={state.account?.userRole === "ADMINISTRATOR"
          ? "Administrador Geral"
          : state.membership?.role === "MANAGER"
            ? "Administrador da Organização"
            : state.membership ? "Membro da organização" : "Selecione uma organização"}
        administrator={state.account?.userRole === "ADMINISTRATOR"}
        onSignOut={() => session.clear()}
      />
      <div className="workspace">
        <header className="workspace-header">
          <label className="organization-picker">
            Organização
            <select
              aria-label="Organização"
              value={state.organization?.id ?? ""}
              onChange={(event) => state.select(event.target.value)}
            >
              <option value="">Selecione uma organização</option>
              {state.organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </label>
        </header>
        <main id="main-content" className="workspace-content">
          <Outlet key={state.organization?.id ?? "no-organization"} />
        </main>
        <footer className="workspace-footer">
          IRR · Instituto de Resíduos e Reciclagem
        </footer>
      </div>
    </div>
  );
}
/** UI guard complements server-side authorization and works without organization selection. */
function AdministratorOnly() {
  return useSession().account?.userRole === "ADMINISTRATOR" ? (
    <Outlet />
  ) : (
    <Card>
      <h1>Acesso restrito</h1>
      <p role="alert">Somente administradores podem gerenciar usuários.</p>
      <Link to="/menu">Voltar ao início</Link>
    </Card>
  );
}
function Scoped({ manager = false }: { manager?: boolean }) {
  const state = useSession();
  if (!state.organization)
    return (
      <Card>
        <h1 className="text-xl font-bold">Selecione uma organização</h1>
        <p className="my-3">
          {state.organizations.length
            ? "Escolha uma organização no cabeçalho para continuar."
            : "Você não possui vínculo ativo com uma organização. Entre em contato com um administrador."}
        </p>
      </Card>
    );
  if (manager && !state.canManage)
    return (
      <Card>
        <p role="alert">
          Somente administradores da organização ou Administradores Gerais podem
          alterar veículos.
        </p>
        <Link to="/vehicle-list">Voltar para veículos</Link>
      </Card>
    );
  return <Outlet />;
}
function Home() {
  const { account, organization } = useSession();
  return (
    <div className="overview">
      <p className="eyebrow">VISÃO GERAL</p>
      <h1>Olá, {account?.fullName?.split(" ")[0] ?? "bem-vindo"}.</h1>
      <p className="page-description">
        Tudo pronto para cuidar do próximo ciclo.
      </p>
      <section className="welcome-banner">
        <div>
          <span className="status-pill">Gestão consciente</span>
          <h2>
            Organize hoje.
            <br />
            Transforme o amanhã.
          </h2>
          <p>
            {organization
              ? "Você está trabalhando em " +
                organization.name +
                ". Acesse os cadastros abaixo para continuar."
              : "Selecione sua organização no cabeçalho e mantenha os cadastros da sua operação em dia."}
          </p>
        </div>
        <Recycle className="banner-symbol" aria-hidden="true" strokeWidth={1} />
      </section>
      <div className="section-heading">
        <h2>Acesso rápido</h2>
        <span>Seu dia a dia, mais simples</span>
      </div>
      <div className="quick-grid">
        <Link to="/routes" className="quick-card">
          <span className="quick-icon">
            <MapPinned />
          </span>
          <ArrowUpRight className="quick-arrow" />
          <h3>Rotas</h3>
          <p>Planeje a cobertura e acompanhe execuções de coleta.</p>
          <strong>Acessar rotas →</strong>
        </Link>
        <Link to="/vehicle-list" className="quick-card">
          <span className="quick-icon">
            <Truck />
          </span>
          <ArrowUpRight className="quick-arrow" />
          <h3>Veículos</h3>
          <p>Consulte a frota e mantenha placas e modelos atualizados.</p>
          <strong>Acessar veículos →</strong>
        </Link>
        <Link to="/materials" className="quick-card">
          <span className="quick-icon">
            <Layers3 />
          </span>
          <ArrowUpRight className="quick-arrow" />
          <h3>Materiais</h3>
          <p>Organize categorias, tipos e subtipos de resíduos.</p>
          <strong>Acessar catálogo →</strong>
        </Link>
        <Link to="/intake/donations" className="quick-card">
          <span className="quick-icon">
            <PackagePlus />
          </span>
          <ArrowUpRight className="quick-arrow" />
          <h3>Entradas</h3>
          <p>Registre coletas e doações, com materiais e comprovantes.</p>
          <strong>Acessar entradas →</strong>
        </Link>
      </div>
      <div className="coming-next">
        <span className="status-pill">Em breve</span>
        <p>
          Vendas e comercialização estarão disponíveis nas próximas etapas.
        </p>
      </div>
    </div>
  );
}
export default function AppRouter() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<RecoveryPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route element={<Protected />}>
            <Route path="/menu" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/password" element={<PasswordPage />} />
            <Route element={<AdministratorOnly />}>
              <Route path="/organizations" element={<OrganizationsPage />} />
              <Route
                path="/organizations/new"
                element={<OrganizationPage key="new" />}
              />
              <Route path="/organizations/:id" element={<OrganizationPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/new" element={<UserPage key="new" />} />
              <Route path="/users/:id" element={<UserPage />} />
            </Route>
            <Route element={<Scoped />}>
              <Route path="/sortings" element={<ProcessingPage key="sortings" kind="sortings" />} />
              <Route path="/sortings/new" element={<ProcessingForm key="new-sorting" kind="sortings" />} />
              <Route path="/pressings" element={<ProcessingPage key="pressings" kind="pressings" />} />
              <Route path="/pressings/new" element={<ProcessingForm key="new-pressing" kind="pressings" />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/reports/operations" element={<OperationalReportPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route
                path="/routes/new"
                element={<RouteForm key="new-route" />}
              />
              <Route path="/routes/:id" element={<RouteForm />} />
              <Route path="/route-executions" element={<ExecutionsPage />} />
              <Route path="/route-executions/new" element={<ExecutionForm />} />
              <Route path="/route-executions/:id" element={<ExecutionPage />} />
              <Route path="/donors" element={<DonorsPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route
                path="/intake"
                element={<Navigate to="/intake/donations" replace />}
              />
              <Route
                path="/intake/donations"
                element={<IntakeList key="donations" kind="donations" />}
              />
              <Route
                path="/intake/collections"
                element={<IntakeList key="collections" kind="collections" />}
              />
              <Route
                path="/intake/donations/new"
                element={<IntakeForm key="new-donation" kind="donations" />}
              />
              <Route
                path="/intake/collections/new"
                element={<IntakeForm key="new-collection" kind="collections" />}
              />
              <Route
                path="/intake/donations/:id"
                element={<IntakeForm key="edit-donation" kind="donations" />}
              />
              <Route
                path="/intake/collections/:id"
                element={
                  <IntakeForm key="edit-collection" kind="collections" />
                }
              />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/vehicle-list" element={<VehicleList />} />
              <Route element={<Scoped manager />}>
                <Route path="/vehicle-create" element={<VehicleForm />} />
                <Route path="/vehicle-update/:id" element={<VehicleForm />} />
              </Route>
            </Route>
            <Route path="*" element={<Home />} />
          </Route>
          <Route path="/" element={<Navigate to="/menu" replace />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
