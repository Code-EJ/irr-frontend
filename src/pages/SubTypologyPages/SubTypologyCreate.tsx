import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputList from "../../components/InputList";
import InputText from "../../components/InputText";
import { SubTypologyService, TypologyService } from "../../services";
import { toast } from "react-toastify";

const SubTypologyCreate = () => {
  const navigate = useNavigate();
  const [typologies, setTypologies] = useState<{ name: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    nome: "",
    valor: "",
    tipologiaId: "",
  });

  useEffect(() => {
    const fetchTypologies = async () => {
      try {
        const response = await TypologyService.getAll(1, 9999);
        const tipologias = response?.data ?? [];
        const mapped = tipologias?.map((item: { nome: string; id: string }) => ({
          name: item.nome,
          value: item.id,
        })) ?? [];
        setTypologies(mapped);
        if (mapped.length > 0 && !formData.tipologiaId) {
          setFormData((prev) => ({
            ...prev,
            tipologiaId: mapped[0].value,
          }));
        }
      } catch (error) {
        toast.error("Erro ao carregar tipologias.");
        console.error(error);
      }
    };
    fetchTypologies();
  }, [formData.tipologiaId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await SubTypologyService.create({
        ...formData,
        valor: Number(formData.valor),
      });
      toast.success("Subtipologia criada com sucesso!");
      navigate("/subtypology-list");
    } catch (error) {
      toast.error("Erro ao criar subtipologia. Verifique os dados e tente novamente.");
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
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">Cadastrar Subtipologia</h1>

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
                type="number"
                titulo="Valor"
                name="valor"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("valor", value)}
              />

              <InputList
                titulo="Tipologia"
                name="tipologiaId"
                titleStyle="text-black"
                options={typologies}
                value={formData.tipologiaId} 
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("tipologiaId", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"/subtypology-list"} />
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

export default SubTypologyCreate;
