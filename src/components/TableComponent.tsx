import { Pencil, Play } from "lucide-react";

const mockData = [
    { data: "2025-03-22", tipo: "Tipo A", volumeTotal: "100L", volumeRejeito: "10L", tipoOrigem: "Origem X", tipoDestino: "Destino Y", subtipologiaId: "123" },
    { data: "2025-03-23", tipo: "Tipo B", volumeTotal: "200L", volumeRejeito: "20L", tipoOrigem: "Origem Y", tipoDestino: "Destino Z", subtipologiaId: "124" },
    { data: "2025-03-24", tipo: "Tipo C", volumeTotal: "150L", volumeRejeito: "15L", tipoOrigem: "Origem Z", tipoDestino: "Destino X", subtipologiaId: "125" },
    { data: "2025-03-25", tipo: "Tipo D", volumeTotal: "180L", volumeRejeito: "18L", tipoOrigem: "Origem W", tipoDestino: "Destino V", subtipologiaId: "126" },
    { data: "2025-03-26", tipo: "Tipo E", volumeTotal: "220L", volumeRejeito: "22L", tipoOrigem: "Origem V", tipoDestino: "Destino U", subtipologiaId: "127" },
];

type TableProps = {
    columns: [];
    data: any;
}

const TableComponent = ({columns, data}: TableProps) => {
    return (
        <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        {columns.map((col) => (
                            <th className="p-2">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="border-t">
                            {columns.map((col) => (
                                <td className="p-2">{item[col]}</td>
                            ))}
                            <td className="p-2">
                                <Pencil className="cursor-pointer text-gray-500" />
                            </td>
                            <td className="p-2">
                                <Play className="cursor-pointer text-gray-500" />
                            </td>    
                        </tr>
                    ))}
                </tbody>
            </table> 
    )
}
export default TableComponent;