import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import InputList from "../../components/InputList";
import { toast } from "react-toastify";
import { DonationService, TypologyService, SubTypologyService, DonatorService, UserService } from "../../services";

const DonationCreate = () => {
  const navigate = useNavigate();
  const [tipologias, setTipologias] = useState([]);
  const [subtipologias, setSubtipologias] = useState([]);
  const [doadores, setDoadores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  const [formData, setFormData] = useState({
    tipologiaId: "",
    subtipologiaId: "",
    pesagem: "",
    doadorId: "",
    criadorId: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipRes, subtipRes, doadorRes, userRes] = await Promise.all([
          TypologyService.getAll(1, 9999),
          SubTypologyService.getAll(1, 9999),
          DonatorService.getAll(1, 9999),
          UserService.getAll(1, 9999)
        ]);
        setTipologias(tipRes.data);
        setSubtipologias(subtipRes.data);
        setDoadores(doadorRes.data);
        setUsuarios(userRes.data);
      } catch (error) {
        toast.error("Erro ao carregar dados.");
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
      await DonationService.create(formData);
      toast.success("Doação criada com sucesso!");
      navigate("/donation-list");
    } catch (error) {
      toast.error("Erro ao criar doação. Verifique os dados.");
      console.error(error);
    }
  };

  const mapToOptions = (list, labelKey = "nome", valueKey = "id") =>
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
              NOVA DOAÇÃO
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputList
                titulo="Tipologia"
                name="tipologiaId"
                options={mapToOptions(tipologias)}
                onChange={(value) => handleChange("tipologiaId", value)}
              />
              <InputList
                titulo="Subtipologia"
                name="subtipologiaId"
                options={mapToOptions(subtipologias)}
                onChange={(value) => handleChange("subtipologiaId", value)}
              />
              <InputText
                titulo="Pesagem (kg)"
                name="pesagem"
                type="number"
                onChange={(value) => handleChange("pesagem", value)}
              />
              <InputList
                titulo="Doador"
                name="doadorId"
                options={mapToOptions(doadores)}
                onChange={(value) => handleChange("doadorId", value)}
              />
              <InputList
                titulo="Criador"
                name="criadorId"
                options={mapToOptions(usuarios, "nomeCompleto")}
                onChange={(value) => handleChange("criadorId", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/donation-list" />
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

export default DonationCreate;
