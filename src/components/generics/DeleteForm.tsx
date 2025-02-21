import BaseService from "../../services/api/BaseService";
import { Model } from "../../services/api/Entities";
import React from "react";

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
    <div>
      <p>Tem certeza que deseja remover?</p>
      <button onClick={async () => {
        await restService.delete(id);
        setState({
          status: "LIST",
          id: null
        })
      }}
        className="p-1 bg-red-400 rounded-md text-white shadow-md mr-2 w-16"
      >
        Sim
      </button>
      <button onClick={() => {
        setState({
          status: "LIST",
          id: null
        })
      }}
        className="p-1 bg-gray-400 rounded-md text-white shadow-md mr-2 w-16"
      >Não</button>
    </div>
  )
}