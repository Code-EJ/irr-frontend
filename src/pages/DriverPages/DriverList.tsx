import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { DriverService } from "../../services";
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";
import { handleExport } from "../../utils/ExportService";

const DriverList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<Array<any>>([]);
  const driverService = DriverService;

  const fetchData = async (page: number | null) => {
    const response = await driverService.getAll(page);
    setData(response?.data);
    return response?.data;
  };

  const handleBack = () => {
    navigate("/distribution-menu");
  };

  const handleCreate = () => {
    navigate("/driver-create");
  };

  useEffect(() => {
    fetchData(page);
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <Card className="rounded-[30px] p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold">Motorista</h2>
        <Button
          titulo={"Criar novo motorista"}
          className="bg-green-600 text-white"
          onClick={handleCreate}
          type={undefined}
          disabled={undefined}
        />
      </div>

      <div className="overflow-x-auto">
        <TableComponent
          columns={["id", "nome", "cpf"]}
          data={data}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
        <div className="flex flex-wrap gap-2">
          <Button titulo="Excluir selecionados" className="bg-red-600 text-white" />
          <Button titulo="Gerar Relatórios" className="bg-green-600 text-white" />
          <Button titulo="Exportar CSV" onClick={() => handleExport(fetchData, page, "motoristas")} />
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
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          />
          <span className="mx-2">{page}</span>
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

export default DriverList;
