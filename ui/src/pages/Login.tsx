import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";

const handleLogin = () => {
  console.log("login");
};

const testee = [1, 2, 3, 4, 5, 6, 7];

const Login = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        display: "flex",
        alignContent: "center",
        alignItems: "center",
      }}
    >
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
