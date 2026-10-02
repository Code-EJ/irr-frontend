import { useCallback, useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { OutputMaterialService, SubTypologyService, DocumentService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const OutputMaterialList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<import("../../utils/ExportService").CSVRow>>([]);
    const [, setSubtypologyMap] = useState<Record<string, string>>({});
    const [notaFiscalMap, setNotaFiscalMap] = useState<Record<string, string>>({});

    const fetchData = useCallback(async (page: number | null) => {
        const [outputMaterialResponse, subtypologyResponse, notaFiscalResponse] = await Promise.all([
            OutputMaterialService.getAll(page),
            SubTypologyService.getAll(1, 9999),
            DocumentService.getAll(1, 9999),
        ]);

        const subtypologies = subtypologyResponse?.data ?? [];
        const subMap: Record<string, string> = {};
        subtypologies.forEach((item) => {
            subMap[item.id] = item.nome;
        });
        setSubtypologyMap(subMap);

        const notaFiscal = notaFiscalResponse?.data ?? [];
        const subMap2: Record<string, string> = {};
        notaFiscal.forEach((item) => {
            subMap2[item.id] = item.nome;
        });
        setNotaFiscalMap(subMap2);

        const outputMaterialData = outputMaterialResponse?.data.map((item) => ({
            ...item,
            subtipologia: subMap[item.subtipologiaId] ?? item.subtipologiaId,
            notaFiscal: notaFiscalMap[item.notaFiscalId] ?? item.notaFiscalId,
        })) ?? [];
        setData(outputMaterialData);
        return outputMaterialData;
    }, [notaFiscalMap]);

useEffect(() => {
        fetchData(page);
    }, [fetchData, page]);

    const handleBack = () => {
        navigate("/stock-menu");
    };

    const handleCreate = () => {
        navigate("/output-material-create");
    };

    return (
        <Card className="rounded-[50px] p-6 w-full max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Materiais de Saída</h2>
                <Button
                    titulo={"Criar novo Material de Saída"}
                    className="bg-green-600 text-white mt-4 sm:mt-0"
                    onClick={handleCreate}
                />
            </div>
            <div className="w-full overflow-x-auto">
                <TableComponent
                    columns={[
                        'quantidade',
                        'notaFiscal',
                        'subtipologia'
                    ]}
                    data={data}
                    editUrl={"output-material-update"}
                />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
                <div className="flex flex-wrap gap-2">
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
                    <Button titulo="Exportar CSV" onClick={() => handleExport(fetchData, page, "material-saida")} />
                </div>
                <div className="flex items-center mt-4 sm:mt-0">
                    <b
                        className="underline text-[#0c4200] hover:cursor-pointer hover:text-[#082e00] p-4"
                        onClick={handleBack}
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

export default OutputMaterialList;
