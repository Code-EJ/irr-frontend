import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { Formik, Form } from "formik";
import SimpleForm from "../components/SimpleForm";
import InputText from "../components/InputText";

const handleAuth = async (data) => {
    console.log("Enviando dados para o servidor:", data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data.doador) resolve("Dados enviados com sucesso!");
            else reject(new Error("Erro no envio de dados."));
        }, 1000);
    });
};

const CollectionForm = () => {
    const navigate = useNavigate();

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log("Valores recebidos do formulário:", values);
        const data = {
            horarioSaida: values.horarioSaida,
            horaRealizacao: values.horaRealizacao,
            horaChegada: values.horaChegada,
            veiculo: values.veiculo,
            rota: values.rota,
            km: values.km,
            MTRs: values.MTRs,
            recibo: values.recibo,
            motorista: values.motorista,
            relatorioFeito: values.relatorioFeito,
        };

        console.log("Dados formatados para envio:", data);

        try {
            await handleAuth(data);
            toast.success("Formulário enviado com sucesso!");
            resetForm();
            navigate("/home");
        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
            toast.error("Formulário não enviado! Verifique os dados e tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#2E4F2F]">
            <SimpleForm onSubmit={onSubmit} initialValues={{}}>
                {() => (
                    <Card className="w-[48rem] h-auto rounded-[30px] shadow-lg bg-white p-6 text-black mt-10">
                        <h2 className="text-[#133D1A] uppercase text-2xl font-semibold sz-[32px] pb-10">
                            Cadastro de <br /> Coleta
                        </h2>

                        <Formik
                            initialValues={{
                                horarioSaida: "",
                                horaRealizacao: "",
                                horaChegada: "",
                                veiculo: "",
                                rota: "",
                                km: "",
                                MTRs: "",
                                recibo: "",
                                motorista: "",
                                relatorioFeito: false,
                            }}
                            onSubmit={onSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form className="flex flex-wrap gap-8 items-center">
                                    <InputText
                                        titulo="Horário de Saída"
                                        name="horarioSaida"
                                    />
                                    <InputText
                                        titulo="Hora de Realização"
                                        name="horaRealizacao"
                                    />
                                    <InputText
                                        titulo="Horário de Chegada"
                                        name="horaChegada"
                                    />
                                    <InputText
                                        titulo="Veículo"
                                        name="veiculo"
                                    />
                                    <InputText
                                        titulo="Rota"
                                        name="rota"
                                    />
                                    <InputText
                                        titulo="Quilometragem"
                                        name="km"
                                    />
                                    <InputText
                                        titulo="MTRs"
                                        name="MTRs"
                                    />
                                    <InputText
                                        titulo="Recibo"
                                        name="recibo"
                                    />
                                    <InputText
                                        titulo="Motorista"
                                        name="motorista"
                                    />

                                    <div className="w-full text-left">
                                        <label className="font-medium text-sm text-[#133D1A] flex items-center">
                                            <input
                                                type="checkbox"
                                                name="relatorioFeito"
                                                className="w-5 h-5 mr-2 bg-white border-2 border-[#133D1A] rounded-md checked:bg-[#133D1A] checked:border-[#133D1A] focus:ring-2 focus:ring-[#133D1A]"
                                            />
                                            Relatório do mês já ocorreu.
                                        </label>
                                    </div>

                                    <div className="mt-6 w-full flex justify-between">
                                        <button
                                            type="button"
                                            className="text-start s-[20px] text-[#133D1A] underline decoration-[#133D1A] text-underline-offset-[9px] font-semibold"
                                        >
                                            Excluir Coleta
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`text-center w-[6.4rem] rounded-[30px] s-[20px] text-white ${
                                                isSubmitting ? "bg-gray-400" : "bg-[#133D1A]"
                                            } font-semibold`}
                                        >
                                            {isSubmitting ? "Enviando..." : "Concluir"}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Card>
                )}
            </SimpleForm>
        </div>
    );
};

export default CollectionForm;
