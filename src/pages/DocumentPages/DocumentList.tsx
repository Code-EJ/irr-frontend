import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { DocumentService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const DocumentList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const documentService = DocumentService;

    const fetchData = async (page: number | null) => {
        const response = await documentService.getAll(page);
        setData(response?.data)
        return response?.data;
    };

    const handleBack = () => {
        navigate("/menu");
    };

    useEffect(() => {
        fetchData(page);
    }, []);

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleCreate = () => {
        navigate("/document-create");
    };

    return (
        <Card className="rounded-[30px] p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold">Documentos</h2>
                <Button
                    titulo="Criar novo Documento"
                    className="bg-green-600 text-white w-full sm:w-auto"
                    onClick={handleCreate}
                    type={undefined}
                    disabled={undefined}
                />
            </div>

            <div className="overflow-x-auto">
                <TableComponent
                    columns={[
                        'nome',
                        'dataDocumento',
                        'dataInsercao',
                        'tipo',
                        'mediaId',
                    ]}
                    data={data}
                    editUrl={"document-update"}
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
                <div className="flex flex-wrap gap-2">
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
                    <Button titulo="Gerar Relatórios" className="bg-green-600 text-white" />
                    <Button titulo="Exportar CSV" onClick={() => handleExport(fetchData, page, 'documentos')} />
                </div>

                <div className="flex items-center gap-2">
                    <b
                        className="underline text-[#0c4200] hover:cursor-pointer hover:text-[#082e00] px-2"
                        onClick={handleBack}
                    >
                        Voltar
                    </b>
                    <Button className="text-white" titulo="<" onClick={() => setPage(page - 1)} disabled={page === 1} />
                    <span>{page}</span>
                    <Button className="text-white" titulo=">" onClick={() => setPage(page + 1)} />
                </div>
            </div>
        </Card>

    );
};

export default DocumentList;
