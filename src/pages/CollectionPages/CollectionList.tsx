import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { CollectionService, VehicleService, DriverService, DocumentService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const CollectionList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const [vehicleMap, setVehicleMap] = useState<Record<string, string>>({});
    const [driverMap, setDriverMap] = useState<Record<string, string>>({});
    const [documentMap, setDocumentMap] = useState<Record<string, string>>({});

    const fetchData = async (page: number | null) => {
        const [collectionResponse, vehicleResponse, driverResponse, documentResponse] = await Promise.all([
            CollectionService.getAll(page),
            VehicleService.getAll(1, 9999),
            DriverService.getAll(1, 9999),
            DocumentService.getAll(1, 9999),
        ]);

        const vehicles = vehicleResponse?.data ?? [];
        const drivers = driverResponse?.data ?? [];
        const documents = documentResponse?.data ?? [];

        const vehicleMap: Record<string, string> = {};
        vehicles.forEach((item: any) => {
            vehicleMap[item.id] = item.placa ?? `${item.nome} (${item.tipo})`;
        });
        setVehicleMap(vehicleMap);

        const driverMap: Record<string, string> = {};
        drivers.forEach((item: any) => {
            driverMap[item.id] = item.nome ?? item.email;
        });
        setDriverMap(driverMap);

        const docMap: Record<string, string> = {};
        documents.forEach((item: any) => {
            docMap[item.id] = item.nome ?? item.numero;
        });
        setDocumentMap(docMap);

        const formattedData = collectionResponse?.data.map((item: any) => ({
            ...item,
            veiculo: vehicleMap[item.veiculoId] ?? item.veiculoId,
            motorista: driverMap[item.motoristaId] ?? item.motoristaId,
            mtrGerador: docMap[item.mtrGeradorId] ?? item.mtrGeradorId,
            mtrDestinador: docMap[item.mtrDestinadorId] ?? item.mtrDestinadorId,
            mtrTransportador: docMap[item.mtrTransportadorId] ?? item.mtrTransportadorId,
            diarioColeta: docMap[item.diarioColetaId] ?? item.diarioColetaId,
        })) ?? [];

        setData(formattedData);
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

    const handleBack = () => {
        navigate("/distribution-menu");
    };

    return (
        <Card className="rounded-[50px] p-6 w-full max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Coletas</h2>
                <Button
                    titulo="Criar nova Coleta"
                    className="bg-green-600 text-white mt-4 sm:mt-0"
                    onClick={handleCreate}
                />
            </div>
            <div className="w-full overflow-x-auto">
                <TableComponent
                    columns={[
                        'dataRealizacao',
                        'dataChegada',
                        'dataSaida',
                        'pesagem',
                        'quilometragem',
                        'veiculo',
                        'motorista',
                        'mtrGerador',
                        'mtrDestinador',
                        'mtrTransportador',
                        'diarioColeta'
                    ]}
                    data={data}
                    editUrl="collection-update"
                />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
                <div className="flex flex-wrap gap-2">
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
                    <Button titulo="Exportar CSV" onClick={() => handleExport(fetchData, page, "coletas")} />
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

export default CollectionList;
