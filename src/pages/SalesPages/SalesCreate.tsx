import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import { SaleService } from "../../services"; // Update service import
import { toast } from "react-toastify";

const SalesCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    comprador: "",
    data: "",
    valor: "",
    notaFiscalId: "",
    mtrGeradorId: "",
    mtrTransportadorId: "",
    mtrDestinadorId: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await SaleService.create({
        comprador: formData.comprador,
        data: new Date(formData.data),
        valor: parseFloat(formData.valor),
        notaFiscalId: formData.notaFiscalId,
        mtrGeradorId: formData.mtrGeradorId,
        mtrTransportadorId: formData.mtrTransportadorId,
        mtrDestinadorId: formData.mtrDestinadorId,
      });
      toast.success("Venda criada com sucesso!");
      navigate("/sales-list");  // Navigate to sales list page after creation
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
        {(formik) => (
          <Card>
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">CRIAR VENDA</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="text"
                titulo="Comprador"
                name="comprador"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("comprador", value)}
              />
              
              <InputDate
                titulo="Data"
                name="data"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("data", value)}
              />
              
              <InputText
                type="number"
                titulo="Valor"
                name="valor"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("valor", value)}
              />
              
              <InputText
                type="text"
                titulo="Nota Fiscal ID"
                name="notaFiscalId"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("notaFiscalId", value)}
              />
              
              <InputText
                type="text"
                titulo="MTR Gerador ID"
                name="mtrGeradorId"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("mtrGeradorId", value)}
              />
              
              <InputText
                type="text"
                titulo="MTR Transportador ID"
                name="mtrTransportadorId"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("mtrTransportadorId", value)}
              />
              
              <InputText
                type="text"
                titulo="MTR Destinador ID"
                name="mtrDestinadorId"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("mtrDestinadorId", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"sales-list"} />
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
