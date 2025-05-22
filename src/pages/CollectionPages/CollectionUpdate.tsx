import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import InputList from "../../components/InputList";
import { CollectionService, VehicleService, DriverService, DocumentService } from "../../services";
import { toast } from "react-toastify";

const ColetaUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [veiculos, setVeiculos] = useState<{ name: string; value: string }[]>([]);
  const [motoristas, setMotoristas] = useState<{ name: string; value: string }[]>([]);

  const [mtrGeradorDocs, setMtrGeradorDocs] = useState<{ name: string; value: string }[]>([]);
  const [mtrDestinadorDocs, setMtrDestinadorDocs] = useState<{ name: string; value: string }[]>([]);
  const [mtrTransportadorDocs, setMtrTransportadorDocs] = useState<{ name: string; value: string }[]>([]);
  const [diarioColetaDocs, setDiarioColetaDocs] = useState<{ name: string; value: string }[]>([]);

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
        const [veicResp, motResp, docsResp] = await Promise.all([
          VehicleService.getAll(1, 9999),
          DriverService.getAll(1, 9999),
          DocumentService.getAll(1, 9999),
        ]);

        const veic = veicResp.data ?? [];
        const mot = motResp.data ?? [];
        const docs = docsResp.data ?? [];

        setVeiculos(veic.map((v: any) => ({ name: v.placa, value: v.id })));
        setMotoristas(mot.map((m: any) => ({ name: m.nome, value: m.id })));

        const geradorDocs = docs
          .filter((d: any) => d.tipo === "MTR_GERADOR")
          .map((d: any) => ({ name: d.numero ?? d.nome ?? d.id, value: d.id }));
        const destinadorDocs = docs
          .filter((d: any) => d.tipo === "MTR_DESTINADOR")
          .map((d: any) => ({ name: d.numero ?? d.nome ?? d.id, value: d.id }));
        const transportadorDocs = docs
          .filter((d: any) => d.tipo === "MTR_TRANSPORTADOR")
          .map((d: any) => ({ name: d.numero ?? d.nome ?? d.id, value: d.id }));
        const diarioDocs = docs
          .filter((d: any) => d.tipo === "DIARIO_COLETA")
          .map((d: any) => ({ name: d.numero ?? d.nome ?? d.id, value: d.id }));

        setMtrGeradorDocs(geradorDocs);
        setMtrDestinadorDocs(destinadorDocs);
        setMtrTransportadorDocs(transportadorDocs);
        setDiarioColetaDocs(diarioDocs);
      } catch (err) {
        toast.error("Erro ao carregar dados de seleção.");
        console.error(err);
      }
    };

    const fetchColeta = async () => {
      try {
        const response = await CollectionService.get(id!);
        const data = response ?? response.data ?? {};

        setFormData({
          dataRealizacao: data.dataRealizacao || "",
          dataChegada: data.dataChegada || "",
          dataSaida: data.dataSaida || "",
          pesagem: data.pesagem?.toString() || "",
          quilometragem: data.quilometragem?.toString() || "",
          veiculoId: data.veiculoId || "",
          motoristaId: data.motoristaId || "",
          mtrGeradorId: data.mtrGeradorId || "",
          mtrDestinadorId: data.mtrDestinadorId || "",
          mtrTransportadorId: data.mtrTransportadorId || "",
          diarioColetaId: data.diarioColetaId || "",
        });
      } catch (error) {
        toast.error("Erro ao carregar dados da coleta.");
        console.error(error);
      }
    };

    fetchSelectData();
    if (id) fetchColeta();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Convertendo para os tipos corretos antes do envio
      const payload = {
        ...formData,
        pesagem: Number(formData.pesagem),
        quilometragem: Number(formData.quilometragem),
        veiculoId: formData.veiculoId,
        motoristaId: formData.motoristaId,
        mtrGeradorId: formData.mtrGeradorId,
        mtrDestinadorId: formData.mtrDestinadorId,
        mtrTransportadorId: formData.mtrTransportadorId,
        diarioColetaId: formData.diarioColetaId,
      };

      await CollectionService.update(id!, payload);
      toast.success("Coleta atualizada com sucesso!");
      navigate("/collection-list");
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="date"
                titulo="Data de Realização"
                name="dataRealizacao"
                value={formData.dataRealizacao}
                onChange={(v) => handleChange("dataRealizacao", v)}
              />
              <InputText
                type="datetime-local"
                titulo="Data de Chegada"
                name="dataChegada"
                value={formData.dataChegada}
                onChange={(v) => handleChange("dataChegada", v)}
              />
              <InputText
                type="datetime-local"
                titulo="Data de Saída"
                name="dataSaida"
                value={formData.dataSaida}
                onChange={(v) => handleChange("dataSaida", v)}
              />
              <InputText
                type="number"
                titulo="Pesagem (kg)"
                name="pesagem"
                value={formData.pesagem}
                onChange={(v) => handleChange("pesagem", v)}
              />
              <InputText
                type="number"
                titulo="Quilometragem (km)"
                name="quilometragem"
                value={formData.quilometragem}
                onChange={(v) => handleChange("quilometragem", v)}
              />

              <InputList
                titulo="Veículo"
                name="veiculoId"
                options={veiculos}
                value={formData.veiculoId}
                onChange={(v) => handleChange("veiculoId", v)}
              />
              <InputList
                titulo="Motorista"
                name="motoristaId"
                options={motoristas}
                value={formData.motoristaId}
                onChange={(v) => handleChange("motoristaId", v)}
              />
              <InputList
                titulo="MTR Gerador"
                name="mtrGeradorId"
                options={mtrGeradorDocs}
                value={formData.mtrGeradorId}
                onChange={(v) => handleChange("mtrGeradorId", v)}
              />
              <InputList
                titulo="MTR Destinador"
                name="mtrDestinadorId"
                options={mtrDestinadorDocs}
                value={formData.mtrDestinadorId}
                onChange={(v) => handleChange("mtrDestinadorId", v)}
              />
              <InputList
                titulo="MTR Transportador"
                name="mtrTransportadorId"
                options={mtrTransportadorDocs}
                value={formData.mtrTransportadorId}
                onChange={(v) => handleChange("mtrTransportadorId", v)}
              />
              <InputList
                titulo="Diário de Coleta"
                name="diarioColetaId"
                options={diarioColetaDocs}
                value={formData.diarioColetaId}
                onChange={(v) => handleChange("diarioColetaId", v)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/collection-list" />
              <Button
                titulo="Atualizar"
                type="button" variant="primary" className="bg-green-950 text-white text-sm" onClick={handleSubmit} />
            </div>
          </>
        )}
      </SimpleForm>
    </Card>
  );
};

export default ColetaUpdate;
