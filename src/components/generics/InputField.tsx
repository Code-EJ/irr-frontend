import { Field } from "formik";
import { Model } from "../../models/Entities";
import BaseService from "../../bases/BaseService";
import { useEffect, useState } from "react";
import { get } from "../../utils/LodashAlternatives";

/**
 * Componente que serve para definir os campos de valores do formulário.
 * O formulário é feito usando o Formik.
 * @todo Deve ser estilizado.
 * @param label é o texto que aparece para o usuário acima ou do lado do campo.
 * @param id é o nome do campo dentro do banco de dados. Acesse o arquivo src/services/api/Entities.ts para consultar o nome dos campos de uma entidade.
 * @param type é o tipo do valor aceito na tag input do html. {@link https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#type Lista de valores aceitos}.
 */
export  function InputField<M extends Model = Model>({
  label,
  identifier,
  type,
  options,
  referenceConfig,
}: Field<M>) {
  const [references, setRef] = useState<any>(null);

  async function getReferenceOptions() {
    console.log('getReferenceOptions')
    if (!referenceConfig) return;

    const { restService } = referenceConfig;
    const references = await restService.getAll();
    console.log('references', references);
  
    setRef( references);
  }

  useEffect(() => {
    getReferenceOptions();
  }, []);

  function getInput() {
    switch (type) {
      case FieldType.TEXT:
      case FieldType.BOOLEAN:
      case FieldType.NUMBER: {
        return <Field id={identifier} name={identifier} type={type} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
      }
      case FieldType.SELECT: {
        return <Field 
        as="select" 
        id={identifier} 
        name={identifier} 
        type={type} 
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {
            options?.map(option => <option key={option.identifier} value={option.identifier}>{option.value}</option>)
          }
        </Field>
      }
      case FieldType.FILE: {
        return (
          <div className="flex flex-col">
            <span className="mb-2">{label}</span>
            <input
              type="file"
              name={identifier}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );
      }
      case FieldType.REFERENCE: {
        console.log(references)
        return (
          <Field as="select" id={identifier} name={identifier} type={type} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">

            {references?.map((reference: any) => <option key={reference.id} value={reference.id}>{reference[referenceConfig!.identity]}</option>)}
          </Field>
        )
      }
      case FieldType.DATE: {
        return <Field id={identifier} name={identifier} type={type} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
      }
      default:
        return null;
    }
  }

  return (
    <div className="mb-4">
      <label htmlFor={identifier} className="block text-sm font-medium text-green-700 mb-1">{label}</label>
      { getInput() }
    </div>
  );
}

interface Option {
  value: string;
  identifier: string;
}

export interface Field<M extends Model> {
  label: string;
  identifier: string;
  type: FieldType;
  isIdentity?: boolean;
  canEdit?: boolean;
  required?: boolean;
  options?: Option[];
  referenceConfig?: ReferenceConfig<M>;
}

interface ReferenceConfig<T extends Model> {
  restService: BaseService<T>;
  identity: string;
}

export enum FieldType {
  TEXT      = "text",
  NUMBER    = "number",
  SELECT    = "select",
  FILE      = "file",
  REFERENCE = "reference",
  DATE = "date",
  EMAIL = "email", 
  BOOLEAN = "boolean",
}
