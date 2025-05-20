import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { PressingService, SubTypologyService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const PressingList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const [subtypologiesMap, setSubtypologiesMap] = useState<Record<string, string>>({});
    const pressingService = PressingService;

    // Buscar e armazenar as subtipologias uma única vez
    useEffect(() => {
        const fetchSubtypologies = async () => {
            const response = await SubTypologyService.getAll(1, 9999);
            const map: Record<string, string> = {};
            (response?.data ?? []).forEach((item: any) => {
                map[item.id] = item.nome;
            });
            setSubtypologiesMap(map);
        };
        fetchSubtypologies();
    }, []);

    useEffect(() => {
        fetchData(page);
    }, [page, subtypologiesMap]);

    const fetchData = async (page: number | null) => {
        const response = await pressingService.getAll(page);
        const transformedData = response?.data.map((item: any) => ({
            ...item,
            subtipologia: subtypologiesMap[item.subtipologiaId] ?? "N/A"
        }));
        setData(transformedData);
        return transformedData;
    };

    const handleBack = () => {
        navigate("/treatment-menu");
    };

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
                        'data',
                        'volumeTotal',
                        'tipoOrigem',
                        'tipoDestino',
                        'subtipologia'
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
