import { useEffect, useState } from "react";

import BaseService from "../../bases/BaseService";
import { Field } from "./InputField";
import { Model } from "../../models/Entities";
import OutputField from "./OutputField";

export function ViewForm<E extends Model>({
  restService,
  id,
  fields,
  setState
}: {
  restService: BaseService<E>;
  id: string;
  fields: Field<E>[],
  setState: any
}) {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    async function getUpdatedValue(id: string) {
      const updatedData = await restService.get(id);

      if (updatedData) setValue(updatedData);
      // TODO: O backend já retorna essas mensagens. Trocar pelas mensagens do backend.
      else alert("Não foi possível recuperar o registro.");
    }

    if (!value) getUpdatedValue(id);
  }, []);

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-lg rounded-md shadow-md p-6">
        {
          value ?
            fields.map(field => {
              return (
                <OutputField label={field.label} value={value[field.identifier]} type={field.type} key={field.identifier} />
              )
            }) : null
        }
        <div className="flex justify-end mt-4">
          <button
            className="p-2 bg-green-500 hover:bg-green-600 rounded-md text-white shadow-md mr-2 w-24"
            onClick={() => setState({
              status: "UPDATE",
              id: id
            })}
          >
            Editar
          </button>
          <button
            className="p-2 bg-red-500 hover:bg-red-600 rounded-md text-white shadow-md w-24"
            onClick={() => setState({
              status: "DELETE",
              id: id
            })}
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  )
}