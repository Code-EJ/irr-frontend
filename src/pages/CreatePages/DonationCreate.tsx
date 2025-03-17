import BackButton from "../../components/BackButton"
import Button from "../../components/Button"
import Card from "../../components/Card"
import InputText from "../../components/InputText"
import SimpleForm from "../../components/SimpleForm"
import { createDonation } from "../../services-antigos/DonationServices"
import { get } from "../../utils/LodashAlternatives"
import { toast } from "react-toastify";

const DonationRegistration = () => {
    const handleSubmit = (values) => {
        const data = {
            donator: get(values, "donator"),
            pj: get(values, "pj"),
            material_type: get(values, "material_type"),
            weight: get(values, "weight"),
            subtype: get(values, "subtype"),
        }
        createDonation(data)
        .then(() => toast.success("Doação criada com sucesso!"))
        .catch((err) => toast.error(err.message))
    }

    return (
        <Card className="w-full max-w-4xl rounded-[40px]">
            <h2 className="text-2xl text-[#133d1b] font-bold mb-6">
                Cadastro de Doação
            </h2>
            <SimpleForm initialValues={{}} onSubmit={handleSubmit}>
                {(formik) => (
                    <div className="grid grid-cols-2 gap-x-32 gap-y-3">
                        <InputText
                            mask="##/##/####"
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Doador"
                            name="donator"
                        />
                        <InputText
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Novo volume do material"
                            name="pj"
                        />
                        <InputText
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Tipo do material"
                            name="material_type"
                        />
                        <InputText
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Pesagem"
                            name="weight"
                        />
                        <InputText
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Subtipo"
                            name="subtype"
                        />
                        <div />
                        <BackButton route="menu-entradas-saidas" />
                        <Button
                            titulo="Concluir"
                            action="primary"
                            type="submit"
                            className="bg-green-950 text-white text-sm"
                        />
                    </div>
                )}
            </SimpleForm>
        </Card>
    )
}
export default DonationRegistration;
