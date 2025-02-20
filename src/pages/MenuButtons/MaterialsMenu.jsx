import ButtonsMenu from "../../components/ButtonsMenu";

const MaterialsMenu = () => {
  const menuItems = [
    { title: "Tipologia", color: "#133D1A", link: "/typology-list" },
    { title: "Subitipologia", color: "#133D1A", link: "/subtypology-list" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-white mb-4">MATERIAIS</h1>
      <ButtonsMenu items={menuItems} showBackButton={true} backDestination="menu" />
    </div>
  );
}
export default MaterialsMenu;
