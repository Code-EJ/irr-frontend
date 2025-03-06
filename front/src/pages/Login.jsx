import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useField, useFormikContext } from "formik";
import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";
import SimpleForm from "../components/SimpleForm";
import LoginImage from "../assets/background.png";
import { handleAuth } from "../services/AuthServices";

const InputList = ({ onChange, titulo, ...props }) => {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  const options = [
    { value: 1, name: "Admin" },
    { value: 2, name: "Organização" },
    { value: 3, name: "Prefeitura" },
    { value: 4, name: "Representante de Catadores" },
  ];

  return (
    <div className="text-black flex flex-col mt-3.5">
      <div className="w-full flex mb-3.5">
        <b className="text-3.5 font-bold">{titulo}</b>
      </div>
      <select
        className="w-72 h-9 rounded-md border border-[rgb(18,61,27)] shadow-lg transition-shadow transition-transform duration-300 hover:shadow-lg focus:shadow-xl focus:outline-none"
        {...props}
        {...field}
        onChange={(event) => {
          setFieldValue(field.name, event.target.value);
          if (onChange) {
            onChange(event.target.value);
          }
        }}
      >
        <option value="" disabled>
          Selecione uma opção
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();

  const onSubmit = (values) => {
    const data = {
      username: values.username,
      password: values.password,
      email: values.email,
      type: values.type,
    };

    handleAuth(data)
      .then(() => {
        toast.success("Login bem-sucedido!");
        navigate("/home");
      })
      .catch(() => toast.error("Usuário inválido"));
  };

  return (
    <div className="w-screen h-screen bg-black flex flex-row content-center items-center justify-center">
      <SimpleForm
        onSubmit={onSubmit}
        initialValues={{
          username: "",
          email: "",
          password: "",
          type: "",
        }}
      >
        {() => (
          <Card className="w-[500px] h-[650px] flex flex-row rounded-l-[40px]">
            <div className="flex flex-col p-8">
              <p
                className="py-2.5 text-[#5D8C68] font-bold text-2xl"
                style={{ fontFamily: "NeverMind Bauhaus" }}
              >
                Login
              </p>
              <InputText titulo="Nome" name="username" />
              <InputText titulo="E-mail" name="email" />
              <InputText titulo="Senha" name="password" />
              <InputList titulo="Tipo de usuário" name="type" />

              <div className="flex flex-col justify-between w-full">
                <div className="flex flex-row justify-between w-full pt-4 pb-14">
                  <a
                    style={{ fontSize: "15px", cursor: "pointer" }}
                    className="text-green-500"
                  >
                    Lembre-se de mim
                  </a>
                  <a
                    style={{ fontSize: "15px", cursor: "pointer" }}
                    className="text-green-500"
                  >
                    Esqueci minha senha
                  </a>
                </div>
                <Button
                  titulo="ENTRAR"
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
        <img
          src={LoginImage}
          alt="Imagem de login"
          className="rounded-r-[40px] w-[500px] h-[650px]"
        />
      </div>
    </div>
  );
};

export default Login;
