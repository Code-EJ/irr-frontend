import { FieldType, InputField } from "./generics/InputField";
import React, { useState } from "react";

import BaseService from "../services/api/BaseService";
import Card from "./Card";
import { CreateForm } from "./generics/CreateForm";
import { List } from "./generics/List";
import { Model } from "../services/api/Entities";
import { UpdateForm } from "./generics/UpdateForm";

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
      initialValues[field.identifier] = null;
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
          <CreateForm restService={restService} initialValues={fieldsToInitialValues(fields)}>
            {fields.forEach(field => {
              return (
                <InputField label={field.label} id={field.identifier} type={field.type} />
              )
            })}
          </CreateForm>
        );
      }
      case "UPDATE": {
        return (
          <UpdateForm restService={restService} id={""}>
            {fields.forEach(field => {
              return (
                <InputField label={field.label} id={field.identifier} type={field.type} />
              )
            })}
          </UpdateForm>
        )
      }
      case "VIEW": {
        return <div>todo: view</div>;
      }
      case "DELETE" : {
        return <div>todo: delete</div>
      }
    }
  }

  return (
    <Card className="rounded-[50px] shadow-lg d-flex flex-col w-full h-full"  width={undefined} bgColor={undefined} >
      <h1 className="text-center select-none text-4xl">{name}</h1>
      { render() }
    </Card>
  )
}

interface PageProps<E extends Model> {
  restService: BaseService<E>,
  fields: Field[],
  name: string
}

export interface Field {
  label: string;
  identifier: string;
  type: FieldType,
  identity?: boolean;
  canEdit?: boolean;
}

export interface PageState {
  status: "LIST" | "CREATE" | "UPDATE" | "VIEW" | "DELETE";
  id?: string;
}