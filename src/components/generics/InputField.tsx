import { Field } from "formik";
import { Model } from "../../models/Entities";
import BaseService from "../../bases/BaseService";

export function InputField<M extends Model = Model>({
  label,
  identifier,
  type,
  options,
  referenceConfig,
}: Field<M>) {

  async function getReferenceOptions() {
    if (!referenceConfig) return;

    const { restService, identity } = referenceConfig;
    const references = await restService.getAll();
    return references?.data.map((reference) => (
      <option key={reference.id} value={reference.id}>
        {reference[identity]}
      </option>
    ));
  }

  function getInput() {
    switch (type) {
      case FieldType.TEXT:
      case FieldType.NUMBER:
      case FieldType.EMAIL: {
        return (
          <Field
            id={identifier}
            name={identifier}
            type={type}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        );
      }
      case FieldType.SELECT: {
        return (
          <Field as="select" id={identifier} name={identifier} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
            {options?.map((option) => (
              <option key={option.identifier} value={option.identifier}>
                {option.value}
              </option>
            ))}
          </Field>
        );
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
        return (
          <Field
            as="select"
            id={identifier}
            name={identifier}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {getReferenceOptions()}
          </Field>
        );
      }
      default:
        return null;
    }
  }

  return (
    <div className="mb-4">
      <label htmlFor={identifier} className="block text-sm font-medium text-green-700 mb-1">
        {label}
      </label>
      {getInput()}
    </div>
  );
}

interface Option {
  value: string;
  identifier: string;
}

export interface Field<M extends Model = Model> {
  label: string;
  identifier: string;
  type: FieldType;
  isIdentity?: boolean;
  canEdit?: boolean;
  required?: boolean;
  options?: Option[];
  referenceConfig?: ReferenceConfig<M>;
}

interface ReferenceConfig<M extends Model> {
  restService: BaseService<M>;
  identity: string;
}

export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  SELECT = "select",
  FILE = "file",
  REFERENCE = "reference",
  DATE = "date",
  EMAIL = "email", 
  BOOLEAN = "boolean",
}
