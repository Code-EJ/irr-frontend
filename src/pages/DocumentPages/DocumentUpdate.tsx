import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import { DocumentService } from "../../services";
import { toast } from "react-toastify";

const DocumentUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nome: "",
    dataDocumento: "",
    dataInsercao: "",
    tipo: "",
    mediaId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DocumentService.get(id!);
        const data = response ?? {};

        setFormData({
          nome: data.nome ?? "",
          dataDocumento: data.dataDocumento
            ? new Date(data.dataDocumento).toISOString().split("T")[0]
            : "",
          dataInsercao: data.dataInsercao
            ? new Date(data.dataInsercao).toISOString().split("T")[0]
            : "",
          tipo: data.tipo ?? "",
          mediaId: data.mediaId ?? "",
        });
      } catch (error) {
        toast.error("Erro ao carregar os dados do documento.");
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
      await DocumentService.update(id!, {
        ...formData,
        dataDocumento: new Date(formData.dataDocumento),
        dataInsercao: new Date(formData.dataInsercao),
      });
      toast.success("Documento atualizado com sucesso!");
      navigate("/document-list");
    } catch (error) {
      toast.error("Erro ao atualizar documento. Verifique os dados e tente novamente.");
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
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">ATUALIZAR DOCUMENTO</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                titulo="Nome"
                name="nome"
                onChange={(value) => handleChange("nome", value)}
                value={formData.nome}
              />
              <InputText
                type="date"
                titulo="Data do Documento"
                name="dataDocumento"
                onChange={(value) => handleChange("dataDocumento", value)}
                value={formData.dataDocumento}
              />
              <InputText
                type="date"
                titulo="Data de Inserção"
                name="dataInsercao"
                onChange={(value) => handleChange("dataInsercao", value)}
                value={formData.dataInsercao}
              />
              <InputText
                titulo="Tipo"
                name="tipo"
                onChange={(value) => handleChange("tipo", value)}
                value={formData.tipo}
              />
              <InputText
                titulo="ID da Mídia"
                name="mediaId"
                onChange={(value) => handleChange("mediaId", value)}
                value={formData.mediaId}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"document-list"} />
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

export default DocumentUpdate;
