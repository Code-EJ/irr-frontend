import { useEffect, useState } from "react";

import BaseService from "../../bases/BaseService";
import { Field } from "./InputField";
import { Model } from "../../models/Entities";
import { PageState } from "../Page";
import { toast } from "react-toastify";

export function List<E extends Model>({
  restService,
  fields,
  setState
}: {
  restService: BaseService<E>,
  fields: Field<E>[],
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
    <div className=" overflow-x-auto">
      <table className=" min-w-full bg-white border border-gray-200">
        <thead>
          <tr className=" bg-gray-100">
            {fields.map(field => <th className=" px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-700" key={field.identifier}>{field.label}</th>)}
            <th className=" px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody>
          {objects?.map(object => <ListedObject key={object.id} object={object} fields={fields} setState={setState} />)}
        </tbody>
      </table>
    </div>
  )
}

function ListedObject<E extends Model>({
  object,
  fields,
  setState
}: {
  object: E,
  fields: Field<E>[], 
  setState: React.Dispatch<React.SetStateAction<PageState>>
}) {
  return (
    <tr className=" hover:bg-gray-50">
      {fields?.map(field => <td key={field.identifier} className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">{object[field.identifier]}</td>)}
      <td key={"edit"} className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 flex">
        <button
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md"
          onClick={() => setState({
            status: "VIEW",
            id: object.id
          })}
        >
          Ver
        </button>
      </td>
    </tr>
  )
}