/* eslint-disable no-unused-vars */
import Card from "../components/Card";
import InputText from "../components/InputText";
import Button from "../components/Button";
import SimpleForm from "../components/SimpleForm";
import { apiClient } from "../config/security/ApiClient";
import LogoImg from "../assets/imgs/logo_IRR.png";
import BackButton from "../components/BackButton";
import InputList from "../components/InputList";
import { toast } from "react-toastify";

const RegisterUserAdmin = () => {
  const userTypes = [
    { value: 1, name: "Admin" },
    { value: 2, name: "Organização" },
    { value: 3, name: "Prefeitura" },
    { value: 4, name: "Representante de Catadores" },
  ]
  
  const handleRegister = async (values, { setFieldError }) => {
    try {
      const res = await apiClient.post("/users/register", values);
      if (res.status === 201) {
        toast.success("Usuário cadastrado com sucesso!");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Erro ao cadastrar o usuário.";
      toast.error(message);

      // Exemplo de erro específico no campo
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
        initialValues={{ nome: "", funcao: "", email: "", senha: "" }}
        onSubmit={handleRegister}
        autoSetErrors
      >
        {(formik) => (
          <div className="grid grid-cols-2 gap-6 justify-between w-full">
            <InputText
              titulo="Nome"
              name="nome"
            />
            <InputList options={userTypes} titulo="Função" name="function" />
            <InputText
              titulo="E-mail"
              name="email"
              error={formik.errors.email}
            />
            <InputText
              titulo="Senha"
              name="senha"
            />
            <BackButton route="menu" />
            <Button
              titulo="Cadastrar"
              type="submit"
              action="primary"
              className="bg-green-950 text-white text-sm"
              onClick={formik.handleSubmit}
              disabled={formik.isSubmitting}
            />
            <img src={LogoImg} alt="Imagem de login" className="w-24 h-24" />
          </div>
        )}
      </SimpleForm>
    </Card>
  );
};

export default RegisterUserAdmin;
