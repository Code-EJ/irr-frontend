import Card from "../components/Card";

const LandingPage = () => {
  const menuItems = [
    { title: "Manejo de usuários", color: "#133D1A", link: "/manage-users" },
    { title: "Tratamento", color: "#133D1A", link: "/menu-tratamentos" },
    {
      title: "Relatórios e visualização",
      color: "#133D1A",
      link: "/menu-relatorios",
    },
    {
      title: "Entradas e saídas",
      color: "#133D1A",
      link: "/menu-entradas-saidas",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-green-900 justify-center items-center p-8">
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
    </div>
  );
};

export default LandingPage;
