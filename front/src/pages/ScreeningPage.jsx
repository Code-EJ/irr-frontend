import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import InputText from "../components/InputText";
import SimpleForm from "../components/SimpleForm";
import { handleNewTriagem } from "../services/TriagemServices";
import { get } from "../utils/LodashAlternatives";

const ScreeningPage = () => {
  const handleBack = () => {
    window.location.href = "/home";
  };

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
    handleNewTriagem(data)
      .then(() => toast.success("Deu certo"))
      .catch(() => toast.error("Deu errado"));
  };

  return (
    <div className="bg-green-700 bg-cover min-h-screen w-full flex justify-center items-center p-5">
      <Card className="bg-[#5c8a68] rounded-[50px] shadow-lg d-flex flex-col">
        <h1 className="text-center text-3xl text-white font-bold">TRIAGENS</h1>

        <div>
          <SimpleForm initialValues={{}} onSubmit={handleSubmit}>
            {() => (
              <div className="grid grid-cols-2 gap-x-32 gap-y-3">
                <InputText
                  titleStyle="text-white"
                  className="h-12"
                  titulo="Data da triagem"
                  name="screening_date"
                />
                <InputText
                  titleStyle="text-white"
                  className="h-12"
                  titulo="Tipo da triagem"
                  name="screening_type"
                />
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
                <Button
                  titulo="Voltar"
                  onClick={() => handleBack()}
                  className="bg-red-700 text-white rounded-lg px-6 py-2 text-sm"
                />
                <Button
                  titulo="Concluir"
                  action="primary"
                  type="submit"
                  className="bg-green-950 text-white rounded-lg px-6 py-2 text-sm"
                />
              </div>
            )}
          </SimpleForm>
        </div>
      </Card>
    </div>
  );
};

export default ScreeningPage;
