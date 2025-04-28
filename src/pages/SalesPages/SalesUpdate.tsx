import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import { SaleService } from "../../services"; // Atualizar o serviço para Sales
import { toast } from "react-toastify";

const SalesUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    const fetchData = async () => {
      try {
        const response = await SaleService.get(id!); // Usar SalesService
        setFormData({
          comprador: response?.comprador ?? "",
          data: response?.data instanceof Date ? response.data.toISOString() : response?.data ?? "",
          valor: typeof response?.valor === "number" ? response.valor.toString() : response?.valor ?? "",
          notaFiscalId: response?.notaFiscalId ?? "",
          mtrGeradorId: response?.mtrGeradorId ?? "",
          mtrTransportadorId: response?.mtrTransportadorId ?? "",
          mtrDestinadorId: response?.mtrDestinadorId ?? "",
        });
      } catch (error) {
        toast.error("Erro ao carregar os dados da venda.");
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await SaleService.update(id!, {
        comprador: formData.comprador,
        data: formData.data,
        valor: formData.valor,
        notaFiscalId: formData.notaFiscalId,
        mtrGeradorId: formData.mtrGeradorId,
        mtrTransportadorId: formData.mtrTransportadorId,
        mtrDestinadorId: formData.mtrDestinadorId,
      });
      toast.success("Venda atualizada com sucesso!");
      navigate("/sales-list");  // Redirecionar para a lista de vendas após atualização
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
        {(formik) => (
          <Card>
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">ATUALIZAR VENDA</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="text"
                titulo="Comprador"
                name="comprador"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.comprador}
                onChange={(value) => handleChange("comprador", value)}
              />
              
              <InputDate
                titulo="Data"
                name="data"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.data}
                onChange={(value) => handleChange("data", value)}
              />
              
              <InputText
                type="number"
                titulo="Valor"
                name="valor"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.valor}
                onChange={(value) => handleChange("valor", value)}
              />
              
              <InputText
                type="text"
                titulo="Nota Fiscal ID"
                name="notaFiscalId"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.notaFiscalId}
                onChange={(value) => handleChange("notaFiscalId", value)}
              />
              
              <InputText
                type="text"
                titulo="MTR Gerador ID"
                name="mtrGeradorId"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.mtrGeradorId}
                onChange={(value) => handleChange("mtrGeradorId", value)}
              />
              
              <InputText
                type="text"
                titulo="MTR Transportador ID"
                name="mtrTransportadorId"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.mtrTransportadorId}
                onChange={(value) => handleChange("mtrTransportadorId", value)}
              />
              
              <InputText
                type="text"
                titulo="MTR Destinador ID"
                name="mtrDestinadorId"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.mtrDestinadorId}
                onChange={(value) => handleChange("mtrDestinadorId", value)}
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
