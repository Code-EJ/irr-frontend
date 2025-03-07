import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";
import { useNavigate } from "react-router-dom";
import SimpleForm from "../components/SimpleForm";
import { useEffect } from "react";
import LoginImage from "../assets/imgs/background.png";
import {AuthService} from "../services";
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
          <Card className="w-[500px] h-[650px] flex flex-row rounded-l-[40px]" width={undefined} bgColor={undefined}>
            <div className="flex flex-col">
              <h2 className="text-2xl text-[#133d1b] font-bold py-2.5 m-0 "> 
                Login
              </h2>
              <InputText titulo="E-mail" name="email" onChange={undefined} className={undefined} titleStyle={undefined} mask={undefined} />
              <InputText titulo="Senha" name="password" onChange={undefined} className={undefined} titleStyle={undefined} mask={undefined} />
              <div className="flex flex-col justify-between  w-full">
                <div className="flex flex-row justify-between w-full pt-4 pb-14">
                  <a style={{ fontSize: "15px", cursor: "pointer", paddingRight: "10px" }}>
                    {" "}
                    Lembre-se de mim
                  </a>
                  <a style={{ fontSize: "15px", cursor: "pointer" }}>
                    {" "}
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
      <div className="w-[500px] h-[650px]">
        <img
          src={LoginImage}
          alt="Imagem de login"
          className="rounded-r-[40px] w-[500px] h-[650px]"
        />
      </div>
    </>
  );
};
export default Login;
