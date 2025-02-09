import { Field, Form, Formik} from "formik";
import React from "react";
import BaseService from "../services/api/BaseService";
import api from "../services/api/Api";

/**
 * Formulário genérico para criação de entidades.
 * O formulário é feito usando o Formik.
 * @todo Deve ser estilizado.
 * @param restService é um dos serviços criados em src/service/api. É usado para criar o registro no banco de dados.
 * @param initialValues é o valor inicial dos campos quando o formulário é criado.
 * @param children é um campo do react. Serve para posicionar componentes em uma posição específica. Nesse caso, os componentes são do tipo InputField. {@link https://pt-br.react.dev/learn/passing-props-to-a-component#passing-jsx-as-children Documentação do react sobre children}
 * @returns o formulário de criação da entidade especificada nas propriedades do componente.
 */
function CreateForm<E>({
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
          // para isso, 
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
interface CreateFormProps<E> {
  restService: BaseService<E>;
  initialValues: any;
  children: any;
}

/**
 * Componente que serve para definir os campos de valores do formulário.
 * O formulário é feito usando o Formik.
 * @todo Deve ser estilizado.
 * @param label é o texto que aparece para o usuário acima ou do lado do campo.
 * @param id é o nome do campo dentro do banco de dados. Acesse o arquivo src/services/api/Entities.ts para consultar o nome dos campos de uma entidade.
 * @param type é o tipo do valor aceito na tag input do html. {@link https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input#type Lista de valores aceitos}.
 */
function InputField({ 
  label,
  id,
  type
 }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <Field id={id} name={id} type={type} />
    </div>
  )
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

/**
 * Exemplo de formulário para criar registros de motoristas no banco de dados.
 * A entidade motorista tem dois campos que precisam ser preenchidos, ``nome`` e ``cpf``.
 * Os campos ``id`` e ``criadorId`` são criados automaticamente para todas as entidades.
 * Todos os formulários de criação devem ter esse formato apresentado.
 * @aviso esse componente não deve ser estilizado, todos os estilos devem ser feitos nos componentes ``CreateForm`` e ``InputField``.
 */
function CreateDriverForm() {
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

/**
 * Exemplo de ulitização do formulário depois de criado.
 */
export function Example() {
  return (
    <>
      <h1>Criação de motorista</h1>
      <CreateDriverForm />
    </>
  )
}