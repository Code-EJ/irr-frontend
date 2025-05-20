import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { InputMaterialService, SubTypologyService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const InputMaterialList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const [subtypologyMap, setSubtypologyMap] = useState<Record<string, string>>({});
    const inputMaterialService = InputMaterialService;

    const fetchData = async (page: number | null) => {
        try {
            const [inputResponse, subtypologyResponse] = await Promise.all([
                inputMaterialService.getAll(page),
                SubTypologyService.getAll(1, 9999),
            ]);

            const subtypologies = subtypologyResponse?.data ?? [];
            const subMap: Record<string, string> = {};
            subtypologies.forEach((item: any) => {
                subMap[item.id] = item.nome;
            });
            setSubtypologyMap(subMap);
            

            const inputData = inputResponse?.data?.map((item: any) => ({
                ...item,
                subtipologia: subMap[item.subtipologiaId] ?? item.subtipologiaId,
            })) ?? [];

            setData(inputData);
        } catch (error) {
            console.error("Erro ao buscar materiais de entrada:", error);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleBack = () => {
        navigate("/stock-menu");
    };

    const handleCreate = () => {
        navigate("/input-material-create");
    };

    return (
        <Card className="rounded-[30px] p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-2xl font-bold">Materiais de Entrada</h2>
                <Button
                    titulo={"Criar novo Material de Entrada"}
                    className="bg-green-600 text-white"
                    onClick={handleCreate}
                />
            </div>

            <div className="overflow-x-auto">
                <TableComponent 
                    columns={[
                        'quantidade',
                        'tipo',
                        'subtipologia'
                    ]}
                    data={data}
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
                <div className="flex flex-wrap gap-2">
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
                    <Button titulo="Exportar CSV" onClick={() => handleExport(fetchData, page, "material-entrada")} />
                </div>
                <div className="flex items-center gap-2">
                    <b
                        className="underline text-[#0c4200] hover:cursor-pointer hover:text-[#082e00] p-4"
                        onClick={handleBack}
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

export default InputMaterialList;
