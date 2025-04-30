import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { VehicleService } from "../../services"; // Alterado o serviço para VehicleService
import { useNavigate } from 'react-router-dom';
import TableComponent from "../../components/TableComponent";

const VehicleList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<Array<any>>([]);
  const vehicleService = VehicleService; // Atualizado para usar o serviço VehicleService

  const fetchData = async (page: number | null) => {
    const response = await vehicleService.getAll(page);
    const transformedData = response?.data.map((item: any) => ({
      Placa: item.placa,
      Modelo: item.modelo,
    }));
    setData(transformedData);
  };

  const handleBack = () => {
    navigate("/distribution-menu");
  };

  const handleCreate = () => {
    navigate("/vehicle-create"); // Alterado para a rota de criação de veículo
  };

  useEffect(() => {
    fetchData(page);
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <Card className="rounded-[50px] p-6 w-[1000px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Veículos</h2> {/* Alterado para "Veículos" */}
        <Button
          titulo={"Criar novo Veículo"} // Alterado para criar novo veículo
          className="bg-green-600 text-white"
          onClick={handleCreate}
          type={undefined}
          disabled={undefined}
        />
      </div>

      <TableComponent
        columns={[
          'Placa',
          'Modelo',
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

export default VehicleList;
