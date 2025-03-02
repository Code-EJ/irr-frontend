import { Field } from "formik";

/**
 * Componente que serve para definir os campos de valores do formulário.
 * O formulário é feito usando o Formik.
 * @todo Deve ser estilizado.
 * @param label é o texto que aparece para o usuário acima ou do lado do campo.
 * @param id é o nome do campo dentro do banco de dados. Acesse o arquivo src/services/api/Entities.ts para consultar o nome dos campos de uma entidade.
 * @param type é o tipo do valor aceito na tag input do html. {@link https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#type Lista de valores aceitos}.
 */
export function InputField({
  label, id, type, options
}: InputFieldProps) {

  function getInput() {
    switch (type) {
      case FieldType.TEXT:
      case FieldType.NUMBER: {
        return <Field id={id} name={id} type={type} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
      }
      case FieldType.SELECT: {
        return <Field as="select" id={id} name={id} type={type} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
          {
            options?.map(option => <option key={option.identifier} value={option.identifier}>{option.value}</option>)
          }
        </Field>
      }
      case FieldType.FILE: {
        return <div className="flex flex-col">
          <span className="mb-2">{label}</span>
          <input type="file" name={id} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
      }
    }
  }

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-green-700 mb-1">{label}</label>
      {
        getInput()
      }
    </div>
  );
}
/**
 * Propriedades aceitas no componente ``InputField``.
 * @aviso nem todos os valores possíveis do campo ``type`` foram preenchidos. {@link https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#type Vide documentação}.
 */
interface InputFieldProps {
  label: string;
  id: string;
  type: FieldType;
  options?: Option[]
}

interface Option {
  value: string;
  identifier: string;
}

export interface Field {
  label: string;
  identifier: string;
  type: FieldType,
  identity?: boolean;
  canEdit?: boolean;
  options?: Option[]
}

export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  SELECT = "select",
  FILE = "file",
  REFERENCE = "reference",
  DATE = "date"
}
