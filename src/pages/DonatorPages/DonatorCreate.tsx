import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import { DonatorService } from "../../services";
import { toast } from "react-toastify";
import InputList from   "../../components/InputList";

const DonatorCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    tipo: "PESSOA_FISICA" as "PESSOA_FISICA" | "PESSOA_JURIDICA",
    cadastroNacional: "",
  });

  const tiposDoador = [
    "PESSOA_FISICA",
    "PESSOA_JURIDICA"
  ]

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await DonatorService.create(formData); 
      toast.success("Doador criado com sucesso!");
      navigate("/donator-list"); 
    } catch (error) {
      toast.error("Erro ao criar doador. Verifique os dados e tente novamente.");
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
        {() => (
          <Card>
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">Cadastrar Doador</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

              <InputText
                type="text"
                titulo="Nome"
                name="nome"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("nome", value)}
              />

              <InputText
                type="text"
                titulo="Endereço"
                name="endereco"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("endereco", value)}
              />

              <InputList
                titulo="Tipo de Doador"
                name="tipo"
                options={tiposDoador.map((tipo) => ({
                  name: tipo,
                  value: tipo,
                }))}
                onChange={(value) => handleChange("tipo", value)}
              />

              <InputText
                type="text"
                titulo="Cadastro Nacional"
                name="cadastroNacional"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("cadastroNacional", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"donator-list"} />
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

export default DonatorCreate;
