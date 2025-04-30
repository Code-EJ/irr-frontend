import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputList from "../../components/InputList";
import InputText from "../../components/InputText";
import { SubTypologyService, TypologyService } from "../../services"; // Corrigido
import { toast } from "react-toastify";

const SubTypologyUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o id da URL
  const [typologies, setTypologies] = useState<{ name: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    valor: "",
    tipologiaId: "",
  });

  useEffect(() => {
    const fetchTypologies = async () => {
      try {
        const response = await TypologyService.getAll(1, 9999); // Buscar todas as Tipologias
        const tipologias = response?.data ?? [];
        const mapped = tipologias?.map((item: { nome: string; id: string }) => ({
          name: item.nome,
          value: item.id,
        })) ?? [];
        setTypologies(mapped);
      } catch (error) {
        toast.error("Erro ao carregar tipologias.");
        console.error(error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await SubTypologyService.get(id!);
        setFormData({
          id: response?.id ?? "",
          nome: response?.nome ?? "",
          valor: response?.valor ?? "",
          tipologiaId: response?.tipologia?.id ?? "",
        });
      } catch (error) {
        toast.error("Erro ao carregar os dados da subtipologia.");
        console.error(error);
      }
    };

    fetchTypologies();
    fetchData();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await SubTypologyService.update(id!, {
        nome: formData.nome,
        valor: formData.valor,
        tipologiaId: formData.tipologiaId,
      }, { id });
      toast.success("Subtipologia atualizada com sucesso!");
      navigate("/subtypology-list"); // Redireciona para a lista de subtipologias
    } catch (error) {
      toast.error("Erro ao atualizar subtipologia. Verifique os dados e tente novamente.");
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
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">ATUALIZAR SUBTIPOLOGIA</h1>

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
                type="text"
                titulo="Valor"
                name="valor"
                value={formData.valor}
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("valor", value)}
              />

              <InputList
                titulo="Tipologia"
                name="tipologiaId"
                options={typologies}
                value={formData.tipologiaId}
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("tipologiaId", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"subtypology-list"} />
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

export default SubTypologyUpdate;
