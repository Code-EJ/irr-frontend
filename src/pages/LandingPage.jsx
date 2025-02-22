import Button from "../components/Button";
import Card from "../components/Card";
import { logout } from "../services/AuthServices";

const LandingPage = () => {
  const menuItems = [
    { title: "Cadastro de usuários", color: "#133D1A", link: "/cadastro-usuarios" },
    { title: "Manejo de usuários", color: "#133D1A", link: "/manejo-usuarios" },
    { title: "Tratamento", color: "#133D1A", link: "/menu-tratamentos" },
    {
      title: "Entradas e saídas",
      color: "#133D1A",
      link: "/menu-entradas-saidas",
    },
    // {
    //   title: "Relatórios e visualização",
    //   color: "#133D1A",
    //   link: "/menu-relatorios",

    // },
    {
      title: "Lista de coletas",
      color: "#133D1A",
      link: "/lista-coletas",
    },
    {
      title: "Motoristas",
      color: "#133D1A",
      link: "/motoristas",
    },
    {
      title: "Veículos",
      color: "#133D1A",
      link: "/veiculos",
    }
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
          onClick={() => logout()}
          className="bg-red-700 text-white text-sm hover:bg-[#5e0b12]"
        />
      </div>
    </div>
  );
};

export default LandingPage;
