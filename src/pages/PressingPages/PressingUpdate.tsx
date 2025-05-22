import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputList from "../../components/InputList";
import InputText from "../../components/InputText";
import { PressingService, SubTypologyService } from "../../services";
import { toast } from "react-toastify";

const PressingUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [subtypologies, setSubtypologies] = useState<{ name: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    data: "",
    volumeTotal: "",
    tipoOrigem: "DOACAO",
    tipoDestino: "DOACAO",
    subtipologiaId: "",
  });

  const tiposOrigemDestino = [
    { name: "DOAÇÃO", value: "DOACAO" },
    { name: "COLETA", value: "COLETA" },
  ];

  useEffect(() => {
    const fetchSubtypologies = async () => {
      try {
        const response = await SubTypologyService.getAll(1, 9999);
        const subtipologias = response?.data ?? [];
        const mapped = subtipologias.map((item: { nome: string; id: string }) => ({
          name: item.nome,
          value: item.id,
        }));
        setSubtypologies(mapped);

        if (mapped.length > 0 && !formData.subtipologiaId) {
          setFormData((prev) => ({
            ...prev,
            subtipologiaId: mapped[0].value,
          }));
        }
      } catch (error) {
        toast.error("Erro ao carregar subtipologias.");
        console.error(error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await PressingService.get(id!);
        setFormData({
          data: response?.data ? new Date(response.data).toISOString().split("T")[0] : "",
          volumeTotal: response?.volumeTotal ? String(response.volumeTotal) : "",
          tipoOrigem: response?.tipoOrigem ?? "DOACAO",
          tipoDestino: response?.tipoDestino ?? "DOACAO",
          subtipologiaId: response?.subtipologiaId ?? "",
        });
      } catch (error) {
        toast.error("Erro ao carregar os dados da prensagem.");
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
      await PressingService.update(id!, {
        ...formData,
        data: new Date(formData.data),
        volumeTotal: Number(formData.volumeTotal),
        tipoOrigem: formData.tipoOrigem as "DOACAO" | "COLETA",
        tipoDestino: formData.tipoDestino as "DOACAO" | "COLETA",
      });

      toast.success("Prensagem atualizada com sucesso!");
      navigate("/pressing-list");
    } catch (error) {
      toast.error("Erro ao atualizar prensagem. Verifique os dados e tente novamente.");
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
        {() => (
          <Card>
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">ATUALIZAR PRENSAGEM</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="date"
                titulo="Data da prensagem"
                name="data"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("data", value)}
                value={formData.data}
              />

              <InputText
                type="number"
                titulo="Volume Total (kg ou litros)"
                name="volumeTotal"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("volumeTotal", value)}
                value={formData.volumeTotal}
              />

              <InputList
                titulo="Tipo de Origem"
                name="tipoOrigem"
                titleStyle="text-black"
                options={tiposOrigemDestino}
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("tipoOrigem", value)}
                value={formData.tipoOrigem}
              />

              <InputList
                titulo="Tipo de Destino"
                name="tipoDestino"
                titleStyle="text-black"
                options={tiposOrigemDestino}
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("tipoDestino", value)}
                value={formData.tipoDestino}
              />

              <InputList
                titulo="Subtipologia"
                name="subtipologiaId"
                options={subtypologies}
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("subtipologiaId", value)}
                value={formData.subtipologiaId}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"pressing-list"} />
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

export default PressingUpdate;
