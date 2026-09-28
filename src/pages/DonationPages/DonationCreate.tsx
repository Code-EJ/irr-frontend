import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import InputList from "../../components/InputList";
import { toast } from "react-toastify";
import { DonationService, DonatorService, TypologyService, SubTypologyService } from "../../services";

const DonationCreate = () => {
  const navigate = useNavigate();
  const [tipologias, setTipologias] = useState<{ name: string; value: string }[]>([]);
  const [subtipologias, setSubtipologias] = useState<{ name: string; value: string }[]>([]);
  const [doadores, setDoadores] = useState<{ name: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    tipologiaId: "",
    subtipologiaId: "",
    pesagem: "",
    doadorId: "",
  });

  useEffect(() => {
    const fetchTipologia = async () => {
      try {
        const response = await TypologyService.getAll(1, 9999);
        const tipologia = response?.data ?? [];
        const mapped = tipologia?.map((item) => ({
          name: item.nome,
          value: item.id,
        })) ?? [];
        setTipologias(mapped);
        if (mapped.length > 0 && !formData.tipologiaId) {
          setFormData((prev) => ({
            ...prev,
            tipologiaId: mapped[0].value,
          }));
        }
      } catch (error) {
        toast.error("Erro ao carregar notas fiscais.");
        console.error(error);
      }
    };
    const fetchSubtipologia = async () => {
      try {
        const response = await SubTypologyService.getAll(1, 9999);
        const subtipologia = response?.data ?? [];
        const mapped = subtipologia?.map((item) => ({
          name: item.nome,
          value: item.id,
        })) ?? [];
        setSubtipologias(mapped);
        if (mapped.length > 0 && !formData.subtipologiaId) {
          setFormData((prev) => ({
            ...prev,
            subtipologiaId: mapped[0].value,
          }));
        }
      } catch (error) {
        toast.error("Erro ao carregar notas fiscais.");
        console.error(error);
      }
    };
    const fetchDoadores = async () => {
      try {
        const response = await DonatorService.getAll(1, 9999);
        const donator = response?.data ?? [];
        const mapped = donator?.map((item) => ({
          name: item.nome,
          value: item.id,
        })) ?? [];
        setDoadores(mapped);
        if (mapped.length > 0 && !formData.doadorId) {
          setFormData((prev) => ({
            ...prev,
            doadorId: mapped[0].value,
          }));
        }
      } catch (error) {
        toast.error("Erro ao carregar notas fiscais.");
        console.error(error);
      }
    };
    fetchTipologia();
    fetchSubtipologia();
    fetchDoadores();
  }, [formData.doadorId, formData.subtipologiaId, formData.tipologiaId]);

  const handleChange = (field: string, value: string | File) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await DonationService.create({
        ...formData,
        pesagem: parseFloat(formData.pesagem),
        tipologiaId: formData.tipologiaId,
        subtipologiaId: formData.subtipologiaId,
        doadorId: formData.doadorId,
      });
      toast.success("Doação criada com sucesso!");
      navigate("/donation-list");
    } catch (error) {
      toast.error("Erro ao criar doação. Verifique os dados.");
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
              NOVA DOAÇÃO
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputList
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black" 
                titulo="Tipologia"
                name="tipologiaId"
                options={tipologias}
                value={formData.tipologiaId}
                onChange={(value) => handleChange("tipologiaId", value)}
              />
              <InputList
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black" 
                titulo="Subtipologia"
                name="subtipologiaId"
                options={subtipologias}
                value={formData.subtipologiaId}
                onChange={(value) => handleChange("subtipologiaId", value)}
              />
              <InputText
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black" 
                titulo="Pesagem (kg)"
                name="pesagem"
                type="number"
                onChange={(value) => handleChange("pesagem", value)}
              />
              <InputList
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                titleStyle="text-black" 
                titulo="Doador"
                name="doadorId"
                options={doadores}
                value={formData.doadorId}
                onChange={(value) => handleChange("doadorId", value)}
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
