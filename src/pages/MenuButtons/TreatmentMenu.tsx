import ButtonsMenu from "../../components/generics/ButtonsMenu";

const TreatmentMenu = () => {
  const menuItems = [
    { title: "Triagem", color: "#133D1A", link: "/screening-list" },
    { title: "Prensagem", color: "#133D1A", link: "/pressing-list" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-white mb-4">TRATAMENTO</h1>
      <ButtonsMenu items={menuItems} showBackButton={true} backDestination="/menu" />
    </div>
  );
}
export default TreatmentMenu;
