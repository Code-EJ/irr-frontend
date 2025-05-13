import Button from "../Button";
import BackButton from "../BackButton";


type MenuItem = {
  title: string;
  color: string;
  link: string;
};

type ButtonsMenuProps = {
  items: MenuItem[];
  showBackButton?: boolean;
  backDestination?: string;
};

const ButtonsMenu: React.FC<ButtonsMenuProps> = ({ items, showBackButton, backDestination}) => {
  return (
    <div className="flex w-full flex-col items-center bg-green-900 p-6 rounded-lg min-h-[5rem]">
      <div className="flex flex-1 gap-8 items-center justify-center">
        {items.map((item, index) => (
          <Button
            key={index}
            className="w-full max-w-[9rem] min-w-[6rem] h-[6rem] text-center rounded-[20px] flex items-center justify-center font-semibold cursor-pointer hover:shadow-2xl hover:bg-slate-200 border border-green-900 bg-white text-green-900"
            onClick={() => (window.location.href = item.link)}
            titulo={item.title}
            type="button"
          >
            <h1 className="text-center font-semibold text-sm md:text-lg uppercase">
              {item.title}
            </h1>
          </Button>
        ))}
        
      </div>
      {showBackButton && (
        <div className="flex justify-center mt-6">
          <BackButton path={backDestination || "/menu"} />
        </div>
      )}
    </div>
  );
};

export default ButtonsMenu;