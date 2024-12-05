import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";

const handleLogin = () => {
  console.log("login");
};

const Login = () => {
  return (
    <div>
      <Card>
        <>
          <InputText titulo="Nome" />
          <InputText titulo="E-mail" />
          <InputText titulo="Senha" />
          <InputText titulo="Tipo de usuário" />
          <u> Esqueci minha senha</u>
          <p> Lembre-se de mim </p>
          <Button titulo="Entrar" onClick={handleLogin} />
        </>
      </Card>
    </div>
  );
};
export default Login;
