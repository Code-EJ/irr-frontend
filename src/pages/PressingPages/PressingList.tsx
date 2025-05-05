import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { PressingService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const PressingList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const pressingService = PressingService;

    const fetchData = async (page: number | null) => {
        const response = await pressingService.getAll(page);
        setData(response?.data);
        return response?.data;
    };

    const handleBack = () => {
        navigate("/treatment-menu");
    };

    useEffect(() => {
        fetchData(page);
    }, []);

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleCreate = () => {
        navigate("/pressing-create"); 
    };

    return (
        <Card className="rounded-[50px] p-4 sm:p-6 w-full max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Prensagem</h2> 
                <Button
                    titulo={"Criar nova Prensagem"}
                    className="bg-green-600 text-white"
                    onClick={handleCreate}
                />
            </div>

            <div className="overflow-x-auto">
                <TableComponent
                    columns={[
                        'id',
                        'data',
                        'volumeTotal',
                        'tipoOrigem',
                        'tipoDestino',
                        'subtipologiaId' 
                    ]}
                    data={data}
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex flex-wrap space-x-4">
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white"></Button>
                    <Button titulo="Exportar CSV" onClick={() => handleExport(fetchData, page, "Prensagem")} />
                </div>
                <div className="flex items-center">
                    <b
                        className="underline text-[#0c4200] hover:cursor-pointer hover:text-[#082e00] p-4"
                        onClick={() => handleBack()}
                    >
                        Voltar
                    </b>
                    <Button className="text-white" titulo="<" onClick={() => setPage(page - 1)} disabled={page === 1} />
                    <span className="mx-2">{page}</span>
                    <Button className="text-white" titulo=">" onClick={() => setPage(page + 1)} />
                </div>
            </div>
        </Card>
    );
};

export default PressingList;
