import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { SaleService } from "../../services"; // Atualizado para SaleService
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const SalesList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const saleService = SaleService;

    const fetchData = async (page: number | null) => {
        const response = await saleService.getAll(page);
        setData(response?.data);
        return response?.data;
    };

    const handleBack = () => {
        navigate("/menu"); // Você pode mudar a rota se quiser outra página inicial
    };

    useEffect(() => {
        fetchData(page);
    }, []);

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleCreate = () => {
        navigate("/sales-create"); // Atualizado para rota de criar Sales
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
                        'id',
                        'comprador',
                        'data',
                        'valor',
                        'notaFiscalId',
                        'mtrGeradorId',
                        'mtrTransportadorId',
                        'mtrDestinadorId',
                    ]}
                    data={data}
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
