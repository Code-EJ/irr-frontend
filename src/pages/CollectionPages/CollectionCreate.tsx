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
  const [veiculos, setVeiculos] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [documentos, setDocumentos] = useState([]);

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
    const fetchData = async () => {
      try {
        const [veiculosRes, motoristasRes, documentosRes] = await Promise.all([
          VehicleService.getAll(1, 9999),
          DriverService.getAll(1, 9999),
          DocumentService.getAll(1, 9999),
        ]);
        setVeiculos(veiculosRes.data);
        setMotoristas(motoristasRes.data);
        setDocumentos(documentosRes.data);
      } catch (error) {
        toast.error("Erro ao carregar dados.");
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await CollectionService.create({
        ...formData,
        pesagem: Number(formData.pesagem),
        quilometragem: Number(formData.quilometragem),
      });
      toast.success("Coleta criada com sucesso!");
      navigate("/collection-list");
    } catch (error) {
      toast.error("Erro ao criar coleta. Verifique os dados e tente novamente.");
      console.error(error);
    }
  };

  const mapToOptions = (list, labelKey = "nome", valueKey = "id") =>
    list.map(item => ({ name: item[labelKey], value: item[valueKey] }));

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
              <InputText titulo="Data de Realização" name="dataRealizacao" type="date" onChange={(value) => handleChange("dataRealizacao", value)} />
              <InputText titulo="Data de Chegada" name="dataChegada" type="date" onChange={(value) => handleChange("dataChegada", value)} />
              <InputText titulo="Data de Saída" name="dataSaida" type="date" onChange={(value) => handleChange("dataSaida", value)} />
              <InputText titulo="Pesagem (kg)" name="pesagem" type="number" onChange={(value) => handleChange("pesagem", value)} />
              <InputText titulo="Quilometragem (km)" name="quilometragem" type="number" onChange={(value) => handleChange("quilometragem", value)} />

              <InputList titulo="Veículo" name="veiculoId" options={mapToOptions(veiculos)} onChange={(value) => handleChange("veiculoId", value)} />
              <InputList titulo="Motorista" name="motoristaId" options={mapToOptions(motoristas)} onChange={(value) => handleChange("motoristaId", value)} />
              <InputList titulo="MTR Gerador" name="mtrGeradorId" options={mapToOptions(documentos)} onChange={(value) => handleChange("mtrGeradorId", value)} />
              <InputList titulo="MTR Destinador" name="mtrDestinadorId" options={mapToOptions(documentos)} onChange={(value) => handleChange("mtrDestinadorId", value)} />
              <InputList titulo="MTR Transportador" name="mtrTransportadorId" options={mapToOptions(documentos)} onChange={(value) => handleChange("mtrTransportadorId", value)} />
              <InputList titulo="Diário de Coleta" name="diarioColetaId" options={mapToOptions(documentos)} onChange={(value) => handleChange("diarioColetaId", value)} />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/collection-list" />
              <Button titulo="Criar" type="button" variant="primary" className="bg-green-950 text-white text-sm" onClick={handleSubmit} />
            </div>
          </Card>
        )}
      </SimpleForm>
    </Card>
  );
};

export default CollectionCreate;
