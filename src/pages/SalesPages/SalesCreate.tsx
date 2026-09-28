import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import InputList from "../../components/InputList";
import { toast } from "react-toastify";
import { SaleService, DocumentService } from "../../services";

const tiposDocumento = [
  "NOTA_FISCAL",
  "MTR_GERADOR",
  "MTR_TRANSPORTADOR",
  "MTR_DESTINADOR",
  "DIARIO_COLETA",
];

const SalesCreate = () => {
  const navigate = useNavigate();

  const [, setDocumentos] = useState<import("../../models/Entities").Document[]>([]);

  const [notaFiscais, setNotaFiscais] = useState<{ name: string; value: string }[]>([]);
  const [mtrGeradores, setMtrGeradores] = useState<{ name: string; value: string }[]>([]);
  const [mtrTransportadores, setMtrTransportadores] = useState<{ name: string; value: string }[]>([]);
  const [mtrDestinadores, setMtrDestinadores] = useState<{ name: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    comprador: "",
    data: "",
    valor: "",
    notaFiscalId: "",
    mtrGeradorId: "",
    mtrTransportadorId: "",
    mtrDestinadorId: "",
  });

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const response = await DocumentService.getAll(1, 9999);
        const data = response?.data ?? [];

        const documentosFiltrados = data.filter((doc) => tiposDocumento.includes(doc.tipo));

        setDocumentos(documentosFiltrados);

        const mapOptions = (docs: import("../../models/Entities").Document[]) =>
          docs.map((item) => ({
            name: item.numero ?? item.nome ?? item.id,
            value: item.id,
          }));

        const filteredNotaFiscais = documentosFiltrados.filter(doc => doc.tipo === "NOTA_FISCAL");
        const filteredMtrGeradores = documentosFiltrados.filter(doc => doc.tipo === "MTR_GERADOR");
        const filteredMtrTransportadores = documentosFiltrados.filter(doc => doc.tipo === "MTR_TRANSPORTADOR");
        const filteredMtrDestinadores = documentosFiltrados.filter(doc => doc.tipo === "MTR_DESTINADOR");

        setNotaFiscais(mapOptions(filteredNotaFiscais));
        setMtrGeradores(mapOptions(filteredMtrGeradores));
        setMtrTransportadores(mapOptions(filteredMtrTransportadores));
        setMtrDestinadores(mapOptions(filteredMtrDestinadores));

        setFormData((prev) => ({
          ...prev,
          notaFiscalId: prev.notaFiscalId || (filteredNotaFiscais[0]?.id ?? ""),
          mtrGeradorId: prev.mtrGeradorId || (filteredMtrGeradores[0]?.id ?? ""),
          mtrTransportadorId: prev.mtrTransportadorId || (filteredMtrTransportadores[0]?.id ?? ""),
          mtrDestinadorId: prev.mtrDestinadorId || (filteredMtrDestinadores[0]?.id ?? ""),
        }));

      } catch (error) {
        toast.error("Erro ao carregar documentos.");
        console.error(error);
      }
    };

    fetchDocumentos();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await SaleService.create({
        comprador: formData.comprador,
        data: new Date(formData.data).toISOString(),
        valor: parseFloat(formData.valor),
        notaFiscalId: formData.notaFiscalId,
        mtrGeradorId: formData.mtrGeradorId,
        mtrTransportadorId: formData.mtrTransportadorId,
        mtrDestinadorId: formData.mtrDestinadorId,
      });
      toast.success("Venda criada com sucesso!");
      navigate("/sales-list");
    } catch (error) {
      toast.error("Erro ao criar venda. Verifique os dados e tente novamente.");
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
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">CRIAR VENDA</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="text"
                titulo="Comprador"
                name="comprador"
                titleStyle="text-black"
                className="h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("comprador", value)}
              />

              <InputText
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titulo="Data"
                name="data"
                type="date"
                onChange={(value) => handleChange("data", value)}
              />

              <InputText
                type="number"
                titulo="Valor"
                name="valor"
                titleStyle="text-black"
                className="h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("valor", value)}
              />

              <InputList
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titulo="Nota Fiscal"
                name="notaFiscalId"
                options={notaFiscais}
                value={formData.notaFiscalId}
                onChange={(value) => handleChange("notaFiscalId", value)}
              />

              <InputList
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titulo="MTR Gerador"
                name="mtrGeradorId"
                options={mtrGeradores}
                value={formData.mtrGeradorId}
                onChange={(value) => handleChange("mtrGeradorId", value)}
              />

              <InputList
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titulo="MTR Transportador"
                name="mtrTransportadorId"
                options={mtrTransportadores}
                value={formData.mtrTransportadorId}
                onChange={(value) => handleChange("mtrTransportadorId", value)}
              />

              <InputList
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titulo="MTR Destinador"
                name="mtrDestinadorId"
                options={mtrDestinadores}
                value={formData.mtrDestinadorId}
                onChange={(value) => handleChange("mtrDestinadorId", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"/sales-list"} />
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

export default SalesCreate;
