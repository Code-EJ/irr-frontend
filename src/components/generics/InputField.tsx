import { Field } from "formik";
import React from "react";

/**
 * Componente que serve para definir os campos de valores do formulário.
 * O formulário é feito usando o Formik.
 * @todo Deve ser estilizado.
 * @param label é o texto que aparece para o usuário acima ou do lado do campo.
 * @param id é o nome do campo dentro do banco de dados. Acesse o arquivo src/services/api/Entities.ts para consultar o nome dos campos de uma entidade.
 * @param type é o tipo do valor aceito na tag input do html. {@link https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#type Lista de valores aceitos}.
 */
export function InputField({
  label, id, type
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <Field id={id} name={id} type={type} />
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
  type: "email" | "text" | "password" | "checkbox" | "number" | "date" | "file";
}
