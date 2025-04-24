import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import InputList from "../../components/InputList";
import { CollectionService, VehicleService, DriverService, DocumentoService } from "../../services";
import { toast } from "react-toastify";

const ColetaUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    diarioColetaId: "",
  });

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [veic, mot, docs] = await Promise.all([
          VehicleService.getAll(1, 9999),
          DriverService.getAll(1, 9999),
          DocumentoService.getAll(1, 9999),
        ]);
        setVeiculos(veic.data.map((v) => ({ name: v.placa, value: v.id })));
        setMotoristas(mot.data.map((m) => ({ name: m.nome, value: m.id })));
        setDocumentos(docs.data.map((d) => ({ name: d.nome, value: d.id })));
      } catch (err) {
        toast.error("Erro ao carregar dados de seleção.");
        console.error(err);
      }
    };

    const fetchData = async () => {
      try {
        const response = await CollectionService.get(id!);
        setFormData({
          dataRealizacao: response.dataRealizacao,
          dataChegada: response.dataChegada,
          dataSaida: response.dataSaida,
          pesagem: response.pesagem,
          quilometragem: response.quilometragem,
          veiculoId: response.veiculoId,
          motoristaId: response.motoristaId,
          mtrGeradorId: response.mtrGeradorId,
          mtrDestinadorId: response.mtrDestinadorId,
          mtrTransportadorId: response.mtrTransportadorId,
          diarioColetaId: response.diarioColetaId,
        });
      } catch (error) {
        toast.error("Erro ao carregar dados da coleta.");
        console.error(error);
      }
    };

    fetchSelectData();
    fetchData();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await CollectionService.update(id!, formData, { id });
      toast.success("Coleta atualizada com sucesso!");
      navigate("/colllection-list");
    } catch (error) {
      toast.error("Erro ao atualizar coleta.");
      console.error(error);
    }
  };

  return (
    <Card className="rounded-[50px] shadow-lg d-flex flex-col w-3/4 max-w-4x1 mx-auto p-4">
      <SimpleForm initialValues={formData} onSubmit={handleSubmit}>
        {() => (
          <>
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">ATUALIZAR COLETA</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputText type="date" titulo="Data de Realização" name="dataRealizacao" onChange={(v) => handleChange("dataRealizacao", v)} />
              <InputText type="datetime-local" titulo="Data de Chegada" name="dataChegada" onChange={(v) => handleChange("dataChegada", v)} />
              <InputText type="datetime-local" titulo="Data de Saída" name="dataSaida" onChange={(v) => handleChange("dataSaida", v)} />
              <InputText type="number" titulo="Pesagem (kg)" name="pesagem" onChange={(v) => handleChange("pesagem", v)} />
              <InputText type="number" titulo="Quilometragem (km)" name="quilometragem" onChange={(v) => handleChange("quilometragem", v)} />

              <InputList titulo="Veículo" name="veiculoId" options={veiculos} onChange={(v) => handleChange("veiculoId", v)} />
              <InputList titulo="Motorista" name="motoristaId" options={motoristas} onChange={(v) => handleChange("motoristaId", v)} />
              <InputList titulo="MTR Gerador" name="mtrGeradorId" options={documentos} onChange={(v) => handleChange("mtrGeradorId", v)} />
              <InputList titulo="MTR Destinador" name="mtrDestinadorId" options={documentos} onChange={(v) => handleChange("mtrDestinadorId", v)} />
              <InputList titulo="MTR Transportador" name="mtrTransportadorId" options={documentos} onChange={(v) => handleChange("mtrTransportadorId", v)} />
              <InputList titulo="Diário de Coleta" name="diarioColetaId" options={documentos} onChange={(v) => handleChange("diarioColetaId", v)} />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/colllection-list" />
              <Button titulo="Atualizar" type="button" variant="primary" className="bg-green-950 text-white text-sm" onClick={handleSubmit} />
            </div>
          </>
        )}
      </SimpleForm>
    </Card>
  );
};

export default ColetaUpdate;
