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

    const fetchData = async (pageNumber: number) => {
        try {
            const response = await documentService.getAll(pageNumber);
            setData(response?.data || []);
            return response?.data || [];
        } catch (error) {
            console.error("Erro ao buscar documentos:", error);
            setData([]);
            return [];
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleBack = () => {
        navigate("/menu");
    };

    const handleCreate = () => {
        navigate("/document-create");
    };

    const renderMediaFile = (media: any) => {
        if (!media || !media.dados) return "Sem arquivo";

        const base64Data = media.dados;
        const mimeType = media.tipo || "application/octet-stream";

        let fileName = media.nome || "arquivo";

        if (!fileName.includes('.')) {
            const mimeToExt: { [key: string]: string } = {
                "application/pdf": "pdf",
                "image/jpeg": "jpg",
                "image/png": "png",
                "image/gif": "gif",
                "text/plain": "txt",
            };

            const ext = mimeToExt[mimeType.toLowerCase()] || "bin";
            fileName = `${fileName}.${ext}`;
        }

        const href = `data:${mimeType};base64,${base64Data}`;

        return (
            <a
                href={href}
                download={fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
            >
                {fileName}
            </a>
        );
    };

    // Importante incluir o id aqui para o TableComponent usar no redirect
    const tableData = data.map((doc) => ({
        id: doc.id,
        nome: doc.nome,
        dataDocumento: doc.dataDocumento,
        dataInsercao: doc.dataInsercao,
        tipo: doc.tipo,
        media: renderMediaFile(doc.media),
    }));

    return (
        <Card className="rounded-[30px] p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold">Documentos</h2>
                <Button
                    titulo="Criar novo Documento"
                    className="bg-green-600 text-white w-full sm:w-auto"
                    onClick={handleCreate}
                />
            </div>

            <div className="overflow-x-auto">
                <TableComponent
                    columns={[
                        "nome",
                        "dataDocumento",
                        "dataInsercao",
                        "tipo",
                        "media",
                    ]}
                    data={tableData}
                    editUrl="/document-update" // rota base para edição + id
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
                <div className="flex flex-wrap gap-2">
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
                    <Button titulo="Gerar Relatórios" className="bg-green-600 text-white" />
                    <Button
                        titulo="Exportar CSV"
                        onClick={() => handleExport(fetchData, page, "documentos")}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <b
                        className="underline text-[#0c4200] hover:cursor-pointer hover:text-[#082e00] px-2"
                        onClick={handleBack}
                    >
                        Voltar
                    </b>
                    <Button
                        className="text-white"
                        titulo="<"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    />
                    <span>{page}</span>
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

export default DocumentList;
