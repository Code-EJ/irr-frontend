/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { Link, NavLink } from "react-router-dom";
import { BarChart3, Files, HandHeart, Layers3, LayoutDashboard, LogOut,
  MapPinned, PackagePlus, Recycle, Truck, UserRound, UsersRound } from "lucide-react";

/** Groups existing destinations by task, retaining role visibility and a separate account footer. */
export default function Sidebar({ name, role, administrator, onSignOut }: {
  name: string;
  role: string;
  administrator: boolean;
  onSignOut: () => void;
}) {
  return <aside className="sidebar">
    <Link className="brand" to="/menu">
      <span className="brand-icon"><Recycle size={26} aria-hidden="true" /></span>
      <span>IRR<small>Gestão de resíduos</small></span>
    </Link>
    <nav aria-label="Navegação principal">
      <NavLink to="/menu"><LayoutDashboard size={18} aria-hidden="true" />Visão geral</NavLink>
      <section className="navigation-group" aria-labelledby="navigation-operation">
        <h2 id="navigation-operation">Operação</h2>
        <div className="navigation-items">
          <NavLink to="/routes"><MapPinned size={18} aria-hidden="true" />Rotas</NavLink>
          <NavLink to="/intake"><PackagePlus size={18} aria-hidden="true" />Entradas</NavLink>
          <NavLink to="/sortings"><Layers3 size={18} aria-hidden="true" />Triagem</NavLink>
          <NavLink to="/pressings"><Recycle size={18} aria-hidden="true" />Prensagem</NavLink>
          <NavLink to="/inventory"><PackagePlus size={18} aria-hidden="true" />Estoque</NavLink>
          <NavLink to="/documents"><Files size={18} aria-hidden="true" />Documentos</NavLink>
        </div>
      </section>
      <section className="navigation-group" aria-labelledby="navigation-registers">
        <h2 id="navigation-registers">Cadastros</h2>
        <div className="navigation-items">
          <NavLink to="/vehicle-list"><Truck size={18} aria-hidden="true" />Veículos</NavLink>
          <NavLink to="/team"><UsersRound size={18} aria-hidden="true" />Equipe</NavLink>
          <NavLink to="/materials"><Layers3 size={18} aria-hidden="true" />Materiais</NavLink>
          <NavLink to="/donors"><HandHeart size={18} aria-hidden="true" />Doadores</NavLink>
        </div>
      </section>
      <section className="navigation-group" aria-labelledby="navigation-results">
        <h2 id="navigation-results">Resultados</h2>
        <div className="navigation-items">
          <NavLink to="/reports/operations"><BarChart3 size={18} aria-hidden="true" />Relatório operacional</NavLink>
        </div>
      </section>
      {administrator && <section className="navigation-group" aria-labelledby="navigation-administration">
        <h2 id="navigation-administration">Administração</h2>
        <div className="navigation-items">
          <NavLink to="/organizations"><UsersRound size={18} aria-hidden="true" />Organizações</NavLink>
          <NavLink to="/users"><UsersRound size={18} aria-hidden="true" />Usuários</NavLink>
        </div>
      </section>}
    </nav>
    <div className="sidebar-account">
      <Link to="/profile" className="sidebar-profile" aria-label="Minha conta">
        <span className="avatar" aria-hidden="true">{name.slice(0, 1)}</span>
        <span className="sidebar-identity"><strong>{name}</strong><small>{role}</small></span>
        <UserRound size={16} aria-hidden="true" />
      </Link>
      <button className="sidebar-signout" onClick={onSignOut}><LogOut size={16} aria-hidden="true" />Sair da conta</button>
    </div>
  </aside>;
}
