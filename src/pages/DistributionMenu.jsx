import ButtonsMenu from "../components/ButtonsMenu";


const DistributionMenu = () => {
  const menuItems = [
    { title: "Nova Coleta", color: "#133D1A", link: "/cadastro-coleta" },
    { title: "Nova Doação", color: "#133D1A", link: "/cadastro-doacao" },
    { title: "Novo Veículo", color: "#133D1A", link: "/cadastro-veiculo" },
    { title: "Novo Motorista", color: "#133D1A", link: "/cadastro-motorista" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-white mb-4">DISTRIBUIÇÃO</h1>
      <ButtonsMenu items={menuItems} showBackButton={true} backDestination="menu" />
    </div>
  );
}
export default DistributionMenu;
