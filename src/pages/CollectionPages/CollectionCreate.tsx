import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import { toast } from "react-toastify";
import InputList from "../../components/InputList";
import { CollectionService, VehicleService, DriverService, DocumentService } from "../../services";

const CollectionCreate = () => {
  const navigate = useNavigate();
  const [veiculos, setVeiculo] = useState<{ name: any; value: any }[]>([]);
  const [motoristas, setMotorista] = useState<{ name: string; value: string }[]>([]);
  const [documentos, setDocumento] = useState<{ name: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    dataRealizacao: "",
    dataChegada: "",
    dataSaida: "",
    pesagem: "",
    quilometragem: "",
    veiculoId: "",
    motoristaId: "",
    mtrGeradorId: "",
    mtrDestinadorId: "",
    mtrTransportadorId: "",
    diarioColetaId: ""
  });

  useEffect(() => {
    const fetchVeiculo = async () => {
      try {
        const response = await VehicleService.getAll(1, 9999);
        const veiculo = response?.data ?? [];
        const mapped = veiculo?.map((item: any) => ({
          name: item.placa,
          value: item.id,
        })) ?? [];
        setVeiculo(mapped);
        if (mapped.length > 0 && !formData.veiculoId) {
          setFormData((prev) => ({
            ...prev,
            veiculoId: mapped[0].value,
          }));
        }
      } catch (error) {
        toast.error("Erro ao carregar notas fiscais.");
        console.error(error);
      }
    };
    const fetchMotorista = async () => {
      try {
        const response = await DriverService.getAll(1, 9999);
        const motorista = response?.data ?? [];
        const mapped = motorista?.map((item: any) => ({
          name: item.numero ?? item.nome ?? item.id,
          value: item.id,
        })) ?? [];
        setMotorista(mapped);
        if (mapped.length > 0 && !formData.motoristaId) {
          setFormData((prev) => ({
            ...prev,
            motoristaId: mapped[0].value,
          }));
        }
      } catch (error) {
        toast.error("Erro ao carregar notas fiscais.");
        console.error(error);
      }
    };
    const fetchDocumento = async () => {
      try {
        const response = await DocumentService.getAll(1, 9999);
        const documento = response?.data ?? [];
        const mapped = documento?.map((item: any) => ({
          name: item.numero ?? item.nome ?? item.id,
          value: item.id,
        })) ?? [];
        setDocumento(mapped);
        if (mapped.length > 0 && !formData.mtrGeradorId || !formData.mtrDestinadorId || !formData.mtrTransportadorId || !formData.diarioColetaId) {
          setFormData((prev) => ({
            ...prev,
            mtrGeradorId: mapped[0].value,
            mtrDestinadorId: mapped[0].value,
            mtrTransportadorId: mapped[0].value,
            diarioColetaId: mapped[0].value,
          }));
        }
      } catch (error) {
        toast.error("Erro ao carregar notas fiscais.");
        console.error(error);
      }
    };
    fetchVeiculo();
    fetchMotorista();
    fetchDocumento();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await CollectionService.create({
        ...formData,
        pesagem: Number(formData.pesagem),
        quilometragem: Number(formData.quilometragem),
        mtrGeradorId: formData.mtrGeradorId,
        mtrDestinadorId: formData.mtrDestinadorId,
        mtrTransportadorId: formData.mtrTransportadorId,
        diarioColetaId: formData.diarioColetaId,
        motoristaId: formData.motoristaId,
        veiculoId: formData.veiculoId,
      });
      toast.success("Coleta criada com sucesso!");
      navigate("/collection-list");
    } catch (error) {
      toast.error("Erro ao criar coleta. Verifique os dados e tente novamente.");
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
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">NOVA COLETA</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              
              <InputText
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titulo="Data de Realização" 
                name="dataRealizacao" 
                type="date" 
                onChange={(value) => handleChange("dataRealizacao", value)} />
              
              <InputText
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titulo="Data de Chegada" 
                name="dataChegada" 
                type="date" 
                onChange={(value) => handleChange("dataChegada", value)} />
              
              <InputText
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titulo="Data de Saída" 
                name="dataSaida" 
                type="date" 
                onChange={(value) => handleChange("dataSaida", value)} />
              
              <InputText
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                titulo="Pesagem (kg)" 
                name="pesagem" 
                type="number" 
                onChange={(value) => handleChange("pesagem", value)} />
              
              <InputText 
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titulo="Quilometragem (km)" 
                name="quilometragem" 
                type="number" 
                onChange={(value) => handleChange("quilometragem", value)} />

              <InputList 
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black" 
                titulo="Placa do Veículo" 
                name="veiculo" 
                options={veiculos}
                value={formData.veiculoId}
                onChange={(value) => handleChange("veiculoId", value)} />
              
              <InputList 
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black" 
                titulo="Motorista" 
                name="motorista" 
                options={motoristas} 
                value={formData.motoristaId}
                onChange={(value) => handleChange("motoristaId", value)} />
              
              <InputList
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black" 
                titulo="MTR Gerador" 
                name="mtrGeradorId" 
                options={documentos} 
                value={formData.mtrGeradorId}
                onChange={(value) => handleChange("mtrGeradorId", value)} />
              
              <InputList
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black" 
                titulo="MTR Destinador" 
                name="mtrDestinadorId" 
                options={documentos} 
                value={formData.mtrDestinadorId}
                onChange={(value) => handleChange("mtrDestinadorId", value)} />
              
              <InputList
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black" 
                titulo="MTR Transportador" 
                name="mtrTransportadorId" 
                options={documentos} 
                value={formData.mtrTransportadorId}
                onChange={(value) => handleChange("mtrTransportadorId", value)} />
              
              <InputList
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black" 
                titulo="Diário de Coleta" 
                name="diarioColetaId" 
                options={documentos} 
                value={formData.diarioColetaId}
                onChange={(value) => handleChange("diarioColetaId", value)} />

            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/collection-list" />
              <Button 
                titulo="Criar" 
                type="button" variant="primary" className="bg-green-950 text-white text-sm" onClick={handleSubmit} />
            </div>
          </Card>
        )}
      </SimpleForm>
    </Card>
  );
};

export default CollectionCreate;
