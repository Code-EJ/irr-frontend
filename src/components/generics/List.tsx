import { useEffect, useState } from "react";
import { Model } from "../../services/api/Entities";
import BaseService from "../../services/api/BaseService";
import { toast } from "react-toastify";
import React from "react";
import api from "../../services/api/Api";
import { PageState } from "../../pages/DriverPoC";

function List<E extends Model>({
  restService,
  fields,
  setState
}: {
  restService: BaseService<E>,
  fields: string[],
  setState: React.Dispatch<React.SetStateAction<PageState>>
}) {
  const [objects, setObjects] = useState<E[]>();

  useEffect(() => {
    async function getUpdatedObjects() {
      const updatedData = await restService.getAll();

      if (updatedData) setObjects(updatedData);
      // TODO: O backend já retorna essas mensagens. Trocar pelas mensagens do backend.
      else toast("Não foi possível recuperar o registro.");
    }

    if (!objects) getUpdatedObjects();
  }, []);
  return (
    <table className="table-fixed w-full">
      <thead>

        <tr className="border-collapse border-2 border-black">
          {fields.map(field => <th className="border-2 border-black p-1" key={field}>{field}</th>)}
          <th className="border-2 border-black p-1">
            <button onClick={() => setState({
              status: "create"
            })} className="bg-blue-400 rounded select-none shadow p-2 text-white">Criar</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {objects?.map(object => <ListedObject key={object.id} object={object} fields={fields} setState={setState} />)}

      </tbody>
    </table>
  )
}

function ListedObject<E extends Model>({
  object,
  fields,
  setState
}: {
  object: E,
  fields: string[],
  setState: React.Dispatch<React.SetStateAction<PageState>>
}) {
  return (
    <tr className="border-collapse border-2 border-black">
      {fields.map(field => <td key={field} className="border-2 border-black p-2">{object[field]}</td>)}
      <td key={"edit"} className="p-2 flex flex-row  justify-around">
        <button
          className="p-1 bg-blue-400 rounded-md text-white shadow-md mr-2 w-16"
          onClick={() => setState({
            status: "update",
            id: object.id
          })}
        >
          Editar
        </button>

        <button
          className="p-1 bg-blue-400 rounded-md text-white shadow-md w-16"
          onClick={() => setState({
            status: "view",
            id: object.id
          })}
        >
          Ver
        </button>
      </td>
    </tr>
  )
}

export function ListDriver({
  setState
}: {
  setState: React.Dispatch<React.SetStateAction<PageState>>
}) {
  return (
    <List restService={api.driver} fields={["nome", "cpf"]} setState={setState} />
  )
}