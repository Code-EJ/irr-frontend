import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";

const handleLogin = () => {
  console.log("login");
};

const Login = () => {
  return (
    <div>
      <Card width="400px">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <InputText titulo="Nome" />
          <InputText titulo="E-mail" />
          <InputText titulo="Senha" />
          <InputText titulo="Tipo de usuário" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "40px",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <u style={{ fontSize: "15px" }}> Esqueci minha senha</u>
              <u style={{ fontSize: "15px" }}> Esqueci minha senha</u>
            </div>
            <Button
              titulo="Entrar"
              onClick={handleLogin}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
export default Login;
