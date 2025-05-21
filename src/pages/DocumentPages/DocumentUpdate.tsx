import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import InputList from "../../components/InputList";
import InputFile from "../../components/InputFile";
import { toast } from "react-toastify";
import { DocumentService } from "../../services";

const DocumentUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    nome: string;
    dataDocumento: string;
    dataInsercao: string;
    tipo: string;
    arquivo: File | null;
  }>({
    nome: "",
    dataDocumento: "",
    dataInsercao: "", 
    tipo: "NOTA_FISCAL",
    arquivo: null,
  });

  useEffect(() => {
    if (id) {
      DocumentService.get(id)
        .then((response) => {
          if (!response || !response.data) {
            toast.error("Resposta inválida ao carregar documento.");
            return;
          }
          const doc = response.data;
          setFormData({
            nome: doc.nome || "",
            dataDocumento: doc.dataDocumento ? doc.dataDocumento.split("T")[0] : "",
            dataInsercao: doc.dataInsercao || "",
            tipo: doc.tipo || "NOTA_FISCAL",
            arquivo: null, 
          });
        })
        .catch((error) => {
          toast.error("Erro ao carregar documento.");
          console.error(error);
        });
    }
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.dataDocumento || !formData.tipo) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    if (formData.arquivo) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(formData.arquivo.type)) {
        toast.error('Tipo de arquivo não permitido! Por favor, envie uma imagem ou PDF.');
        return;
      }
    }

    const dataDocumentoFormatted = `${formData.dataDocumento}T00:00:00.000Z`;

    const formDataToSend = new FormData();
    formDataToSend.append("nome", formData.nome);
    formDataToSend.append("dataDocumento", dataDocumentoFormatted);
    formDataToSend.append("dataInsercao", formData.dataInsercao);
    formDataToSend.append("tipo", formData.tipo);

    if (formData.arquivo) {
      formDataToSend.append("arquivo", formData.arquivo);
    }

    try {
      await DocumentService.update(id, formDataToSend);
      toast.success("Documento atualizado com sucesso!");
      navigate("/document-list");
    } catch (error) {
      toast.error("Erro ao atualizar documento. Verifique os dados.");
      console.error(error);
    }
  };

  const tiposDocumento = [
    "NOTA_FISCAL",
    "MTR_GERADOR",
    "MTR_TRANSPORTADOR",
    "MTR_DESTINADOR",
    "DIARIO_COLETA",
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
              EDITAR DOCUMENTO
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                titulo="Nome do Documento"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={(value) => handleChange("nome", value)}
              />
              <InputText
                titulo="Data do Documento"
                name="dataDocumento"
                type="date"
                value={formData.dataDocumento}
                onChange={(value) => handleChange("dataDocumento", value)}
              />
              <InputList
                titulo="Tipo de Documento"
                name="tipo"
                options={tiposDocumento.map((tipo) => ({
                  name: tipo,
                  value: tipo,
                }))}
                value={formData.tipo}
                onChange={(value) => handleChange("tipo", value)}
              />
              <InputFile
                titulo="Arquivo (se quiser atualizar)"
                name="arquivo"
                onChange={(file) => handleChange("arquivo", file)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/document-list" />
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
