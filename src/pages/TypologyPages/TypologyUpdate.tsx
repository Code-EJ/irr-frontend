import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import { TypologyService } from "../../services";
import { toast } from "react-toastify";

const TypologyUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nome: "",
    valor: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await TypologyService.get(id!);
        setFormData({
          nome: response?.nome ?? "",
          valor: response?.valor?.toString() ?? "",
        });
      } catch (error) {
        toast.error("Erro ao carregar os dados da tipologia.");
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await TypologyService.update(id!, {
        nome: formData.nome,
        valor: Number(formData.valor),
      });
      toast.success("Tipologia atualizada com sucesso!");
      navigate("/typology-list");
    } catch (error) {
      toast.error("Erro ao atualizar tipologia. Verifique os dados e tente novamente.");
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
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">
              ATUALIZAR TIPOLOGIA
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="text"
                titulo="Nome"
                name="nome"
                value={formData.nome}
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("nome", value)}
              />

              <InputText
                type="number"
                titulo="Valor"
                name="valor"
                value={formData.valor}
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("valor", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/typology-list" />
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

export default TypologyUpdate;
