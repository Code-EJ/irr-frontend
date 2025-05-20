import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { DonationService, DonatorService, TypologyService, SubTypologyService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const DonationList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const [typologyMap, setTypologyMap] = useState<Record<string, string>>({});
    const [subTypologyMap, setSubTypologyMap] = useState<Record<string, string>>({});
    const [donatorMap, setDonatorMap] = useState<Record<string, string>>({});

    const fetchData = async (page: number | null) => {
        const [donations, typologies, subTypologies, donators] = await Promise.all([
            DonationService.getAll(page),
            TypologyService.getAll(1, 9999),
            SubTypologyService.getAll(1, 9999),
            DonatorService.getAll(1, 9999),
        ]);

        const typologyMap: Record<string, string> = {};
        typologies?.data?.forEach((item: any) => {
            typologyMap[item.id] = item.nome;
        });
        setTypologyMap(typologyMap);

        const subTypologyMap: Record<string, string> = {};
        subTypologies?.data?.forEach((item: any) => {
            subTypologyMap[item.id] = item.nome;
        });
        setSubTypologyMap(subTypologyMap);

        const donatorMap: Record<string, string> = {};
        donators?.data?.forEach((item: any) => {
            donatorMap[item.id] = item.nome ?? item.email;
        });
        setDonatorMap(donatorMap);

        const formattedData = donations?.data?.map((item: any) => ({
            ...item,
            tipologia: typologyMap[item.tipologiaId] ?? item.tipologiaId,
            subtipologia: subTypologyMap[item.subtipologiaId] ?? item.subtipologiaId,
            doador: donatorMap[item.doadorId] ?? item.doadorId,
        })) ?? [];

        setData(formattedData);
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
        navigate("/donation-create");
    };

    return (
        <Card className="rounded-[30px] p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-2xl font-bold">Doações</h2>
                <Button
                    titulo={"Criar nova doação"}
                    className="bg-green-600 text-white"
                    onClick={handleCreate}
                />
            </div>

            <div className="overflow-x-auto">
                <TableComponent 
                    columns={[
                        "tipologia",
                        "subtipologia",
                        "pesagem",
                        "doador",
                    ]}
                    data={data}
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
                <div className="flex flex-wrap gap-2">
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
                    <Button titulo="Exportar CSV" onClick={() => handleExport(fetchData, page, "doacoes")} />
                </div>
                <div className="flex items-center gap-2">
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

export default DonationList;
