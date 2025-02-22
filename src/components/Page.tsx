import { Field, FieldType, InputField } from "./generics/InputField";
import React, { useState } from "react";

import BaseService from "../services/api/BaseService";
import Card from "./Card";
import { CreateForm } from "./generics/CreateForm";
import { DeleteForm } from "./generics/DeleteForm";
import { List } from "./generics/List";
import { Model } from "../services/api/Entities";
import { UpdateForm } from "./generics/UpdateForm";
import { ViewForm } from "./generics/ViewForm";

export function Page<E extends Model>({
  restService,
  fields,
  name
}: PageProps<E>) {
  const [pageState, setPageState] = useState<PageState>({
    status: "LIST"
  });

  function fieldsToInitialValues(fields: Field[]) {
    const initialValues = {};

    fields.forEach(field => {
      initialValues[field.identifier] = "";
    })

    return initialValues;
  }

  function render() {
    switch (pageState.status) {
      case "LIST": {
        return (
          <List
            restService={restService} fields={fields}
            setState={setPageState}
          />
        );
      }
      case "CREATE": {
        return (
          <CreateForm restService={restService} initialValues={fieldsToInitialValues(fields)} fields={fields} setState={setPageState} />
        );
      }
      case "UPDATE": {
        return (
          <UpdateForm restService={restService} id={pageState.id!} initialValues={fieldsToInitialValues(fields)} setState={setPageState}>
            {fields.map(field => {
              return (
                <InputField label={field.label} id={field.identifier} type={field.type} key={field.identifier} />
              )
            })}
          </UpdateForm>
        )
      }
      case "VIEW": {
        return (
          <ViewForm restService={restService} id={pageState.id!} fields={fields} setState={setPageState} />
        );
      }
      case "DELETE": {
        return <DeleteForm setState={setPageState} id={pageState.id!} restService={restService} />
      }
    }
  }

  return (
    <Card className="rounded-[50px] shadow-lg d-flex flex-col w-full h-full" width={undefined} bgColor={undefined} >
      <h1 className="text-center select-none text-4xl">{name}</h1>
      {pageState.status !== "LIST" ? <button
        className="p-1 bg-blue-400 rounded-md text-white shadow-md mr-2 w-16"
        onClick={() => setPageState({
          status: "LIST"
        })}
      >Voltar</button> : null}
      {render()}
      {
        pageState.status === "LIST" ?
         
            <button className="p-1 bg-blue-400 rounded-md text-white shadow-md mr-2 w-16" onClick={() => setPageState({
              status: "CREATE"
            })}>Criar</button>
        : null
      }
    </Card>
  )
}

interface PageProps<E extends Model> {
  restService: BaseService<E>,
  fields: Field[],
  name: string
}



export interface PageState {
  status: "LIST" | "CREATE" | "UPDATE" | "VIEW" | "DELETE";
  id?: string;
}