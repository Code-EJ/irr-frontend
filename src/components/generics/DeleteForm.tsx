import BaseService from "../../bases/BaseService";
import { Model } from "../../models/Entities";

export function DeleteForm<E extends Model>(
  { setState,
    id,
    restService }: {
      setState: any;
      id: string;
      restService: BaseService<E>
    }
) {
  return (
    <div className=" p-4 bg-beige-100 rounded-md shadow-md">
      <p className=" text-lg text-gray-700 mb-4">Tem certeza que deseja remover?</p>
      <button onClick={async () => {
        await restService.delete(id);
        setState({
          status: "LIST",
          id: null
        })
      }}
        className="p-2 bg-green-500 hover:bg-green-700 rounded-md text-white shadow-md mr-2 w-20"
      >
        Sim
      </button>
      <button onClick={() => {
        setState({
          status: "LIST",
          id: null
        })
      }}
        className="p-2 bg-red-500 hover:bg-red-700 rounded-md text-white shadow-md w-20"
      >Não</button>
    </div>
  )
}