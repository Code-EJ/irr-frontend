import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputList from "../../components/InputList";
import InputText from "../../components/InputText";
import { TriageService, SubTypologyService } from "../../services";
import { toast } from "react-toastify";

const TriageCreate = () => {
  const navigate = useNavigate();
  const [subtypologies, setSubtypologies] = useState<{ name: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    data: "",
    tipo: "",
    volumeTotal: "",
    volumeRejeito: "",
    tipoOrigem: "",
    tipoDestino: "",
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
      } catch (error) {
        toast.error("Erro ao carregar subtipologias.");
        console.error(error);
      }
    };
    fetchSubtypologies();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await TriageService.create({
        ...formData,
        data: new Date(formData.data),
        tipo: formData.tipo as "TOTAL" | "PARCIAL",
        tipoOrigem: formData.tipoOrigem as "DOACAO" | "COLETA",
        tipoDestino: formData.tipoDestino as "DOACAO" | "COLETA",
        volumeTotal: Number(formData.volumeTotal),
        volumeRejeito: Number(formData.volumeRejeito),
      });
      toast.success("Triagem criada com sucesso!");
      navigate("/triage-list");
    } catch (error) {
      toast.error("Erro ao criar triagem. Verifique os dados e tente novamente.");
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
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">TRIAGEM</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="date"
                titulo="Data da triagem"
                name="data"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("data", value)}
              />

              <InputList
                titulo="Tipo"
                name="tipo"
                titleStyle="text-black"
                options={tiposTriagem}
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("tipo", value)}
              />

              <InputText
                type="number"
                titulo="Volume Total (kg ou litros)"
                name="volumeTotal"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("volumeTotal", value)}
              />

              <InputText
                type="number"
                titulo="Volume de Rejeito (kg ou litros)"
                name="volumeRejeito"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("volumeRejeito", value)}
              />

              <InputList
                titulo="Tipo de Origem"
                name="tipoOrigem"
                titleStyle="text-black"
                options={tiposOrigemDestino}
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("tipoOrigem", value)}
              />

              <InputList
                titulo="Tipo de Destino"
                name="tipoDestino"
                titleStyle="text-black"
                options={tiposOrigemDestino}
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("tipoDestino", value)}
              />

              <InputList
                titulo="Subtipologia"
                name="subtipologiaId"
                options={subtypologies}
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("subtipologiaId", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"triage-list"} />
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

export default TriageCreate;
