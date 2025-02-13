import React from "react";
import { Form, Formik } from "formik";
import BaseService from "../../services/api/BaseService";
import api from "../../services/api/Api";
import { InputField } from "./InputField";
import { Model } from "../../services/api/Entities";

/**
 * Formulário genérico para criação de entidades.
 * O formulário é feito usando o Formik.
 * @todo Deve ser estilizado.
 * @param restService é um dos serviços criados em src/service/api. É usado para criar o registro no banco de dados.
 * @param initialValues é o valor inicial dos campos quando o formulário é criado.
 * @param children é um campo do react. Serve para posicionar componentes em uma posição específica. Nesse caso, os componentes são do tipo InputField. {@link https://pt-br.react.dev/learn/passing-props-to-a-component#passing-jsx-as-children Documentação do react sobre children}
 * @returns o formulário de criação da entidade especificada nas propriedades do componente.
 */
function CreateForm<E extends Model>({
  restService,
  initialValues,
  children
}: CreateFormProps<E>) {
  return (
    <Formik 
      initialValues={ initialValues }
      onSubmit={ data => {
        try {
          restService.create(data)
        } catch (e) {
          // TODO: podemos mostrar mensagens customizadas de erro para o usuário caso uma requisição não tenha funcionado.
          alert(e);
        }
      } }
    >
      <Form>
        { children }
        <button type="submit">Criar</button>
      </Form>
    </Formik>
  )
}

/**
 * Propriedades aceitas no componente ``CreateForm``. 
 */
interface CreateFormProps<E extends Model> {
  restService: BaseService<E>;
  initialValues: any;
  children: any;
}

/**
 * Exemplo de formulário para criar registros de motoristas no banco de dados.
 * A entidade motorista tem dois campos que precisam ser preenchidos, ``nome`` e ``cpf``.
 * Os campos ``id`` e ``criadorId`` são criados automaticamente para todas as entidades.
 * Todos os formulários de criação devem ter o formato apresentado.
 * @aviso esse componente não deve ser estilizado, todos os estilos devem ser feitos nos componentes ``CreateForm`` e ``InputField``.
 */
export function CreateDriverForm() {
  return (
    <CreateForm restService={api.driver} initialValues={{
      nome: "",
      cpf: ""
    }}>
      <InputField label="Nome" id="nome" type="text" />
      <InputField label="CPF" id="cpf" type="text" />
    </CreateForm>
  )
}

function Example() {
  return (
    <CreateDriverForm />
  )
}