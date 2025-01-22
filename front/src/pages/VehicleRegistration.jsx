import React from "react";
import Card from "../components/Card";
import InputText from "../components/InputText";
import SimpleForm from "../components/SimpleForm";
import { successToast, errorToast } from "../services/ToastServices";
import Button from "../components/Button";
import { handleBack } from "../services/NavigationServices";
import { get } from "../utils/LodashAlternatives";
import { createVehicle } from "../services/VehicleServices";
import BackButton from "../components/BackButton";

const VehicleRegistration = () => {
  const handleSubmit = async (values) => {
    const data = {
      modelo: get(values, "modelo"),
      ano: get(values, "ano"),
      placa: get(values, "placa"),
      marca: get(values, "marca"),
      cor: get(values, "cor"),
    }
    createVehicle(data)
      .then(() => successToast("Deu certo"))
      .catch((err) => errorToast(err.message))
  };

  return (
    <Card className="w-full max-w-4xl rounded-[40px]">
      <h2 className="text-2xl text-[#133d1b] font-bold mb-6">
        Cadastro de Veículo
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
              <BackButton onClick={handleBack} route="menu-entradas-saidas" />
              <Button
                type="submit"
                titulo="Cadastrar veículo"
                className="bg-green-800 text-white hover:bg-green-700"
              />
            </div>
          </>
        )}
      </SimpleForm>
    </Card>
  );
};

export default VehicleRegistration;
