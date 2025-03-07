import MenuImage from "../assets/imgs/menu.png";

import React from 'react';

interface MenuIconProps {
  onClick: () => void;
}

const MenuIcon: React.FC<MenuIconProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="text-3xl text-gray-700 transition-transform duration-300">
      <img src={MenuImage} alt="Imagem de login" className="w-10 h-10" />
    </button>
  );
};

export default MenuIcon;
