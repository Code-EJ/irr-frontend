/* eslint-disable no-unused-vars */
import React from "react";
import Card from "../components/Card";
import InputText from "../components/InputText";
import Button from "../components/Button";
import SimpleForm from "../components/SimpleForm";
import { apiClient } from "../services/ApiClient";
import { successToast, errorToast } from "../services/ToastServices";

const RegisterUserAdmin = () => {
  const handleRegister = async (values, { setFieldError }) => {
    try {
      const res = await apiClient.post("/users/register", values);
      if (res.status === 201) {
        successToast("Usuário cadastrado com sucesso!");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Erro ao cadastrar o usuário.";
      errorToast(message);

      // Exemplo de erro específico no campo
      if (error.response?.data?.errors?.email) {
        setFieldError("email", error.response.data.errors.email);
      }
    }
  };

  return (
    <div className="bg-cover bg-center min-h-screen flex justify-center items-center p-6">
      {/* Card Principal */}
      <Card className="w-full max-w-4xl bg-gray-100 rounded-3xl shadow-lg p-8">
        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Cadastrar Usuário</h2>

        {/* Formulário */}
        <SimpleForm
          initialValues={{ nome: "", funcao: "", email: "", senha: "" }}
          onSubmit={handleRegister}
          autoSetErrors
        >
          {(formik) => (
            <div className="flex flex-wrap gap-8">
              {/* Coluna Esquerda */}
              <div className="flex-1 min-w-[300px]">
                <InputText
                  titulo="Nome"
                  name="nome"
                  value={formik.values.nome}
                  onChange={formik.handleChange}
                />
                <InputText
                  titulo="Função"
                  name="funcao"
                  value={formik.values.funcao}
                  onChange={formik.handleChange}
                />
              </div>

              {/* Coluna Direita */}
              <div className="flex-1 min-w-[300px]">
                <InputText
                  titulo="E-mail"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.errors.email}
                />
                <InputText
                  titulo="Senha"
                  name="senha"
                  value={formik.values.senha}
                  onChange={formik.handleChange}
                />

                {/* Botão */}
                <div className="mt-6 text-right">
                  <Button
                    titulo="Cadastrar"
                    type="submit"
                    className="bg-green-700 text-white rounded-full px-6 py-2"
                    onClick={formik.handleSubmit}
                    disabled={formik.isSubmitting}
                  />
                </div>
              </div>
            </div>
          )}
        </SimpleForm>

        {/* Logo */}
        <div className="mt-8 flex justify-end">
          <img
            src="/src/logo.svg"
            alt="Logo"
            className="w-24 h-auto"
          />
        </div>
      </Card>
    </div>
  );
};

export default RegisterUserAdmin;
