import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";
import SimpleForm from "../components/SimpleForm";
import { createTriagem } from "../services-antigos/TriagemServices";
import { get } from "../utils/LodashAlternatives";
import BackButton from "../components/BackButton";
import InputList from "../components/InputList";
import { toast } from "react-toastify";

const ScreeningPage = () => {
  const tiposTriagem = [{ name: "Grossa", value: 1 }, { name: "Primaria", value: 2 }, { name: "Fina", value: 3 }]
  const handleSubmit = (values) => {
    const data = {
      screening_date: get(values, "screening_date"),
      screening_type: get(values, "screening_type"),
      material_type: get(values, "material_type"),
      material_volume: get(values, "material_volume"),
      material_quality: get(values, "material_quality"),
      material_reject: get(values, "material_reject"),
      material_origin: get(values, "material_origin"),
      material_destination: get(values, "material_destination"),
    };
    createTriagem(data)
      .then(() => toast.success("Deu certo"))
      .catch((err) => toast.error(err.message));
  };

  return (
    <Card className="rounded-[50px] shadow-lg d-flex flex-col" bgColor="#5d8b68">
      <h1 className="text-center text-3xl text-white font-bold">TRIAGEM</h1>
      <div>
        <SimpleForm initialValues={{}} onSubmit={handleSubmit}>
          {() => (
            <div className="grid grid-cols-2 gap-x-32 gap-y-3">
              <InputText
                mask="##/##/####"
                titleStyle="text-white"
                className="h-12"
                titulo="Data da triagem"
                name="screening_date"
              />
              <InputList titleStyle="text-white" titulo="Tipo da triagem" name="screening_type" options={tiposTriagem} />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Tipo do material"
                name="material_type"
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Volume do material"
                name="material_volume"
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Qualidade do material"
                name="material_quality"
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Rejeito do material"
                name="material_reject"
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Origem do material"
                name="material_origin"
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Destino do material"
                name="material_destination"
              />
              <BackButton route="menu-tratamentos" />
              <Button
                titulo="Concluir"
                action="primary"
                type="submit"
                className="bg-green-950 text-white text-sm"
              />
            </div>
          )}
        </SimpleForm>
      </div>
    </Card>
  );
};

export default ScreeningPage;
