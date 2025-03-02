import { logout } from "../config/security/AuthServices";
import Button from "./Button";
import Logo from "./Logo";
import MenuIcon from "./MenuIcon";

const Header = () => {
  return (
    <div className="w-full h-36 bg-[#cbc07c] items-center flex flex-row justify-between px-16">
      <MenuIcon />
      <Logo />
      <div className="flex flex-row items-center gap-4 justify-center">
      {/* <SimpleForm onSubmit={() => console.log("a")} initialValues={{}}>
        {() => <InputText name="username" className="w-30" />}
      </SimpleForm> */}
      <input
      placeholder="Pesquisar..."
        className={`h-9 rounded-md border box-border border-[rgb(18,61,27)] shadow-lg transition-shadow transition-transform duration-300 hover:shadow-xl focus:outline-none focus:shadow-xl`}
        />
      <Button
          titulo="Sair"
          onClick={() => logout()}
          className="bg-gray-800 text-white hover:bg-[#5e0b12] text-sm"
          />
          </div>
    </div>
  );
};
export default Header;
