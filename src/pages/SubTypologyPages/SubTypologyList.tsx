import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { SubTypologyService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const SubTypologyList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const subTypologyService = SubTypologyService;

    const fetchData = async (page: number | null) => {
        const response = await subTypologyService.getAll(page);
        setData(response?.data);
        return response?.data;
    };

    const handleBack = () => {
        navigate("/materials-menu");
    };

    useEffect(() => {
        fetchData(page);
    }, []);

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleCreate = () => {
        navigate("/subtypology-create");
    };

    return (
        <Card className="rounded-[50px] p-4 sm:p-6 w-full max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Subtipologias</h2>
                <Button
                    titulo={"Criar nova Subtipologia"}
                    className="bg-green-600 text-white"
                    onClick={handleCreate}
                />
            </div>
            
            <TableComponent 
                columns={[
                    'id',
                    'nome',
                    'valor',
                    'tipologiaId'
                ]}
                data={data}
            />

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:flex-wrap">
                <div className="flex flex-wrap gap-2">
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
                    <Button titulo="Exportar CSV" onClick={() => handleExport(fetchData, page, "sub-tipologia")} />
                </div>
                <div className="flex items-center mt-2 sm:mt-0">
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

export default SubTypologyList;
