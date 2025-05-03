import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { CollectionService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const CollectionList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const collectionService = CollectionService;

    const fetchData = async (page: number | null) => {
        const response = await collectionService.getAll(page);
        setData(response?.data);
        return response?.data;
    };

    const handleBack = () => {
        navigate("/distribution-menu");
    };

    useEffect(() => {
        fetchData(page);
    }, []);

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleCreate = () => {
        navigate("/collection-create");
    };

    return (
        <Card className="rounded-[50px] p-6 w-[1000px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Coletas</h2>
                <Button
                    titulo={"Criar nova Coleta"}
                    className="bg-green-600 text-white"
                    onClick={handleCreate}
                    type={undefined} disabled={undefined}
                />
            </div>

            <TableComponent 
                columns={[
                    'id',
                    'dataRealizacao',
                    'dataChegada',
                    'dataSaida',
                    'pesagem',
                    'quilometragem',
                    'veiculo.placa',
                    'motorista.nome',
                    'mtrGerador.numero',
                    'mtrDestinador.numero',
                    'mtrTransportador.numero',
                    'diarioColeta.numero'
                ]}
                data={data}
            />

            <div className="flex justify-between items-center mt-4">
                <div>
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
                    <Button titulo="Gerar Relatórios" className="bg-green-600 text-white ml-2" />
                    <Button titulo="Exportar CSV"  onClick={() => handleExport(fetchData, page, "colections")} />
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

export default CollectionList;
