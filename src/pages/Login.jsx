import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";
import InputList from "../components/InputList";
import { deleteToken, handleAuth } from "../services/AuthServices";
import { Navigate } from "react-router-dom";
import SimpleForm from "../components/SimpleForm";
import { useEffect } from "react";
import LoginImage from "../assets/background.png";


const Login = () => {
  const options = [
    { value: 1, name: "Admin" },
    { value: 2, name: "Organização" },
    { value: 3, name: "Prefeitura" },
    { value: 4, name: "Representante de Catadores" },
  ]

  const onSubmit = (values) => {
    const data = {
      username: values.username,
      password: values.password,
      email: values.email,
      type: values.type,
    };

    handleAuth(data)
      .then(() => <Navigate to="/menu" />)
      // .catch(() => toast.error("Usuário invalido"));
      .catch(() =>   window.location.href = "/menu");
  };

  useEffect(() => {
    deleteToken();
  }, []);

  return (
    <>
      <SimpleForm onSubmit={onSubmit} initialValues={{}}>
        {() => (
          <Card className="w-[500px] h-[650px] flex flex-row rounded-l-[40px]">
            <div className="flex flex-col">
              <h2 className="text-2xl text-[#133d1b] font-bold py-2.5 m-0 text-[#5D8C68]">
                Login
              </h2>
              <InputText titulo="Nome" name="username" />
              <InputText titulo="E-mail" name="email" />
              <InputText titulo="Senha" name="password" />
              <InputList titulo="Tipo de usuário" name="type" options={options} />

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
