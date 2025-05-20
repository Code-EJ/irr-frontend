import { useEffect, useState } from "react";  
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputList from "../../components/InputList";
import InputText from "../../components/InputText";
import { OutputMaterialService, SubTypologyService, DocumentService } from "../../services";
import { toast } from "react-toastify";

const OutputMaterialCreate = () => {
  const navigate = useNavigate();
  const [subtypologies, setSubtypologies] = useState<{ name: string; value: string }[]>([]);
  const [notaFiscais, setNotaFiscais] = useState<{ name: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    quantidade: "",
    notaFiscalId: "",
    subtipologiaId: "",
  });

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

    const fetchNotaFiscais = async () => {
      try {
        const response = await DocumentService.getAll(1, 9999); 
        const notaFiscais = response?.data ?? [];
        const mapped = notaFiscais?.map((item: any) => ({
          name: item.numero ?? item.nome ?? item.id,
          value: item.id,
        })) ?? [];
        setNotaFiscais(mapped);
        if (mapped.length > 0 && !formData.notaFiscalId) {
          setFormData((prev) => ({
            ...prev,
            notaFiscalId: mapped[0].value,
          }));
        }
      } catch (error) {
        toast.error("Erro ao carregar notas fiscais.");
        console.error(error);
      }
    };
    fetchSubtypologies();
    fetchNotaFiscais();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await OutputMaterialService.create({
        ...formData,
        quantidade: Number(formData.quantidade),
        notaFiscalId: formData.notaFiscalId,
        subtipologiaId: formData.subtipologiaId,
      });
      toast.success("Material de saída criado com sucesso!");
      navigate("/output-material-list");
    } catch (error) {
      toast.error("Erro ao criar material de saída. Verifique os dados e tente novamente.");
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
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">MATERIAL DE SAÍDA</h1>

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
                titulo="Nota Fiscal"
                name="notaFiscalId"
                titleStyle="text-black"
                options={notaFiscais}
                value={formData.notaFiscalId}
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("notaFiscalId", value)}
              />

              <InputList
                titulo="Subtipologia"
                name="subtipologiaId"
                options={subtypologies}
                titleStyle="text-black"
                value={formData.subtipologiaId}
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("subtipologiaId", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"/output-material-list"} />
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

export default OutputMaterialCreate;
