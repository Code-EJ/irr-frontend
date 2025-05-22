import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import { toast } from "react-toastify";
import { DriverService } from "../../services";

const DriverCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await DriverService.create(formData);
      toast.success("Motorista criado com sucesso!");
      navigate("/driver-list");
    } catch (error) {
      toast.error("Erro ao criar motorista. Verifique os dados.");
      console.error(error);
    }
  };

  return (
    <Card className="rounded-[50px] shadow-lg w-3/4 max-w-4xl mx-auto p-4">
      <SimpleForm
        initialValues={formData}
        onSubmit={handleSubmit}
        autoSetErrors={true}
        submitOnChange={false}
      >
        {() => (
          <Card>
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">
              NOVO MOTORISTA
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                titulo="Nome"
                name="nome"
                onChange={(value) => handleChange("nome", value)}
              />
              <InputText
                titulo="CPF"
                name="cpf"
                onChange={(value) => handleChange("cpf", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/driver-list" />
              <Button
                titulo="Criar"
                type="button"
                variant="primary"
                className="bg-green-950 text-white text-sm"
                onClick={handleSubmit}
              />
            </div>
          </Card>
        )}
      </SimpleForm>
    </Card>
  );
};

export default DriverCreate;
