import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { MediaService } from "../../services"; 
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const MediaList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const mediaService = MediaService;
    
    const fetchData = async (page: number | null) => {
        const response = await mediaService.getAll(page);
        setData(response?.data);
        return response?.data;
    };

    const handleBack = () => {
        navigate("/document-menu"); 
    };

    useEffect(() => {
        fetchData(page);
    }, []);

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleCreate = () => {
        navigate("/media-create"); 
    };

    return (
        <Card className="rounded-[50px] p-4 sm:p-6 w-full max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Mídias</h2>
                <Button
                    titulo={"Criar nova Mídia"}
                    className="bg-green-600 text-white"
                    onClick={handleCreate}
                />
            </div>
            
            <TableComponent 
                columns={[
                    'id',
                    'dados',
                ]}
                data={data}
            />
            
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
                <div className="mb-4 sm:mb-0">
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
                    <Button titulo="Exportar CSV" onClick={() => handleExport(fetchData, page, "media")} />
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

export default MediaList;
