import { useCallback, useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { SaleService, DocumentService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const SalesList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<import("../../utils/ExportService").CSVRow>>([]);
    const [, setDocumentMap] = useState<Record<string, string>>({});

    const fetchData = useCallback(async (page: number | null) => {
        const [saleResponse, documentResponse] = await Promise.all([
            SaleService.getAll(page),
            DocumentService.getAll(1, 9999),
        ]);

        const documents = documentResponse?.data ?? [];

        const docMap: Record<string, string> = {};
        documents.forEach((item) => {
            docMap[item.id] = item.nome ?? item.numero;
        });
        setDocumentMap(docMap);

        const formattedData = saleResponse?.data.map((item) => ({
            ...item,
            mtrGerador: docMap[item.mtrGeradorId] ?? item.mtrGeradorId,
            mtrDestinador: docMap[item.mtrDestinadorId] ?? item.mtrDestinadorId,
            mtrTransportador: docMap[item.mtrTransportadorId] ?? item.mtrTransportadorId,
            notaFiscal: docMap[item.notaFiscalId] ?? item.notaFiscalId,
        })) ?? [];

        setData(formattedData);
        return formattedData;
    }, []);

    const handleBack = () => {
        navigate("/menu");
    };

useEffect(() => {
        fetchData(page);
    }, [fetchData, page]);

    const handleCreate = () => {
        navigate("/sales-create");
    };

    return (
        <Card className="rounded-[50px] p-4 sm:p-6 w-full max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Vendas</h2>
                <Button
                    titulo={"Criar nova Venda"}
                    className="bg-green-600 text-white"
                    onClick={handleCreate}
                />
            </div>

            <div className="overflow-x-auto">
                <TableComponent 
                    columns={[
                        'comprador',
                        'data',
                        'valor',
                        'notaFiscal',
                        'mtrGerador',
                        'mtrTransportador',
                        'mtrDestinador',
                    ]}
                    data={data}
                    editUrl={"sales-update"}
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 flex-wrap">
                <div className="flex mb-2 sm:mb-0">
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white mr-2" />
                    <Button titulo="Exportar CSV" onClick={() => handleExport(fetchData, page, "vendas")} />
                </div>
                <div className="flex items-center">
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

export default SalesList;
