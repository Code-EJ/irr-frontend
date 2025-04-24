import { useEffect, useState } from "react"; 
import { useNavigate, useParams } from "react-router-dom"; 
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputList from "../../components/InputList";
import InputText from "../../components/InputText";
import { InputMaterialService, SubTypologyService } from "../../services";
import { toast } from "react-toastify";

const InputMaterialUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o id da URL
  const [subtipologies, setSubtypologies] = useState<{ name: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    quantidade: "",
    tipo: "",
    subtipologiaId: "",
  });

  const tiposMaterial = [
    { name: "TIPO 1", value: "TIPO_1" },
    { name: "TIPO 2", value: "TIPO_2" },
    // Adicione mais tipos conforme necessário
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
        const response = await InputMaterialService.get(id!); // Busca os dados de MaterialEntrada pelo ID
        setFormData({
          quantidade: response?.quantidade ? String(response.quantidade) : "",
          tipo: response?.tipo ?? "",
          subtipologiaId: response?.subtipologiaId ?? "",
        });
      } catch (error) {
        toast.error("Erro ao carregar os dados do material de entrada.");
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
      await InputMaterialService.update(id!, { 
        ...formData,
        data: new Date(), // Assuming current date for 'data'
        tipo: formData.tipo as "TOTAL" | "PARCIAL", // Adjust as needed
        tipoOrigem: "DOACAO", // Replace with appropriate value
        tipoDestino: "COLETA", // Replace with appropriate value
        volumeTotal: Number(formData.quantidade),
        volumeRejeito: 0, // Replace with appropriate value
      }, { id });
      toast.success("Material de entrada atualizado com sucesso!");
      navigate("/input-material-list");
    } catch (error) {
      toast.error("Erro ao atualizar material de entrada. Verifique os dados e tente novamente.");
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
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">ATUALIZAR MATERIAL DE ENTRADA</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="number"
                titulo="Quantidade"
                name="quantidade"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("quantidade", value)}
              />

              <InputList
                titulo="Tipo"
                name="tipo"
                titleStyle="text-black"
                options={tiposMaterial}
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("tipo", value)}
              />

              <InputList
                titulo="Subtipologia"
                name="subtipologiaId"
                options={subtipologies}
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("subtipologiaId", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"material-entrada-list"} />
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

export default InputMaterialUpdate;
