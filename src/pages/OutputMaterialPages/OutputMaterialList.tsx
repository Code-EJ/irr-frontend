import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { OutputMaterialService, SubTypologyService } from "../../services"; // Alteração no serviço
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";

const OutputMaterialList = () => { // Nome da página alterado para OutputMaterial
    const navigate = useNavigate();
    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<Array<any>>([]);
    const [subtipologias, setSubtipologias] = useState<{ name: string; value: string }[]>([]);
    const outputMaterialService = OutputMaterialService; // Alteração no serviço

    // Função para buscar subtipologias
    const fetchSubtipologies = async () => {
        try {
            const response = await SubTypologyService.getAll(1, 9999); // Ajuste de acordo com sua API
            const subtipologias = response?.data ?? [];
            const mapped = subtipologias.map((item: { nome: string; id: string }) => ({
                name: item.nome,
                value: item.id,
            }));
            setSubtipologias(mapped);
        } catch (error) {
            console.error("Erro ao carregar subtipologias:", error);
        }
    };

    // Função para buscar dados de OutputMaterial
    const fetchData = async (page: number | null) => {
        try {
            const response = await outputMaterialService.getAll(page); // Alteração para OutputMaterialService
            setData(response?.data);
        } catch (error) {
            console.error("Erro ao buscar materiais de saída:", error);
        }
    };

    useEffect(() => {
        fetchSubtipologies(); // Carregar as subtipologias
        fetchData(page); // Buscar materiais de saída ao carregar o componente
    }, []);

    useEffect(() => {
        fetchData(page); // Buscar dados sempre que a página for alterada
    }, [page]);

    const handleBack = () => {
        navigate("/stock-menu"); // Voltar para o menu de estoque
    };

    const handleCreate = () => {
        navigate("/output-material-create"); // Navegar para a página de criação de Material de Saída
    };

    return (
        <Card className="rounded-[50px] p-6 w-[1000px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Materiais de Saída</h2>
                <Button
                    titulo={"Criar novo Material de Saída"} // Alterado para Material de Saída
                    className="bg-green-600 text-white"
                    onClick={handleCreate}
                />
            </div>

            <TableComponent 
                columns={[
                    'id',
                    'quantidade',
                    'notaFiscalId', // Alterado para exibir notaFiscalId
                    'subtipologiaId' // Alterado para exibir subtipologiaId
                ]}
                data={data}
            />

            <div className="flex justify-between items-center mt-4">
                <div>
                    <Button titulo="Excluir selecionados" className="bg-red-600 text-white"></Button>
                    <Button titulo="Gerar Relatórios" className="bg-green-600 text-white ml-2"></Button>
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

export default OutputMaterialList;
