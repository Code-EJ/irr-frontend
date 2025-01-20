/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { apiClient } from "../services/ApiClient";
import { successToast, errorToast } from "../services/ToastServices";
import Button from "../components/Button";

const CollectionList = () => {
  const exampleCollections = [
    { id: 1, numero: "001", data: "10/01/2025", hora: "14:30" },
    { id: 2, numero: "002", data: "11/01/2025", hora: "09:15" },
    { id: 3, numero: "003", data: "12/01/2025", hora: "16:45" },
    { id: 4, numero: "004", data: "13/01/2025", hora: "08:20" },
    { id: 5, numero: "005", data: "14/01/2025", hora: "11:00" },
    { id: 6, numero: "006", data: "15/01/2025", hora: "10:05" },
  ];

  const [collections, setCollections] = useState(exampleCollections);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCollections = async (page = 1) => {
    try {
      const response = await apiClient.get(`/Collections?page=${page}`);
      if (response.status === 200) {
        setCollections(response.data.data);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      errorToast("Erro ao carregar as Coletas.");
    }
  };

  const handleGenerateRandomReport = async () => {
    try {
      const response = await apiClient.post("/reports/random");
      if (response.status === 200) {
        successToast("Relatório aleatório gerado com sucesso!");
      }
    } catch (error) {
      errorToast("Erro ao gerar relatório aleatório.");
    }
  };

  const handleGenerateCustomReport = async () => {
    try {
      const response = await apiClient.post("/reports/custom");
      if (response.status === 200) {
        successToast("Relatório personalizado gerado com sucesso!");
      }
    } catch (error) {
      errorToast("Erro ao gerar relatório personalizado.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchCollections(newPage);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-around items-center bg-green-900">
        {/* Botões de ações */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleGenerateRandomReport}
            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Gerar um relatório aleatório
          </button>
          <button
            onClick={handleGenerateCustomReport}
            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Gerar um relatório personalizado
          </button>
        </div>

        {/* Card com a tabela de Coletas */}
        <Card className="w-full max-w-4xl rounded-[40px]">
          <div className="p-4">
            <h3 className="text-xl font-bold text-center mb-4">Coletas</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    nº relatório
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    data
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    hora
                  </th>
                </tr>
              </thead>
              <tbody>
                {collections.length > 0 ? (
                  collections.map((coleta) => (
                    <tr key={coleta.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {coleta.numero}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {coleta.data}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {coleta.hora}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="border border-gray-300 px-4 py-2 text-center"
                    >
                      Nenhuma coleta encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 text-gray-600 hover:underline"
              titulo="ANTERIOR"
            />
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 text-gray-600 hover:underline"
              titulo="Proxima pagina"
            />
          </div>
        </Card>
    </div>
  );
};

export default CollectionList;
