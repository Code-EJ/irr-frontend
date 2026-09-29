/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  NavLink,
  Outlet,
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
import UserDetails from "../pages/Profile/UserDetails";
import Button from "../components/Button";
import Card from "../components/Card";
import {
  Recycle,
  LayoutDashboard,
  Truck,
  Layers3,
  UserRound,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
function Protected() {
  const state = useSession();
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
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo
      </a>
      <aside className="sidebar">
        <Link className="brand" to="/menu">
          <span className="brand-icon">
            <Recycle size={26} />
          </span>
          <span>
            IRR<small>Gestão de resíduos</small>
          </span>
        </Link>
        <p className="nav-caption">ÁREA DE TRABALHO</p>
        <nav aria-label="Navegação principal">
          <NavLink to="/menu">
            <LayoutDashboard size={19} />
            Visão geral
          </NavLink>
          <NavLink to="/vehicle-list">
            <Truck size={19} />
            Veículos
          </NavLink>
          <NavLink to="/materials">
            <Layers3 size={19} />
            Materiais
          </NavLink>
          <NavLink to="/profile">
            <UserRound size={19} />
            Minha conta
          </NavLink>
        </nav>
        <div className="sidebar-note">
          <Recycle size={25} />
          <p>
            Cada etapa conta.
            <br />
            <strong>Um novo ciclo começa aqui.</strong>
          </p>
        </div>
      </aside>
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
          <div className="account-summary">
            <span className="avatar" aria-hidden="true">
              {state.account?.fullName?.slice(0, 1)}
            </span>
            <span>
              {state.account?.fullName}
              <small>
                {state.membership
                  ? state.membership.role === "MANAGER"
                    ? "Gestor da organização"
                    : "Membro da organização"
                  : "Selecione uma organização"}
              </small>
            </span>
          </div>
          <button className="signout" onClick={() => session.clear()}>
            <LogOut size={17} />
            Sair
          </button>
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
  if (manager && state.membership?.role !== "MANAGER")
    return (
      <Card>
        <p role="alert">
          Somente gestores da organização podem alterar veículos.
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
        <Link to="/profile" className="quick-card">
          <span className="quick-icon">
            <UserRound />
          </span>
          <ArrowUpRight className="quick-arrow" />
          <h3>Minha conta</h3>
          <p>Confira seus dados de acesso à plataforma.</p>
          <strong>Ver minha conta →</strong>
        </Link>
      </div>
      <div className="coming-next">
        <span className="status-pill">Em breve</span>
        <p>
          Entradas de resíduos, processamento, estoque e vendas estarão
          disponíveis nas próximas etapas.
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
          <Route element={<Protected />}>
            <Route path="/menu" element={<Home />} />
            <Route path="/profile" element={<UserDetails />} />
            <Route element={<Scoped />}>
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
