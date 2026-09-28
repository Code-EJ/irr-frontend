import { useCallback, useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { DonatorService } from "../../services";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const DonatorList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<Array<import("../../utils/ExportService").CSVRow>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  const fetchData = useCallback(async (page: number | null) => {
    try {
      setLoading(true);
      const response = await DonatorService.getAll(page);

      if (!response || !response.data) {
        setData([]);
        return [];
      }

      const transformedData = response.data.map((item) => ({
        Nome: item.nome,
        Endereço: item.endereco,
        Tipo: item.tipo === "PESSOA_FISICA" ? "Pessoa Física" : "Pessoa Jurídica",
        "Cadastro Nacional": item.cadastroNacional,
      }));

      setData(transformedData);
      setHasNextPage(response.data.length > 0);
      return transformedData;
    } catch (error) {
      console.error("Erro ao buscar doadores:", error);
      setData([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBack = () => navigate("/distribution-menu");
  const handleCreate = () => navigate("/donator-create");

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  return (
    <Card className="rounded-[30px] p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold">Doadores</h2>
        <Button
          titulo="Criar novo Doador"
          className="bg-green-600 text-white"
          onClick={handleCreate}
        />
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <TableComponent
            columns={["Nome", "Endereço", "Tipo", "Cadastro Nacional"]}
            data={data}
            editUrl={"donator-update"}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
        <div className="flex flex-wrap gap-2">
          <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
          <Button
            titulo="Exportar CSV"
            onClick={() => handleExport(fetchData, page, "Doadores")}
          />
        </div>
        <div className="flex items-center gap-2">
          <b
            className="underline text-[#0c4200] hover:cursor-pointer hover:text-[#082e00] p-4"
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
          <span className="mx-2">{page}</span>
          <Button
            className="text-white"
            titulo=">"
            onClick={() => {
              if (hasNextPage) setPage((prev) => prev + 1);
            }}
            disabled={!hasNextPage}
          />
        </div>
      </div>
    </Card>
  );
};

export default DonatorList;
