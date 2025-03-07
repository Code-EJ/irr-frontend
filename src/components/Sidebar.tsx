import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>
        X
      </button>
      <ul className="sidebar-menu">
        <li>
          <button onClick={() => handleNavigation('/users-register')}>Cadastro de Usuários</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/users-management')}>Manejo de Usuários</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/typology-list')}>Tipologia</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/subtypology-list')}>Subtipologia</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/triage-list')}>Triagem</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/pressing-list')}>Prensagem</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/collection-list')}>Coleta</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/donation-list')}>Doação</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/donator-list')}>Doador</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/vehicle-list')}>Veículo</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/driver-list')}>Motorista</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/input-material-list')}>Material de Entrada</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/output-material-list')}>Material de Saída</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/sale-list')}>Mercado</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('/profile')}>Perfil</button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
