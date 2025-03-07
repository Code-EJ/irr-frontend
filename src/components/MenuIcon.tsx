import MenuImage from "../assets/imgs/menu.png";

interface MenuIconProps {
    onClick: () => void;
}

const MenuIcon: React.FC<MenuIconProps> = ({ onClick }) => {
    return (
        <div onClick={onClick}>
            {<img src={MenuImage} alt="Imagem de login" className="w-10 h-10" />}
        </div>
    );
};
export default MenuIcon
