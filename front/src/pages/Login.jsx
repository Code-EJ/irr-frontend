import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";
import { handleAuth } from "../services/AuthServices";
import { Navigate } from "react-router-dom";
import SimpleForm from "../components/SimpleForm";

// formik YUP !!!

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
        justifyContent: "center",
      }}
    >
      <SimpleForm onSubmit={onSubmit} initialValues={{}}>
        {({ formik }) => (
          <Card width="400px">
            <div
              style={{
                height: "550px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  padding: "10px 0",
                  margin: "0",
                  color: "#5D8C68",
                  fontFamily: "NeverMind Bauhaus",
                  fontWeight: "600",
                }}
              >
                Login
              </p>
              <InputText titulo="Nome" name="username" />
              <InputText titulo="E-mail" name="email" />
              <InputText titulo="Senha" name="password" />
              <div>
                <label
                  style={{
                    fontSize: "15px",
                    display: "flex",
                    fontWeight: "bold",
                    paddingTop: 15,
                    paddingBottom: 15,
                  }}
                >
                  Tipo de usuário
                </label>

                <input
                  list="userType"
                  style={{
                    display: "flex",
                    width: "300px",
                    height: "35px",
                    borderRadius: "10px",
                    border: "1px solid rgb(18, 61, 27)",
                    boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 6px",
                    transition: "box-shadow 0.3s",
                    transform: "0.3s",
                  }}
                />

                <datalist id="userType">
                  <option value="Admin" />
                  <option value="Organização" />
                  <option value="Prefeitura" />
                  <option value="Representante de Catadores" />
                </datalist>
              </div>

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
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </Card>
        )}
      </SimpleForm>
    </div>
  );
};
export default Login;
