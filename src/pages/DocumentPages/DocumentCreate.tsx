import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import InputList from "../../components/InputList";
import { toast } from "react-toastify";
import { DocumentService, MediaService } from "../../services";

const DocumentCreate = () => {
  const navigate = useNavigate();
  const [midias, setMidias] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    dataDocumento: "",
    dataInsercao: new Date().toISOString().split("T")[0],
    tipo: "",
    mediaId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const midiasRes = await MediaService.getAll(1, 9999);
        setMidias(midiasRes.data);
      } catch (error) {
        toast.error("Erro ao carregar mídias.");
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
      await DocumentService.create(formData);
      toast.success("Documento criado com sucesso!");
      navigate("/documento-list");
    } catch (error) {
      toast.error("Erro ao criar documento. Verifique os dados.");
      console.error(error);
    }
  };

  const mapToOptions = (list, labelKey = "nome", valueKey = "id") =>
    list.map((item) => ({ name: item[labelKey], value: item[valueKey] }));

  const tiposDocumento = [
    "MTR-GERADOR",
    "MTR-DESTINADOR",
    "MTR-TRANSPORTADOR",
    "DIARIO-COLETA",
    "NOTA-FISCAL",
    "OUTRO",
  ];

  return (
    <Card className="rounded-[50px] shadow-lg w-3/4 max-w-4xl mx-auto p-4">
      <SimpleForm
        initialValues={formData}
        onSubmit={handleSubmit}
        autoSetErrors={true}
        submitOnChange={false}
      >
        {() => (
          <Card>
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">
              NOVO DOCUMENTO
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                titulo="Nome do Documento"
                name="nome"
                type="text"
                onChange={(value) => handleChange("nome", value)}
              />
              <InputText
                titulo="Data do Documento"
                name="dataDocumento"
                type="date"
                onChange={(value) => handleChange("dataDocumento", value)}
              />
              <InputList
                titulo="Tipo de Documento"
                name="tipo"
                options={tiposDocumento.map((tipo) => ({
                  name: tipo,
                  value: tipo,
                }))}
                onChange={(value) => handleChange("tipo", value)}
              />
              <InputList
                titulo="Mídia"
                name="mediaId"
                options={mapToOptions(midias)}
                onChange={(value) => handleChange("mediaId", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/documento-list" />
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

export default DocumentCreate;
