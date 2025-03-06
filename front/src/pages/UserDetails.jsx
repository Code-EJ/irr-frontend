import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { Formik, Form } from "formik";
import SimpleForm from "../components/SimpleForm";
import InputText from "../components/InputText";

const UserDetails = () => {
    const onSubmit = (values) => {
        console.log("Form Submitted with values:", values);
    };

    return (
        <div className="flex flex-col justify-center text-start min-h-screen bg-[#2E4F2F]">
            <SimpleForm onSubmit={onSubmit} initialValues={{}}>
                {() => (
                    <>

                        <header className="flex flex-col w-full shadow-md p-16 bg-green-900">
                            <h1 className="text-2xl font-semibold text-[32px]">Nome Sobrenome</h1>
                            <h2 className="text-2xl text-[22px]">Cargo</h2>
                        </header>

                        <div className="flex justify-center mt-20 min-h-screen">
                            <Card className="w-3/4 max-w-5xl h-80 p-12 shadow-xl rounded-2xl bg-green-900 relative">
                                <div className="flex flex-col text-2xl text-[24px] text-white space-y-4">
                                    <h3>E-mail: </h3>
                                    <h3>CPF/CNPJ: </h3>
                                    <h3>Data de Cadastro: </h3>
                                </div>
                                <button
                                    type="button"
                                    className="text-[22px] text-white underline text-underline-offset-10 font-semibold mt-6 absolute right-10 bottom-6"
                                >
                                    Voltar
                                </button>
                            </Card>
                        </div>
                    </>
                )}
            </SimpleForm>
        </div >
    );
};

export default UserDetails;
