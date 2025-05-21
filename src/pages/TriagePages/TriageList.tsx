import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { TriageService, SubTypologyService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const TriageList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const [subtypologyMap, setSubtypologyMap] = useState<Record<string, string>>({});
    
    const fetchData = async (page: number | null) => {
        const [triageResponse, subtypologyResponse] = await Promise.all([
            TriageService.getAll(page),
            SubTypologyService.getAll(1, 9999),
        ]);

        const subtypologies = subtypologyResponse?.data ?? [];
        const subMap: Record<string, string> = {};
        subtypologies.forEach((item: any) => {
            subMap[item.id] = item.nome;
        });
        setSubtypologyMap(subMap);

        const triageData = triageResponse?.data.map((item: any) => ({
            ...item,
            subtipologia: subMap[item.subtipologiaId] ?? item.subtipologiaId,
        })) ?? [];

        setData(triageData);
    };

    const handleBack = () => {
        navigate("/treatment-menu");
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleCreate = () => {
        navigate("/triage-create");
    };

    return (
        <Card className="rounded-[50px] p-6 w-full max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Triagem</h2>
                <Button
                    titulo={"Criar nova Triagem"}
                    className="bg-green-600 text-white"
                    onClick={handleCreate}
                    type={undefined} 
                    disabled={undefined}
                />
            </div>

            <div className="overflow-x-auto">
                <TableComponent 
                    columns={[
                        'data',
                        'tipo',
                        'volumeTotal',
                        'volumeRejeito',
                        'tipoOrigem',
                        'tipoDestino',
                        'subtipologia'
                    ]}
                    data={data}
                    editUrl={"triage-update"}
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex space-x-2 sm:space-x-4">
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
                    <Button titulo="Gerar Relatórios" className="bg-green-600 text-white" />
                    <Button titulo="Exportar CSV" onClick={() => handleExport(fetchData, page, "triagem")} />
                </div>

                <div className="flex items-center space-x-2">
                    <b 
                        className="underline text-[#0c4200] hover:cursor-pointer hover:text-[#082e00] p-4" 
                        onClick={() => handleBack()}
                    >
                        Voltar
                    </b>
                    <Button 
                        className="text-white" 
                        titulo="<" 
                        onClick={() => setPage(page - 1)} 
                        disabled={page === 1} 
                    />
                    <span className="mx-2">{page}</span>
                    <Button 
                        className="text-white" 
                        titulo=">" 
                        onClick={() => setPage(page + 1)} 
                    />
                </div>
            </div>
        </Card>
    );
};

export default TriageList;
