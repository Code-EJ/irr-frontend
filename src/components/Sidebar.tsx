import { MenuIcon } from 'lucide-react';
import React from 'react';  

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {

  const menuItems = [
    { label: 'Menu', link: '/menu' },
    { label: 'Cadastro de Usuários', link: '/users-register' },
    { label: 'Manejo de Usuários', link: '/users-management' },
    { label: 'Tipologia', link: '/typology-list' },
    { label: 'Subtipologia', link: '/subtypology-list' },
    { label: 'Triagem', link: '/triage-list' },
    { label: 'Prensagem', link: '/pressing-list' },
    { label: 'Coleta', link: '/collection-list' },
    { label: 'Doação', link: '/donation-list' },
    { label: 'Doador', link: '/donator-list' },
    { label: 'Veículo', link: '/vehicle-list' },
    { label: 'Motorista', link: '/driver-list' },
    { label: 'Material de Entrada', link: '/input-material-list' },
    { label: 'Material de Saída', link: '/output-material-list' },
    { label: 'Documento', link: '/document-list' },
    { label: 'Mercado', link: '/sales-list' },
    { label: 'Perfil', link: '/profile' },
  ];

  const handleMenuItemClick = (link: string) => {
    // Altere o comportamento para não fechar a sidebar ao clicar em um item do menu
    window.location.href = link;
  };

  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-white shadow-md p-4 ${isOpen ? 'block' : 'hidden'}`}
      aria-hidden={!isOpen}
    >
      <button
        className="absolute top-4 right-4 text-3xl text-gray-700" // Alterei para text-3xl para aumentar o tamanho
        onClick={onClose}
        aria-label="Fechar sidebar"
      >
        <MenuIcon onClick={onClose} />
      </button>
      <ul className="p-0 m-0 mt-12 space-y-2">
        {menuItems.map((item, index) => (
          <li key={index} className="border-b border-gray-300">
            <button
              onClick={() => handleMenuItemClick(item.link)}
              aria-label={`Ir para ${item.label}`}
              className="w-full text-left p-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
