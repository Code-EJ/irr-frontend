import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { Formik, Form, Field } from "formik";
import Header from "../components/Header"; 

const handleAuth = async (data) => {
    console.log("Enviando dados para o servidor:", data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data.doador) resolve("Dados enviados com sucesso!");
            else reject(new Error("Erro no envio de dados."));
        }, 1000);
    });
};

const DonationForm = () => {
    const navigate = useNavigate();

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log("Valores recebidos do formulário:", values);
        const data = {
            doador: values.doador,
            tipoMaterial: values.tipoMaterial,
            pesagem: values.pesagem,
            pj: values.pj,
            subtipo: values.subtipo,
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
            <Header />

            <Card className="w-[48rem] h-auto rounded-[30px] shadow-lg bg-white p-6 text-black mt-10"> 
                <h2 className="text-[#133D1A] uppercase text-2xl font-semibold sz-[32px] pb-10">
                    Cadastro de <br /> Doação
                </h2>

                <Formik
                    initialValues={{
                        doador: "",
                        tipoMaterial: "",
                        subtipo: "",
                        pj: "",
                        pesagem: "",
                        relatorioFeito: false,
                    }}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, values }) => (
                        <Form className="flex flex-wrap gap-8 items-center">
                            <div className="flex-1 min-w-[250px] text-start">
                                <label
                                    htmlFor="doador"
                                    className="font-medium text-sm text-[#133D1A] mb-2 block"
                                >
                                    Doador
                                </label>
                                <Field
                                    id="doador"
                                    name="doador"
                                    placeholder="Nome do Doador"
                                    className="w-[257px] h-[54px] rounded-md border border-[rgb(18,61,27)] shadow-lg transition-shadow duration-300 hover:shadow-xl focus:outline-none"
                                    value={values.doador || ""}
                                />
                            </div>

                            <div className="flex-1 min-w-[250px] text-start">
                                <label
                                    htmlFor="pj"
                                    className="font-medium text-sm text-[#133D1A] mb-2 block"
                                >
                                    PJ
                                </label>
                                <Field
                                    id="pj"
                                    name="pj"
                                    placeholder="Pessoa Jurídica"
                                    className="w-[257px] h-[54px] rounded-md border border-[rgb(18,61,27)] shadow-lg transition-shadow duration-300 hover:shadow-xl focus:outline-none"
                                    value={values.pj || ""}
                                />
                            </div>

                            <div className="flex-1 min-w-[250px] text-start">
                                <label
                                    htmlFor="tipoMaterial"
                                    className="font-medium text-sm text-[#133D1A] mb-2 block"
                                >
                                    Tipo de Material
                                </label>
                                <Field
                                    id="tipoMaterial"
                                    name="tipoMaterial"
                                    placeholder="Tipo de Material"
                                    className="w-[257px] h-[54px] rounded-md border border-[rgb(18,61,27)] shadow-lg transition-shadow duration-300 hover:shadow-xl focus:outline-none"
                                    value={values.tipoMaterial || ""}
                                />
                            </div>

                            <div className="flex-1 min-w-[250px] text-start">
                                <label
                                    htmlFor="subtipo"
                                    className="font-medium text-sm text-[#133D1A] mb-2 block"
                                >
                                    Subtipo
                                </label>
                                <Field
                                    id="subtipo"
                                    name="subtipo"
                                    placeholder="Subtipo de Material"
                                    className="w-[257px] h-[54px] rounded-md border border-[rgb(18,61,27)] shadow-lg transition-shadow duration-300 hover:shadow-xl focus:outline-none"
                                    value={values.subtipo || ""}
                                />
                            </div>

                            <div className="flex-1 min-w-[250px] text-start">
                                <label
                                    htmlFor="pesagem"
                                    className="font-medium text-sm text-[#133D1A] mb-2 block"
                                >
                                    Pesagem
                                </label>
                                <Field
                                    id="pesagem"
                                    name="pesagem"
                                    placeholder="Pesagem"
                                    className="w-[257px] h-[54px] rounded-md border border-[rgb(18,61,27)] shadow-lg transition-shadow duration-300 hover:shadow-xl focus:outline-none"
                                    value={values.pesagem || ""}
                                />
                            </div>

                            {/* <div className="w-full text-left">
                                <InputCheckbox
                                    id="relatorioFeito"
                                    name="relatorioFeito"
                                    titulo="Relatório do mês já ocorreu."
                                />
                            </div> */}

                            <div className="w-full text-left">
                                <Field
                                    id="relatorioFeito"
                                    name="relatorioFeito"
                                    className="w-5 h-5 mr-2 bg-white border-2 border-[#133D1A] rounded-md checked:bg-[#133D1A] checked:border-[#133D1A] focus:ring-2 focus:ring-[#133D1A]"
                                    checked={values.relatorioFeito || false}
                                />
                                <label
                                    htmlFor="relatorioFeito"
                                    className="font-medium text-sm text-[#133D1A]"
                                >
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
                                    className={`text-center w-[6.4rem] rounded-[30px] s-[20px] text-white ${isSubmitting ? "bg-gray-400" : "bg-[#133D1A]"} font-semibold`}
                                >
                                    {isSubmitting ? "Enviando..." : "Concluir"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default DonationForm;
