import Button from "../components/Button";
import Card from "../components/Card";
import { handleBack } from "../services/NavigationServices";

const EntryMenu = () => {
  const menuItems = [
    { title: "Nova Coleta", color: "#133D1A", link: "/cadastro-coleta" },
    { title: "Nova Doação", color: "#133D1A", link: "/cadastro-doacao" },
    { title: "Novo Veículo", color: "#133D1A", link: "/cadastro-veiculo" },
  ];

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-1 gap-8 items-center justify-center">
        {menuItems.map((item, index) => (
          <Card
            key={index}
            className="w-full max-w-[10rem] h-[8.5rem] md:max-w-[11rem] md:h-[9.5rem] text-center rounded-[26px] flex items-center justify-center font-semibold cursor-pointer hover:shadow-2xl hover:bg-slate-50"
            onClick={() => (window.location.href = `${item.link}`)}
          >
            <h1 className="text-center font-semibold text-sm md:text-lg uppercase text-[#133D1A]">
              {item.title}
            </h1>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-10">
      <Button
          titulo="Voltar"
          onClick={() => handleBack("menu")}
          className="bg-red-700 text-white text-sm hover:bg-red-900"
        />
      </div>
    </div>
  )
}
export default EntryMenu;
