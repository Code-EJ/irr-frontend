import Card from "../components/Card";
import LoginImage from "../assets/background.png";
import fontCard from "../assets/fonts/Montserrat-Regular.ttf";

const LandingPage = () => {
  const onSubmit = (values) => {
    console.log("Form Submitted with values:", values);
  };

  const menuItems = [
    { title: "Coleta", color: "#133D1A", fontFamily: { fontCard } },
    { title: "Materiais", color: "#133D1A", fontFamily: { fontCard } },
    { title: "Rotas", color: "#133D1A", fontFamily: { fontCard } },
    { title: "Tratamento", color: "#133D1A", fontFamily: { fontCard } },
    { title: "Estoque", color: "#133D1A", fontFamily: { fontCard } },
    { title: "Relatórios", color: "#133D1A", fontFamily: { fontCard } },
    { title: "Mercado", color: "#133D1A", fontFamily: { fontCard } },
    { title: "Perfil", color: "#133D1A", fontFamily: { fontCard } },
  ];

  return (
    <div className="h-screen flex flex-col">
      <header>
        <div className="w-full h-24 flex items-center justify-between px-6 md:px-16">
          <img src="" alt="Logo" className="h-12 md:h-24" />
          <input
            type="text"
            className="bg-white rounded-[18px] border-[2px] border-[#5D8C68] px-4 py-2 w-40 md:w-60"
          />
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="w-full max-w-[10rem] h-[8.5rem] md:max-w-[11rem] md:h-[9.5rem] text-center rounded-[26px] border-[3px] border-[#133D1A] flex items-center justify-center font-semibold"
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