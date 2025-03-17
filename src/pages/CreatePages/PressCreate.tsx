import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import Card from "../../components/Card";
import InputText from "../../components/InputText";
import SimpleForm from "../../components/SimpleForm";
import { get } from "../../utils/LodashAlternatives";
import { toast } from "react-toastify";

const PressPage = () => {
  const handleSubmit = (values) => {
    const data = {
        new_material_volume: get(values, 'new_material_volume'),
        material_type: get(values, 'material_type'),
        material_destination: get(values, 'material_destination'),
        material_volume: get(values, 'material_volume'),
        material_origin: get(values, 'material_origin'),
        screening_date: get(values, 'screening_date'),
    };
    handleNewPress(data)
      .then(() => toast.success("Deu certo"))
      .catch(() => toast.error("Deu errado"));
  };

  return (
    <Card className="rounded-[50px] shadow-lg d-flex flex-col" bgColor="#5d8b68">
      <h1 className="text-center text-3xl text-white font-bold">PRENSAGEM</h1>
      <div>
        <SimpleForm initialValues={{}} onSubmit={handleSubmit}>
          {(formik) => (
            <div className="grid grid-cols-2 gap-x-32 gap-y-3">
              <InputText
                mask="##/##/####"
                titleStyle="text-white"
                className="h-12"
                titulo="Data da prensagem"
                name="screening_date"
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Novo volume do material"
                name="new_material_volume"
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
                titulo="Destino do material"
                name="material_destination"
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Qualidade do material"
                name="material_volume"
              />
              <InputText
                titleStyle="text-white"
                className="h-12"
                titulo="Origem do material"
                name="material_origin"
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
export default PressPage;
