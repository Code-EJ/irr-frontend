import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import { TypologyService } from "../../services";
import { toast } from "react-toastify";

const TipologyCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    valor: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await TypologyService.create({
        ...formData,
        valor: Number(formData.valor),
      });
      toast.success("Tipologia criada com sucesso!");
      navigate("/tipology-list");
    } catch (error) {
      toast.error("Erro ao criar tipologia. Verifique os dados e tente novamente.");
      console.error(error);
    }
  };

  return (
    <Card className="rounded-[50px] shadow-lg d-flex flex-col w-3/4 max-w-4xl mx-auto p-4">
      <SimpleForm
        initialValues={formData}
        onSubmit={handleSubmit}
        autoSetErrors={true}
        submitOnChange={false}
      >
        {(formik) => (
          <Card>
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">Cadastrar Tipologia</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="text"
                titulo="ID"
                name="id"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("id", value)}
              />

              <InputText
                type="text"
                titulo="Nome"
                name="nome"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("nome", value)}
              />

              <InputText
                type="number"
                titulo="Valor"
                name="valor"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("valor", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"tipology-list"} />
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

export default TipologyCreate;
