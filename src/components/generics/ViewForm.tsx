import React, { useEffect, useState } from "react";

import BaseService from "../../services/api/BaseService";
import { Field } from "../Page";
import { Model } from "../../services/api/Entities";
import OutputField from "./OutputField";
import api from "../../services/api/Api";

export function ViewForm<E extends Model>({
  restService,
  id,
  fields,
  setState
}: {
  restService: BaseService<E>;
  id: string;
  fields: Field[],
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
    <div>

      {
        value ?
          fields.map(field => {
            return (
              <OutputField label={field.label} value={value[field.identifier]} type={field.type} key={field.identifier} />
            )
          }) : null
      }
      <button
        className="p-1 bg-blue-400 rounded-md text-white shadow-md mr-2 w-16"
        onClick={() => setState({
          status: "UPDATE",
          id: id
        })}
      >
        Editar
      </button>
      <button
        className="p-1 bg-blue-400 rounded-md text-white shadow-md mr-2 w-16"
        onClick={() => setState({
          status: "DELETE",
          id: id
        })}
      >
        Remover
      </button>
    </div>
  )
}

// export function ViewDriverForm({
//   id
// }: {
//   id: string;
// }) {
//   return (
//     <ViewForm id={id} restService={api.driver}>
//       <OutputField name="Nome" value={""} />
//     </ViewForm>
//   )
// }

// function Example() {
//   return (
//     <ViewDriverForm id="" />
//   )
// }