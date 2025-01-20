/* eslint-disable no-unused-vars */
import React from "react";
import Card from "../components/Card";
import InputText from "../components/InputText";
import SimpleForm from "../components/SimpleForm";
import { apiClient } from "../services/ApiClient";
import { successToast, errorToast } from "../services/ToastServices";

const VehicleRegistration = () => {
  const handleSubmit = async (values) => {
    try {
      const response = await apiClient.post("/vehicles", values);
      if (response.status === 201) {
        successToast("Veículo cadastrado com sucesso!");
      }
    } catch (error) {
      errorToast("Erro ao cadastrar o veículo. Tente novamente.");
    }
  };

  return (
    <div className="bg-green-900 min-h-screen flex justify-center items-center p-8">
      <Card className="w-full max-w-4xl rounded-[40px]">
          <h2 className="text-2xl text-green-800 font-bold mb-6">
            CADASTRO DE VEÍCULO
          </h2>

          <SimpleForm
            initialValues={{
              modelo: "",
              ano: "",
              placa: "",
              marca: "",
              cor: "",
            }}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <>
                <div className="flex flex-wrap gap-6 justify-between w-full">
                  <div className="flex-1 min-w-[250px]">
                    <InputText titulo="Modelo" name="modelo" />
                  </div>
                  <div className="flex-1 min-w-[250px]">
                    <InputText titulo="Ano" name="ano" />
                  </div>
                  <div className="flex-1 min-w-[250px]">
                    <InputText titulo="Placa" name="placa" />
                  </div>
                  <div className="flex-1 min-w-[250px]">
                    <InputText titulo="Marca" name="marca" />
                  </div>
                  <div className="flex-1 min-w-[250px]">
                    <InputText titulo="Cor" name="cor" />
                  </div>
                </div>

                <div className="flex justify-between items-center w-full mt-6">
                  <button
                    type="button"
                    className="text-green-700 text-sm hover:underline"
                    onClick={() => errorToast("Coleta excluída com sucesso!")}
                  >
                    Excluir Coleta
                  </button>

                  <button
                    type="submit"
                    className="bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Cadastrar Veículo
                  </button>
                </div>
              </>
            )}
          </SimpleForm>
      </Card>
    </div>
  );
};

export default VehicleRegistration;
