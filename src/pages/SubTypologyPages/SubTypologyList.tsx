import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { SubTypologyService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";

const SubTypologyList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const subTypologyService = SubTypologyService;

    const fetchData = async (page: number | null) => {
        const response = await subTypologyService.getAll(page);
        setData(response?.data);
    };

    const handleBack = () => {
        navigate("/materials-menu");  // Assuming there's a "tipology-menu" page to go back to.
    };

    useEffect(() => {
        fetchData(page);
    }, []);

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleCreate = () => {
        navigate("/subtypology-create");
    };

    return (
        <Card className="rounded-[50px] p-6 w-[1000px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Subtipologias</h2>
                <Button
                    titulo={"Criar nova Subtipologia"}
                    className="bg-green-600 text-white"
                    onClick={handleCreate}
                />
            </div>
            
            <TableComponent 
                columns={[
                    'id',
                    'nome',
                    'valor',
                    'tipologiaId' // Consider including the tipologiaId for reference
                ]}
                data={data}
            />

            <div className="flex justify-between items-center mt-4">
                <div>
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
                    <Button titulo="Gerar Relatórios" className="bg-green-600 text-white ml-2" />
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

export default SubTypologyList;
