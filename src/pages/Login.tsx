import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";
import { useNavigate } from "react-router-dom";
import SimpleForm from "../components/SimpleForm";
import { useEffect } from "react";
import LoginImage from "../assets/imgs/background.png";
import { AuthService } from "../services";
import { toast } from "react-toastify";
import { deleteToken } from "../config/security/Client";

const Login = () => {
  const navigate = useNavigate();

  const onSubmit = async (values: { email: any; password: any; }) => {
    const res = await AuthService.login({
      email: values.email,
      senha: values.password
    })

    if (!res) toast.error("Usuário invalido");

    navigate("/menu");
  };

  useEffect(() => {
    deleteToken();
  }, []);

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
