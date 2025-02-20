import ButtonsMenu from "../../components/ButtonsMenu";


const DistributionMenu = () => {
  const menuItems = [
    { title: "Coleta", color: "#133D1A", link: "/collection-list" },
    { title: "Doação", color: "#133D1A", link: "/donation-list" },
    { title: "Veículo", color: "#133D1A", link: "/vehicle-list" },
    { title: "Motorista", color: "#133D1A", link: "/driver-list" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-white mb-4">DISTRIBUIÇÃO</h1>
      <ButtonsMenu items={menuItems} showBackButton={true} backDestination="menu" />
    </div>
  );
}
export default DistributionMenu;
