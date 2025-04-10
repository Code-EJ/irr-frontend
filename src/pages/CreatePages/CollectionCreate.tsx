import BackButton from "../../components/BackButton"
import Button from "../../components/Button"
import Card from "../../components/Card"
import InputText from "../../components/InputText"
import InputList from "../../components/InputList"
import SimpleForm from "../../components/SimpleForm"
import { createDonation } from "../../services-antigos/DonationServices"
import { get } from "../../utils/LodashAlternatives"
import { toast } from "react-toastify";

const CollectionRegistration = () => {
    const motoristas = [{name: "Tirar Foto", value: 1}, {name: "Galeria", value: 2}]
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
                Cadastro de Coleta
            </h2>
            <SimpleForm initialValues={{}} onSubmit={handleSubmit}>
                {(formik) => (
                    <div className="grid grid-cols-2 gap-x-32 gap-y-3">
                        <InputText
                            mask="##:##"
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Horario de saída"
                            name="exit_time"
                        />
                        <InputText
                            mask="##:##"
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Horario de realização"
                            name="realization_time"
                        />
                        <InputText
                            mask="##:##"
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Horario de chegada"
                            name="arrival_time"
                        />
                        <InputText
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Veiculo"
                            name="vehicle"
                        />
                        <InputText
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Rota"
                            name="route"
                        />
                        <InputText
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Rota"
                            name="route"
                        />
                        <InputList titulo="Motorista" name="driver" options={motoristas} />
                        <InputText
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Km"
                            name="kilometer"
                        />
                        <InputText
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="MTRs"
                            name="mtrs"
                        />
                        <InputText
                            titleStyle="text-[#133d1b]"
                            className="h-12"
                            titulo="Recibo"
                            name="note"
                        />
                        <div className="w-full mt-16">
                            <BackButton route="menu-entradas-saidas" />
                        </div>
                        <div className="w-full mt-16">
                            <Button
                                titulo="Concluir"
                                action="primary"
                                type="submit"
                                className="bg-green-950 text-white text-sm w-3/4 rounded-2xl"
                            />
                        </div>
                    </div>
                )}
            </SimpleForm>
        </Card>
    )
}
export default CollectionRegistration;
