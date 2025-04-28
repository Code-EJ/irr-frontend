import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import SimpleForm from "../../components/SimpleForm";
import BackButton from "../../components/BackButton";
import InputText from "../../components/InputText";
import { MediaService } from "../../services";
import { toast } from "react-toastify";

const MediaUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    dados: "",
  });

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await MediaService.get(id!);
        setFormData({
          dados: response?.dados ?? "",
        });
      } catch (error) {
        toast.error("Erro ao carregar os dados da mídia.");
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
      await MediaService.update(id!, {
        dados: formData.dados,
      });
      toast.success("Mídia atualizada com sucesso!");
      navigate("/media-list");
    } catch (error) {
      toast.error("Erro ao atualizar mídia. Verifique os dados e tente novamente.");
      console.error(error);
    }
  };

  return (
    <Card className="rounded-[50px] shadow-lg d-flex flex-col w-3/4 max-w-4x1 mx-auto p-4">
      <SimpleForm
        initialValues={formData}
        onSubmit={handleSubmit}
        autoSetErrors={true}
        submitOnChange={false}
      >
        {(formik) => (
          <Card>
            <h1 className="text-center text-3xl text-green-900 font-bold mb-8">ATUALIZAR MÍDIA</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <InputText
                type="text"
                titulo="Dados"
                name="dados"
                titleStyle="text-black"
                className="h-8 sm:h-8 md:h-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.dados}
                onChange={(value) => handleChange("dados", value)}
              />
            </div>

            <div className="flex justify-between mt-8">
              <BackButton path="/media-list" />
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

export default MediaUpdate;
