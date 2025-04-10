import ButtonsMenu from "../../components/generics/ButtonsMenu";

const TriageMenu = () => {
  const menuItems = [
    { title: "Cadastro de Triágem", color: "#133D1A", link: "/users-register" },
    { title: "Listagem de Triágem", color: "#133D1A", link: "/triage-list" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-white mb-4">TRIAGEM</h1>
      <ButtonsMenu items={menuItems} showBackButton={true} backDestination="/menu" />
    </div>
  );
}
export default TriageMenu;
