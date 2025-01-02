import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";
import InputList from "../components/InputList";
import { handleAuth } from "../services/AuthServices";
import { Navigate } from "react-router-dom";
import SimpleForm from "../components/SimpleForm";
import LoginImage from "../assets/background.png";

const onSubmit = (values) => {
  const data = {
    username: values.username,
    password: values.password,
    email: values.email,
    type: values.type,
  };

  handleAuth(data)
    .then(() => <Navigate to="/home" />)
    .catch(() => toast.error("Usuário invalido"));
};

const Login = () => {
  return (
    <div className="w-screen h-screen bg-black flex flex-row content-center items-center justify-center">
      <SimpleForm onSubmit={onSubmit} initialValues={{}}>
        {() => (
          <Card className="w-[500px] h-[650px] flex flex-row rounded-l-[40px]">
            <div className="flex flex-col">
              <p
                 className="py-2.5 m-0 text-[#5D8C68] font-semibold"
                 style={{ fontFamily: "NeverMind Bauhaus" }}
              >
                Login
              </p>
              <InputText titulo="Nome" name="username" />
              <InputText titulo="E-mail" name="email" />
              <InputText titulo="Senha" name="password" />
              <InputList titulo="Tipo de usuário" name="type" />

              <div className="flex flex-col justify-between  w-full">
                <div className="flex flex-row justify-between w-full pt-4 pb-14">
                  <a style={{ fontSize: "15px", cursor: "pointer" }}>
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
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        )}
      </SimpleForm>
      <div className="w-[500px] h-[650px]">
        <img src={LoginImage} alt="Imagem de login" className="rounded-r-[40px] w-full h-full"/>
      </div>
    </div>
  );
};
export default Login;
