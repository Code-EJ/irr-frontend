import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputList from "../../components/InputList";
import InputText from "../../components/InputText";
import { TriageService, SubTypologyService } from "../../services";
import { toast } from "react-toastify";

const TriageDriversUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o id da URL
  const [subtypologies, setSubtypologies] = useState<{ name: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    cpf: "",
  });

  const tiposTriagem = [
    { name: "TOTAL", value: "TOTAL" },
    { name: "PARCIAL", value: "PARCIAL" },
  ];

  const tiposOrigemDestino = [
    { name: "DOAÇÃO", value: "DOACAO" },
    { name: "COLETA", value: "COLETA" },
  ];

  useEffect(() => {
    const fetchSubtypologies = async () => {
      try {
        const response = await SubTypologyService.getAll(1, 9999);
        const subtipologias = response?.data ?? [];
        const mapped = subtipologias?.map((item: { nome: string; id: string }) => ({
          name: item.nome,
          value: item.id,
        })) ?? [];
        setSubtypologies(mapped);
      } catch (error) {
        toast.error("Erro ao carregar subtipologias.");
        console.error(error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await TriageService.get(id!); // Busca os dados da triagem pelo ID
        setFormData({
          id: response?.id ? new Date(response.id).toISOString() : "",
          nome: response?.nome ?? "",
          cpf: response?.cpf ? String(response.cpf) : "",
        });
      } catch (error) {
        toast.error("Erro ao carregar os dados da triagem.");
        console.error(error);
      }
    };

    fetchSubtypologies();
    fetchData();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await TriageService.update(id!, { 
        ...formData,
        id: new Date(formData.id),
        nome: formData.nome as "TOTAL" | "PARCIAL",
        cpf: formData.cpf as "DOACAO" | "COLETA",
      }, { id });
      toast.success("Triagem atualizada com sucesso!");
      navigate("/triage-list");
    } catch (error) {
      toast.error("Erro ao atualizar triagem. Verifique os dados e tente novamente.");
      console.error(error);
    }
  };

  return (
    <Card className="rounded-[50px] shadow-lg d-flex flex-col w-3/4 max-w-4x1 mx-auto p-4">
      <SimpleForm
        initialValues={formData}
        onSubmit={handleSubmit}
        autoSetErrors={true}
        submitOnChange={false}
      >
        {(formik) => (
          <Card>
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">ATUALIZAR TRIAGEM DE MOSTORISTA</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="id"
                titulo="id do motorista"
                name="id"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("id", value)}
              />

              <InputList
                titulo="nome"
                name="nome"
                titleStyle="text-black"
                options={tiposTriagem}
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("nome", value)}
              />

              <InputText
                type="cpf"
                titulo="cpf do motorista"
                name="cpf"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("cpf", value)}
              />

            <div className="flex justify-between mt-8">
              <BackButton path={"triage-list"} />
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

export default TriageUpdate;
