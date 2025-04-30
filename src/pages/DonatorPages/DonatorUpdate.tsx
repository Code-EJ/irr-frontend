import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import { DonatorService } from "../../services";
import { toast } from "react-toastify";

const DonatorUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    endereco: "",
    tipo: "",
    cadastroNacional: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DonatorService.get(id!);
        setFormData({
          id: response?.id ?? "",
          nome: response?.nome ?? "",
          endereco: response?.endereco ?? "",
          tipo: response?.tipo ?? "",
          cadastroNacional: response?.cadastroNacional ?? "",
        });
      } catch (error) {
        toast.error("Erro ao carregar os dados do doador.");
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await DonatorService.update(id!, {
        nome: formData.nome,
        endereco: formData.endereco,
        tipo: formData.tipo,
        cadastroNacional: formData.cadastroNacional,
      }, { id });

      toast.success("Doador atualizado com sucesso!");
      navigate("/donator-list");
    } catch (error) {
      toast.error("Erro ao atualizar doador. Verifique os dados e tente novamente.");
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
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">ATUALIZAR DOADOR</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="text"
                titulo="Nome"
                name="nome"
                value={formData.nome}
                onChange={(value) => handleChange("nome", value)}
              />
              <InputText
                type="text"
                titulo="Endereço"
                name="endereco"
                value={formData.endereco}
                onChange={(value) => handleChange("endereco", value)}
              />
              <InputText
                type="text"
                titulo="Tipo"
                name="tipo"
                value={formData.tipo}
                onChange={(value) => handleChange("tipo", value)}
              />
              <InputText
                type="text"
                titulo="Cadastro Nacional"
                name="cadastroNacional"
                value={formData.cadastroNacional}
                onChange={(value) => handleChange("cadastroNacional", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"donator-list"} />
              <Button
                titulo="Atualizar"
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

export default DonatorUpdate;
