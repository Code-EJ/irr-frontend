import Button from "../components/Button";
import Card from "../components/Card";
import { AuthService } from "../services";

const LandingPage = () => {
  const menuItems = [
    { title: "Usuários", color: "#133D1A", link: "/users-menu" },
    { title: "Materiais", color: "#133D1A", link: "/materials-menu" },
    { title: "Tratamento", color: "#133D1A", link: "/treatment-menu" },
    { title: "Distribuição", color: "#133D1A", link: "/distribution-menu" },
    { title: "Estoque", color: "#133D1A", link: "/stock-menu" },
    { title: "Mercado", color: "#133D1A", link: "/sale-list" },
    { title: "Perfil", color: "#133D1A", link: "/profile" },
  ];

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
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
      </div>
      <div className="flex justify-center mt-10">
        <Button
          titulo="Sair"
          onClick={() => AuthService.logout()}
          className="bg-red-700 text-white text-sm hover:bg-[#5e0b12]"
        />
      </div>
    </div>
  );
};

export default LandingPage;
