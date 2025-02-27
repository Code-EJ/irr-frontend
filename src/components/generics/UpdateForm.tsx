import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";

import BaseService from "../../services/api/BaseService";
import { InputField } from "./InputField";
import { Model } from "../../services/api/Entities";
import api from "../../services/api/Api";

/**
 * Formulário genérico para edição de entidades.
 * O formulário é feito usando o Formik.
 * @todo Deve ser estilizado.
 * @param restService é um dos serviços criados em src/service/api. É usado para editar o registro no banco de dados.
 * @param initialValues é o valor inicial dos campos quando o formulário é criado.
 * @param children é um campo do react. Serve para posicionar componentes em uma posição específica. Nesse caso, os componentes são do tipo InputField. {@link https://pt-br.react.dev/learn/passing-props-to-a-component#passing-jsx-as-children Documentação do react sobre children}
 * @returns o formulário de edição da entidade especificada nas propriedades do componente.
 */
export function UpdateForm<E extends Model>({
  restService,
  id,
  children,
  initialValues,
  setState
}: UpdateFormProps<E>) {
  const [data, setData] = useState<E>(initialValues);

  useEffect(() => {
    async function getUpdatedData(id: string) {
      console.log(id)
      const updatedData = await restService.get(id);

      if (updatedData) {
        setData(updatedData);
        console.log(updatedData)
      }

      // TODO: O backend já retorna essas mensagens. Trocar pelas mensagens do backend.
      else alert("Não foi possível recuperar o registro.");
    }

    getUpdatedData(id);
  }, [id]);

  return (
    <Formik
      initialValues={data}
      enableReinitialize={true}
      onSubmit={data => {
        try {
          restService.update(data);
          console.log("registro alterado")
          setState({
            status: "VIEW",
            id
          })
        } catch (e) {
          // TODO: podemos mostrar mensagens customizadas de erro para o usuário caso uma requisição não tenha funcionado.
          alert(e);
        }
      }}
    >
      <Form className="flex flex-col gap-6 p-6 border border-gray-300 rounded-lg shadow-lg bg-white max-w-lg mx-auto">
        {children}
        <button className="p-2 bg-green-500 hover:bg-green-600 rounded-md text-white shadow-md mr-2 w-24" type="submit">Atualizar</button>
      </Form>
    </Formik>
  )
}

/**
 * Propriedades aceitas no componente ``EditForm``. 
 */
interface UpdateFormProps<E extends Model> {
  restService: BaseService<E>;
  id: string;
  children: any;
  initialValues: any;
  setState: any;
}

// export function UpdateDriverForm({ id }: IdProps) {
//   return (
//     <UpdateForm restService={api.driver} id={id}>
//       <InputField label="Nome" id="nome" type="text" />
//       <InputField label="CPF" id="cpf" type="text" />
//     </UpdateForm>
//   )
// }

// function Example() {
//   return (
//     <UpdateDriverForm id="0194f1e5-6061-7974-b89f-a1cbb35b4537" />
//   )
// }