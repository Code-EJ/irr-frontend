import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const SalesUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    const fetchAll = async () => {
      try {
        const response = await DocumentService.getAll(1, 9999);
        const data = response?.data ?? [];
        const documentosFiltrados = data.filter((doc) => tiposDocumento.includes(doc.tipo));

        const mapOptions = (docs: import("../../models/Entities").Document[]) =>
          docs.map((item) => ({
            name: item.numero ?? item.nome ?? item.id,
            value: item.id,
          }));

        const notas = mapOptions(documentosFiltrados.filter(doc => doc.tipo === "NOTA_FISCAL"));
        const geradores = mapOptions(documentosFiltrados.filter(doc => doc.tipo === "MTR_GERADOR"));
        const transportadores = mapOptions(documentosFiltrados.filter(doc => doc.tipo === "MTR_TRANSPORTADOR"));
        const destinadores = mapOptions(documentosFiltrados.filter(doc => doc.tipo === "MTR_DESTINADOR"));

        setDocumentos(documentosFiltrados);
        setNotaFiscais(notas);
        setMtrGeradores(geradores);
        setMtrTransportadores(transportadores);
        setMtrDestinadores(destinadores);

        if (id) {
          const sale = await SaleService.get(id);
          if (!sale) throw new Error("Venda não encontrada");

          setFormData({
            comprador: sale.comprador ?? "",
            data: sale.data ? new Date(sale.data).toISOString().substring(0, 10) : "",
            valor: sale.valor?.toString() ?? "",
            notaFiscalId: sale.notaFiscalId || (notas.length > 0 ? notas[0].value : ""),
            mtrGeradorId: sale.mtrGeradorId || (geradores.length > 0 ? geradores[0].value : ""),
            mtrTransportadorId: sale.mtrTransportadorId || (transportadores.length > 0 ? transportadores[0].value : ""),
            mtrDestinadorId: sale.mtrDestinadorId || (destinadores.length > 0 ? destinadores[0].value : ""),
          });
        } else {
          setFormData(prev => ({
            ...prev,
            notaFiscalId: notas.length > 0 ? notas[0].value : "",
            mtrGeradorId: geradores.length > 0 ? geradores[0].value : "",
            mtrTransportadorId: transportadores.length > 0 ? transportadores[0].value : "",
            mtrDestinadorId: destinadores.length > 0 ? destinadores[0].value : "",
          }));
        }
      } catch (error) {
        toast.error("Erro ao carregar documentos ou dados da venda.");
        console.error(error);
      }
    };

    fetchAll();
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log("Dados para envio:", formData);
    try {
      await SaleService.update(id!, {
        comprador: formData.comprador,
        data: new Date(formData.data).toISOString(),
        valor: parseFloat(formData.valor),
        notaFiscalId: formData.notaFiscalId,
        mtrGeradorId: formData.mtrGeradorId,
        mtrTransportadorId: formData.mtrTransportadorId,
        mtrDestinadorId: formData.mtrDestinadorId,
      });
      toast.success("Venda atualizada com sucesso!");
      navigate("/sales-list");
    } catch (error) {
      toast.error("Erro ao atualizar venda. Verifique os dados e tente novamente.");
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
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">ATUALIZAR VENDA</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="text"
                titulo="Comprador"
                name="comprador"
                titleStyle="text-black"
                className="h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.comprador}
                onChange={value => handleChange("comprador", value)}
              />

              <InputText
                type="date"
                titulo="Data"
                name="data"
                className="h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.data}
                onChange={value => handleChange("data", value)}
              />

              <InputText
                type="number"
                titulo="Valor"
                name="valor"
                titleStyle="text-black"
                className="h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.valor}
                onChange={value => handleChange("valor", value)}
              />

              <InputList
                titulo="Nota Fiscal"
                name="notaFiscalId"
                options={notaFiscais}
                value={formData.notaFiscalId}
                onChange={value => handleChange("notaFiscalId", value)}
                className="h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black"
              />

              <InputList
                titulo="MTR Gerador"
                name="mtrGeradorId"
                options={mtrGeradores}
                value={formData.mtrGeradorId}
                onChange={value => handleChange("mtrGeradorId", value)}
                className="h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black"
              />

              <InputList
                titulo="MTR Transportador"
                name="mtrTransportadorId"
                options={mtrTransportadores}
                value={formData.mtrTransportadorId}
                onChange={value => handleChange("mtrTransportadorId", value)}
                className="h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black"
              />

              <InputList
                titulo="MTR Destinador"
                name="mtrDestinadorId"
                options={mtrDestinadores}
                value={formData.mtrDestinadorId}
                onChange={value => handleChange("mtrDestinadorId", value)}
                className="h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black"
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/sales-list" />
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

export default SalesUpdate;
