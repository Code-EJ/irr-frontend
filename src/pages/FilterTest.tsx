import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import FilterDropdown from "../components/FilterDropdown";
import { useFilterStore } from "../services/FilterState";

const dataModels: { [key: string]: string[] } = {
  Categorias: ["Tecnologia", "Saúde", "Educação"],
  Preço: ["Baixo", "Médio", "Alto"],
  Estoque: ["Disponível", "Esgotado"],
};

const FilterTest: React.FC = () => {
  const { filters, setFilter, clearFilters } = useFilterStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="relative">
        <div
          className="flex items-center cursor-pointer text-black hover:underline"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Filtro</span>
          <ChevronDown className="w-4 h-4 ml-1" />
        </div>

        <div className={`absolute left-0 mt-2 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <div className="flex flex-col gap-4 bg-white shadow-md p-4 rounded-md">
            {Object.entries(dataModels).map(([key, options]) => (
              <FilterDropdown
                key={key}
                label={key}
                options={options}
                selected={filters[key] || []}
                onSelect={(value) => setFilter(key, value)}
              />
            ))}
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={clearFilters}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      <pre className="mt-4 p-4 bg-gray-100 rounded">{JSON.stringify(filters, null, 2)}</pre>
    </div>
  );
};

export default FilterTest;
