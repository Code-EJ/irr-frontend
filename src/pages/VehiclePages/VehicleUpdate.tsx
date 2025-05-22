import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import { VehicleService } from "../../services";
import { toast } from "react-toastify";

const VehicleUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    placa: "",
    modelo: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await VehicleService.get(id!);
        setFormData({
          placa: response?.placa ?? "",
          modelo: response?.modelo ?? "",
        });
      } catch (error) {
        toast.error("Erro ao carregar os dados do veículo.");
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
      await VehicleService.update(id!, formData);
      toast.success("Veículo atualizado com sucesso!");
      navigate("/vehicle-list");
    } catch (error) {
      toast.error("Erro ao atualizar veículo. Verifique os dados e tente novamente.");
      console.error(error);
    }
  };

  return (
    <Card className="rounded-[50px] shadow-lg d-flex flex-col w-3/4 max-w-4xl mx-auto p-4">
      <SimpleForm
        initialValues={formData}
        onSubmit={handleSubmit}
        autoSetErrors={true}
        submitOnChange={false}
      >
        {(formik) => (
          <Card>
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">
              ATUALIZAR VEÍCULO
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="text"
                titulo="Placa"
                name="placa"
                value={formData.placa}
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("placa", value)}
              />

              <InputText
                type="text"
                titulo="Modelo"
                name="modelo"
                value={formData.modelo}
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={(value) => handleChange("modelo", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path={"vehicle-list"} />
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

export default VehicleUpdate;
