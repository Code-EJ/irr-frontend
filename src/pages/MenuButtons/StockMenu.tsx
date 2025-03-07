import ButtonsMenu from "../../components/generics/ButtonsMenu";


const StockMenu = () => {
  const menuItems = [
    { title: "Material de Entrada", color: "#133D1A", link: "/input-material-list" },
    { title: "Material de Saída", color: "#133D1A", link: "/output-material-list" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-white mb-4">ESTOQUE</h1>
      <ButtonsMenu items={menuItems} showBackButton={true} backDestination="/menu" />
    </div>
  );
}
export default StockMenu;
