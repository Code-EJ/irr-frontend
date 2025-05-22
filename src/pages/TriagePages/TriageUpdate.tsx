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

const TriageUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o id da URL
  const [subtypologies, setSubtypologies] = useState<{ name: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    data: "",
    tipo: "TOTAL",
    volumeTotal: "",
    volumeRejeito: "",
    tipoOrigem: "DOACAO",
    tipoDestino: "DOACAO",
    subtipologiaId: "",
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

        // Se não tiver subtipologia selecionada, pega a primeira
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
        const response = await TriageService.get(id!);
        // Ajustar o campo data para ISO string (yyyy-MM-dd)
        const dataISO = response?.data ? new Date(response.data).toISOString().substring(0, 10) : "";

        setFormData({
          data: dataISO,
          tipo: response?.tipo ?? "TOTAL",
          volumeTotal: response?.volumeTotal ? String(response.volumeTotal) : "",
          volumeRejeito: response?.volumeRejeito ? String(response.volumeRejeito) : "",
          tipoOrigem: response?.tipoOrigem ?? "DOACAO",
          tipoDestino: response?.tipoDestino ?? "DOACAO",
          subtipologiaId: response?.subtipologiaId ?? "",
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
        data: new Date(formData.data),
        tipo: formData.tipo as "TOTAL" | "PARCIAL",
        tipoOrigem: formData.tipoOrigem as "DOACAO" | "COLETA",
        tipoDestino: formData.tipoDestino as "DOACAO" | "COLETA",
        volumeTotal: Number(formData.volumeTotal),
        volumeRejeito: Number(formData.volumeRejeito),
        subtipologiaId: formData.subtipologiaId,
      });
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
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">ATUALIZAR TRIAGEM</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="date"
                titulo="Data da triagem"
                name="data"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.data}
                onChange={(value) => handleChange("data", value)}
              />

              <InputList
                titulo="Tipo"
                name="tipo"
                titleStyle="text-black"
                options={tiposTriagem}
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.tipo}
                onChange={(value) => handleChange("tipo", value)}
              />

              <InputText
                type="number"
                titulo="Volume Total (kg ou litros)"
                name="volumeTotal"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.volumeTotal}
                onChange={(value) => handleChange("volumeTotal", value)}
              />

              <InputText
                type="number"
                titulo="Volume de Rejeito (kg ou litros)"
                name="volumeRejeito"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.volumeRejeito}
                onChange={(value) => handleChange("volumeRejeito", value)}
              />

              <InputList
                titulo="Tipo de Origem"
                name="tipoOrigem"
                titleStyle="text-black"
                options={tiposOrigemDestino}
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.tipoOrigem}
                onChange={(value) => handleChange("tipoOrigem", value)}
              />

              <InputList
                titulo="Tipo de Destino"
                name="tipoDestino"
                titleStyle="text-black"
                options={tiposOrigemDestino}
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.tipoDestino}
                onChange={(value) => handleChange("tipoDestino", value)}
              />

              <InputList
                titulo="Subtipologia"
                name="subtipologiaId"
                options={subtypologies}
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.subtipologiaId}
                onChange={(value) => handleChange("subtipologiaId", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"/triage-list"} />
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
