import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import InputText from "../../components/InputText";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputList from "../../components/InputList";
import { TriageService } from "../../services";
import { toast } from "react-toastify";

const ScreeningPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    screening_date: "",
    screening_type: "",
    material_type: "",
    material_volume: "",
    material_quality: "",
    material_reject: "",
    material_origin: "",
    material_destination: "",
  });

  const tiposTriagem = [
    { name: "Grossa", value: "Grossa" },
    { name: "Primária", value: "Primária" },
    { name: "Fina", value: "Fina" },
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log("Enviando:", formData);
    try {
      const response = await TriageService.create(formData);
      console.log("Resposta da API:", response);
      toast.success("Triagem criada com sucesso!");
      navigate("/triage-list");
    } catch (error) {
      console.error("Erro ao criar triagem:", error);
      toast.error("Erro ao criar triagem. Verifique os dados e tente novamente.");
    }
  };  

  return (
    <Card className="rounded-[50px] shadow-lg d-flex flex-col" bgColor="#5d8b68">
      <h1 className="text-center text-3xl text-white font-bold">TRIAGEM</h1>
      <div>
        <SimpleForm initialValues={formData} onSubmit={handleSubmit}>
          {() => (
            <div className="grid grid-cols-2 gap-x-32 gap-y-3">
              <InputText
                mask="##/##/####"
                titleStyle="text-white"
                className="h-12"
                titulo="Data da triagem"
                name="screening_date"
                onChange={(value: any) => handleChange("screening_date", value)}
              />
              <InputList
                titleStyle="text-white"
                titulo="Tipo da triagem"
                name="screening_type"
                options={tiposTriagem}
                onChange={(value: any) => handleChange("screening_type", value)}
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Tipo do material"
                name="material_type"
                onChange={(value: any) => handleChange("material_type", value)}
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Volume do material"
                name="material_volume"
                onChange={(value: any) => handleChange("material_volume", value)}
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Qualidade do material"
                name="material_quality"
                onChange={(value: any) => handleChange("material_quality", value)}
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Rejeito do material"
                name="material_reject"
                onChange={(value: any) => handleChange("material_reject", value)}
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Origem do material"
                name="material_origin"
                onChange={(value: any) => handleChange("material_origin", value)}
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Destino do material"
                name="material_destination"
                onChange={(value: any) => handleChange("material_destination", value)}
              />
              <BackButton route="/triage-menu" /> {}
              <Button
                titulo="Criar"
                action="primary"
                type="button"
                className="bg-green-950 text-white text-sm"
                onClick={handleSubmit} // Chama o handleSubmit ao clicar
              />
            </div>
          )}
        </SimpleForm>
      </div>
    </Card>
  );
};

export default ScreeningPage;