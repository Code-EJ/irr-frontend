import ButtonsMenu from "../../components/generics/ButtonsMenu";

const DocumentMenu = () => {
  const menuItems = [
    { title: "Documento", color: "#133D1A", link: "/document-list" },
    { title: "Mídia", color: "#133D1A", link: "/media-list" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-white mb-4">Documentos</h1>
      <ButtonsMenu items={menuItems} showBackButton={true} backDestination="/menu" />
    </div>
  );
}
export default DocumentMenu;
