import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";
import SimpleForm from "../components/SimpleForm";
import LoginImage from "../assets/imgs/background.png";
import { AuthService } from "../services";
import { toast } from "react-toastify";

const Login = () => {
  const onSubmit = async (values: { email: any; password: any; }) => {
    const res = await AuthService.login({
      email: values.email,
      senha: values.password
    })

    if (res.status === 200 ) {
      const event = new CustomEvent("user-logged-in", {
        detail: { mesage: "Login realizado com sucesso."}
      })
      window.dispatchEvent(event);

      return;

    } else {
      toast.error(res.error);

      return;
    }

  };

  return (
    <>
      <SimpleForm onSubmit={onSubmit} initialValues={{
        email: "",
        password: ""
      }} autoSetErrors={undefined} submitOnChange={undefined}>
        {() => (
          <Card className="w-full min-w-[400px] h-[476.5px] flex flex-row rounded-[40px] border-[1px] border-[#ccc] md:rounded-r-[0px]">
            <div className="flex flex-col w-full">
              <h2 className="text-2xl text-[#133d1b] font-bold py-2.5 m-0">
                Login
              </h2>
              <InputText
                titulo="E-mail"
                name="email"
                onChange={undefined}
                className="pl-2" 
                titleStyle={undefined}
                mask={undefined}
              />
              <InputText
                titulo="Senha"
                name="password"
                onChange={undefined}
                className="pl-2"
                titleStyle={undefined}
                mask={undefined}
                type="password"
                />
              <div className="flex flex-col justify-between w-full">
                <div className="flex flex-row justify-between w-full pt-4 pb-14">
                  <a style={{ fontSize: "15px", cursor: "pointer", paddingRight: "10px" }}>
                    Lembre-se de mim
                  </a>
                  <a style={{ fontSize: "15px", cursor: "pointer" }}>
                    Esqueci minha senha
                  </a>
                </div>
                <Button
                  titulo="Entrar"
                  action="primary"
                  type="submit"
                  className="w-full text-white"
                />
              </div>
            </div>
          </Card>
        )}
      </SimpleForm>

      <div className="w-full max-w-[500px] h-auto">
        <img
          src={LoginImage}
          alt="Imagem de login"
          className="rounded-r-[40px] w-full h-[476.5px] object-cover hidden md:block"
        />
      </div>
    </>

  );
};
export default Login;
