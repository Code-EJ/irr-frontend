
import ButtonsMenu from "../../components/ButtonsMenu";

const UsersMenu = () => {
  const menuItems = [
    { title: "Criação de usuários", color: "#133D1A", link: "/users-register" },
    { title: "Manejo de usuários", color: "#133D1A", link: "/users-management" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-white mb-4">USUÁRIOS</h1>
      <ButtonsMenu items={menuItems} showBackButton={true} backDestination="menu" />
    </div>
  );
}
export default UsersMenu;
