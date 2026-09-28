import { Pencil, Play } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type TableProps = {
    columns: string[];
    data: Record<string, React.ReactNode>[];
    editUrl: string | undefined;
}

const TableComponent = ({ columns, data, editUrl }: TableProps) => {
    const navigate = useNavigate();
    const redirectEdit = (url: string | undefined, id: string) => {
        if (url && id) {
            navigate(`/${url}/${id}`);
        } else {
            toast.error("Erro ao redirecionar para a pagina de edição.");
        }
    }

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
                            <Pencil className="cursor-pointer text-gray-500" onClick={() => redirectEdit(editUrl, String(item.id ?? ""))} />
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