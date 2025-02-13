import React, { useEffect, useState } from "react";
import OutputField from "./OutputField";
import { Model } from "../../services/api/Entities";
import api from "../../services/api/Api";

function ViewForm<E extends Model>({
  restService,
  id,
  children
}) {
  const [value, setValue] = useState<E>();

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
      { children }
    </div>
  )
}

export function ViewDriverForm({
  id
}: {
  id: string;
}) {
  return (
    <ViewForm id={id} restService={api.driver}>
      <OutputField name="Nome" value={""} />
    </ViewForm>
  )
}

function Example() {
  return (
    <ViewDriverForm id="" />
  )
}