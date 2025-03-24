import Card from "../components/Card";
import LoginImage from "../assets/background.png";
import fontCard from "../assets/fonts/Montserrat-Regular.ttf";
import Button from "../components/Button";
import SimpleForm from "../components/SimpleForm";
import InputText from "../components/InputText";
import { useEffect, useState } from "react";
import axios from "axios";

const ScreeningTuple = () => {
    const { id } = useParams();
    const [info, setInfo] = useState();

    useEffect(() => {
        triageService.get('http://localhost:3001/entidade')
            .then((response) => setInfo(response.data))
            .catch(err => console.log(err.data))
    }, [id])

    return (
        <div className="w-screen h-screen bg-gray-900 flex flex-row content-center items-center justify-center">
            <Card className="w-[500px] h-[500px] flex rounded-[40px] flex-col bg-white p-10 shadow-lg">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">Entidade</h1>

                <div className="grid grid-cols-2 gap-4 border border-gray-700 p-4 rounded-lg bg-gray-100">
                    {info && (
                        info.map((t, index) => (
                        <div key={index} className="border border-gray-600 p-3 text-center text-gray-900 bg-white rounded-md shadow-sm">
                            {t}
                        </div>
                    )))}
                </div>

                <div className="flex flex-row gap-4 mt-6 justify-center ">
                    <button
                        type="button"
                        className="text-start s-[20px] text-[#133D1A]"
                    >
                        Voltar
                    </button>
                    <button
                        type="button"
                        className="text-start s-[20px] text-[#133D1A]"
                    >
                        Editar
                    </button>
                    <button
                        type="button"
                        className="text-start s-[20px] text-[#133D1A]"
                    >
                        Excluir
                    </button>
                    <button
                        type="button"
                        className="text-start s-[20px] text-[#133D1A] bg-text-[#133D1A] "
                    >
                        Gerar Relatório
                    </button>
                </div>
            </Card>

        </div>
    );
}

export default ScreeningTuple;