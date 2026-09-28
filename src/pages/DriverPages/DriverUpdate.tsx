import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import { DriverService } from "../../services";
import { toast } from "react-toastify";

const DriverUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DriverService.get(id!);
        setFormData({
          nome: response?.nome ?? "",
          cpf: response?.cpf ?? "",
        });
      } catch (error) {
        toast.error("Erro ao carregar os dados do motorista.");
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await DriverService.update(id!, formData);
      toast.success("Motorista atualizado com sucesso!");
      navigate("/driver-list");
    } catch (error) {
      toast.error("Erro ao atualizar motorista. Verifique os dados.");
      console.error(error);
    }
  };

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
              ATUALIZAR MOTORISTA
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                titulo="Nome"
                name="nome"
                value={formData.nome}
                onChange={(value) => handleChange("nome", value)}
              />
              <InputText
                titulo="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={(value) => handleChange("cpf", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/driver-list" />
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

export default DriverUpdate;
