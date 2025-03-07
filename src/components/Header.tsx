import { useState } from 'react';
import { logout } from "../config/security/AuthServices";
import Button from "./Button";
import Logo from "./Logo";
import MenuIcon from "./MenuIcon";
import Sidebar from './Sidebar';

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-full h-36 bg-[#cbc07c] items-center flex flex-row justify-between px-16">
      <MenuIcon onClick={toggleSidebar} /> 
      <Logo />
      <div className="flex flex-row items-center gap-4 justify-center">
        <input
          placeholder="Pesquisar..."
          className={`h-9 rounded-md border box-border border-[rgb(18,61,27)] shadow-lg transition-transform duration-300 hover:shadow-xl focus:outline-none focus:shadow-xl`}
        />
        <Button
          titulo="Sair"
          onClick={() => logout()}
          type="button"
          className="bg-gray-800 text-white hover:bg-[#5e0b12] text-sm"
        />
      </div>
      
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </div>
  );
};

export default Header;
