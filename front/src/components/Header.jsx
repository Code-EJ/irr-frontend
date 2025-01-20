import InputText from "./InputText";
import Logo from "./Logo";
import MenuIcon from "./MenuIcon";
import SimpleForm from "./SimpleForm";

const Header = () => {
  return (
    <div className="w-full h-36 bg-[#cbc07c] items-center flex flex-row justify-around px-16">
      <MenuIcon />
      <Logo />
      <SimpleForm onSubmit={() => console.log("a")} initialValues={{}}>
        {() => <InputText name="username" className="w-30" />}
      </SimpleForm>
    </div>
  );
};
export default Header;
