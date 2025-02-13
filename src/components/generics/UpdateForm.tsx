import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import BaseService from "../../services/api/BaseService";
import { Model } from "../../services/api/Entities";
import { InputField } from "./InputField";
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
function UpdateForm<E extends Model>({
  restService,
  id,
  children
}: UpdateFormProps<E>) {
  const [data, setData] = useState<E>();

  useEffect(() => {
    async function getUpdatedData(id: string) {
      const updatedData = await restService.get(id);

      if (updatedData) setData(updatedData);
      // TODO: O backend já retorna essas mensagens. Trocar pelas mensagens do backend.
      else alert("Não foi possível recuperar o registro.");
    }

    if (!data) getUpdatedData(id);
  }, []);

  return (
    <Formik 
      initialValues={ data || {} }
      onSubmit={ data => {
        try {
          restService.update(data)
        } catch (e) {
          // TODO: podemos mostrar mensagens customizadas de erro para o usuário caso uma requisição não tenha funcionado.
          alert(e);
        }
      } }
    >
      <Form>
        { children }
        <button type="submit">Atualizar</button>
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
}

interface IdProps {
  id: string;
}

export function UpdateDriverForm({ id }: IdProps) {
  return (
    <UpdateForm restService={api.driver} id={id}>
      <InputField label="Nome" id="nome" type="text" />
      <InputField label="CPF" id="cpf" type="text" />
    </UpdateForm>
  )
}

function Example() {
  return (
    <UpdateDriverForm id="0194f1e5-6061-7974-b89f-a1cbb35b4537" />
  )
}