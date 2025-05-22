import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import InputList from "../../components/InputList";
import { toast } from "react-toastify";
import {
  DonationService,
  DonatorService,
  TypologyService,
  SubTypologyService,
} from "../../services";

const DonationUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    const fetchData = async () => {
      try {
        const [tipRes, subtipRes, doadorRes, donationRes] = await Promise.all([
          TypologyService.getAll(1, 9999),
          SubTypologyService.getAll(1, 9999),
          DonatorService.getAll(1, 9999),
          DonationService.get(id!),
        ]);

        const map = (list: any[], label = "nome") =>
          list.map((item) => ({ name: item[label], value: item.id }));

        setTipologias(map(tipRes.data));
        setSubtipologias(map(subtipRes.data));
        setDoadores(map(doadorRes.data));

        const data = donationRes ?? {};
        setFormData({
          tipologiaId: data.tipologiaId ?? "",
          subtipologiaId: data.subtipologiaId ?? "",
          pesagem: data.pesagem?.toString() ?? "",
          doadorId: data.doadorId ?? "",
        });
      } catch (error) {
        toast.error("Erro ao carregar dados.");
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
      await DonationService.update(id!, {
        ...formData,
        pesagem: parseFloat(formData.pesagem),
      });
      toast.success("Doação atualizada com sucesso!");
      navigate("/donation-list");
    } catch (error) {
      toast.error("Erro ao atualizar doação. Verifique os dados.");
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
              ATUALIZAR DOAÇÃO
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputList
                titulo="Tipologia"
                name="tipologiaId"
                options={tipologias}
                value={formData.tipologiaId}
                onChange={(value) => handleChange("tipologiaId", value)}
              />
              <InputList
                titulo="Subtipologia"
                name="subtipologiaId"
                options={subtipologias}
                value={formData.subtipologiaId}
                onChange={(value) => handleChange("subtipologiaId", value)}
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
                options={doadores}
                value={formData.doadorId}
                onChange={(value) => handleChange("doadorId", value)}
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
