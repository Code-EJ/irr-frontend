import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import InputList from "../../components/InputList";
import { DonationService, TypologyService, SubTypologyService, DonatorService, UserService } from "../../services";
import { toast } from "react-toastify";

const DonationUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tipologias, setTipologias] = useState([]);
  const [subtipologias, setSubtipologias] = useState([]);
  const [doadores, setDoadores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [formData, setFormData] = useState({
    tipologiaId: "",
    subtipologiaId: "",
    pesagem: "",
    doadorId: "",
    criadorId: "",
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [tipRes, subtipRes, doadorRes, userRes] = await Promise.all([
          TypologyService.getAll(1, 9999),
          SubTypologyService.getAll(1, 9999),
          DonatorService.getAll(1, 9999),
          UserService.getAll(1, 9999),
        ]);
        setTipologias(tipRes.data);
        setSubtipologias(subtipRes.data);
        setDoadores(doadorRes.data);
        setUsuarios(userRes.data);
      } catch (error) {
        toast.error("Erro ao carregar opções.");
        console.error(error);
      }
    };

    const fetchDonation = async () => {
      try {
        const response = await DonationService.get(id!);
        const data = response ?? {};
        setFormData({
          tipologiaId: data.tipologiaId ?? "",
          subtipologiaId: data.subtipologiaId ?? "",
          pesagem: data.pesagem ?? "",
          doadorId: data.doadorId ?? "",
          criadorId: data.criadorId ?? "",
        });
      } catch (error) {
        toast.error("Erro ao carregar dados da doação.");
        console.error(error);
      }
    };

    fetchOptions();
    fetchDonation();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await DonationService.update(id!, formData);
      toast.success("Doação atualizada com sucesso!");
      navigate("/donation-list");
    } catch (error) {
      toast.error("Erro ao atualizar doação. Verifique os dados.");
      console.error(error);
    }
  };

  const mapToOptions = (list: any[], labelKey = "nome", valueKey = "id") =>
    list.map((item) => ({ name: item[labelKey], value: item[valueKey] }));

  return (
    <Card className="rounded-[50px] shadow-lg d-flex flex-col w-3/4 max-w-4x1 mx-auto p-4">
      <SimpleForm initialValues={formData} onSubmit={handleSubmit} autoSetErrors={true} submitOnChange={false}>
        {(formik) => (
          <Card>
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">ATUALIZAR DOAÇÃO</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputList
                titulo="Tipologia"
                name="tipologiaId"
                value={formData.tipologiaId}
                onChange={(value) => handleChange("tipologiaId", value)}
                options={mapToOptions(tipologias)}
              />
              <InputList
                titulo="Subtipologia"
                name="subtipologiaId"
                value={formData.subtipologiaId}
                onChange={(value) => handleChange("subtipologiaId", value)}
                options={mapToOptions(subtipologias)}
              />
              <InputText
                titulo="Pesagem (kg)"
                name="pesagem"
                type="number"
                value={formData.pesagem}
                onChange={(value) => handleChange("pesagem", value)}
              />
              <InputList
                titulo="Doador"
                name="doadorId"
                value={formData.doadorId}
                onChange={(value) => handleChange("doadorId", value)}
                options={mapToOptions(doadores)}
              />
              <InputList
                titulo="Criador"
                name="criadorId"
                value={formData.criadorId}
                onChange={(value) => handleChange("criadorId", value)}
                options={mapToOptions(usuarios, "nomeCompleto")}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="donation-list" />
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

export default DonationUpdate;
