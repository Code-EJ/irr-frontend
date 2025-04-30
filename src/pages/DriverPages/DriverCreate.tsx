import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import InputList from "../../components/InputList";
import { toast } from "react-toastify";
import { DriverService, UserService } from "../../services";

const DriverCreate = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    criadorId: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await UserService.getAll(1, 9999);
        setUsuarios(userRes.data);
      } catch (error) {
        toast.error("Erro ao carregar usuários.");
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
      await DriverService.create(formData);
      toast.success("Motorista criado com sucesso!");
      navigate("/driver-list");
    } catch (error) {
      toast.error("Erro ao criar motorista. Verifique os dados.");
      console.error(error);
    }
  };

  const mapToOptions = (list, labelKey = "nomeCompleto", valueKey = "id") =>
    list.map((item) => ({ name: item[labelKey], value: item[valueKey] }));

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
              NOVO MOTORISTA
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                titulo="Nome"
                name="nome"
                onChange={(value) => handleChange("nome", value)}
              />
              <InputText
                titulo="CPF"
                name="cpf"
                onChange={(value) => handleChange("cpf", value)}
              />
              <InputList
                titulo="Criador"
                name="criadorId"
                options={mapToOptions(usuarios, "nomeCompleto")}
                onChange={(value) => handleChange("criadorId", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/driver-list" />
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

export default DriverCreate;
