import Card from "../../components/Card";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import SimpleForm from "../../components/SimpleForm";
import { toast } from "react-toastify";
import { UserService } from "../../services";
import LogoImg from "../../assets/imgs/logo_IRR.png";
import BackButton from "../../components/BackButton";
import InputList from "../../components/InputList";
import { useNavigate } from "react-router-dom";

const RegisterUserAdmin = () => {
  const navigate = useNavigate();
  const userTypes = [
    { value: "ADMINISTRADOR", name: "Administrador" },
    { value: "ORGANIZACAO", name: "Organização" },
    { value: "PREFEITURA", name: "Prefeitura" },
    { value: "REPRESENTANTE", name: "Representante de Catadores" },
  ];

  const handleRegister = async (values, { setFieldError, resetForm }) => {
    try {
      const payload = {
        nome: values.nome,
        email: values.email,
        senha: values.senha,
        tipo: values.tipo,
      };

      await UserService.create(payload);
      toast.success("Usuário cadastrado com sucesso!");
      navigate("/users-management");
    } catch (error) {
      const message = error.response?.data?.message || "Erro ao cadastrar o usuário.";
      toast.error(message);

      if (error.response?.data?.errors?.email) {
        setFieldError("email", error.response.data.errors.email);
      }
    }
  };

  return (
    <Card className="w-full h-3/4 max-w-4xl bg-gray-100 rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-[#133d1b] mb-6">
        Cadastro de Usuário
      </h2>
      <SimpleForm
        initialValues={{ nome: "", tipo: "ADMINISTRADOR", email: "", senha: "" }}
        onSubmit={handleRegister}
        autoSetErrors
      >
        {(formik) => (
          <div className="grid grid-cols-2 gap-6 justify-between w-full">
            <InputText titulo="Nome" name="nome" />
            <InputList options={userTypes} titulo="Função" name="tipo" />
            <InputText
              titulo="E-mail"
              name="email"
              error={formik.errors.email}
            />
            <InputText titulo="Senha" name="senha" type="password" />

            <BackButton path={"/users-menu"} />
            <Button
              titulo="Cadastrar"
              type="submit"
              action="primary"
              className="bg-green-950 text-white text-sm"
              onClick={formik.handleSubmit}
              disabled={formik.isSubmitting}
            />
            <img src={LogoImg} alt="Logo IRR" className="w-24 h-24" />
          </div>
        )}
      </SimpleForm>
    </Card>
  );
};

export default RegisterUserAdmin;
