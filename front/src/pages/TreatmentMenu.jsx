import Card from "../components/Card";

const TreatmentMenu = () => {
  const menuItems = [
    { title: "TRIAGENS", color: "#133D1A", link: "/screening" },
    { title: "PRENSAGENS", color: "#133D1A", link: "/menu-tratamentos" },
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
export default TreatmentMenu;
