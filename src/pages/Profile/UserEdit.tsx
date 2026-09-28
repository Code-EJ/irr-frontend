import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserService } from "../../services";
import { InputField, FieldType } from "../../components/generics/InputField";
import { User } from "../../models/Entities";

const userFields = [
  { label: "Nome", identifier: "nome", type: FieldType.TEXT },
  { label: "Email", identifier: "email", type: FieldType.TEXT },
];

export function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await UserService.get(id!);
        
        if (data?.tipo === "ADMINISTRADOR") {
          setUser(data);
        } else {
          alert("Usuário inválido ou tipo não permitido.");
          navigate("/");
        }
      } catch {
        alert("Erro ao buscar usuário.");
        navigate("/");
      }
    }
    fetchUser();
  }, [id, navigate]);

  if (!user) return <p>Carregando...</p>;

  return (
    <Formik
      initialValues={user}
      onSubmit={async (data) => {
        try {
          await UserService.update(id!, data);
          alert("Usuário atualizado com sucesso!");
          navigate("/profile");
        } catch {
          alert("Erro ao atualizar usuário.");
        }
      }}
    >
      <Form className="flex flex-col gap-6 p-6 border border-gray-300 rounded-lg shadow-lg bg-white max-w-lg mx-auto">
        {userFields.map((field) => (
          <InputField
            key={field.identifier}
            label={field.label}
            identifier={field.identifier}
            type={field.type}
          />
        ))}
        <button
          type="submit"
          className="p-2 bg-green-500 hover:bg-green-600 rounded-md text-white shadow-md w-24"
        >
          Atualizar
        </button>
      </Form>
    </Formik>
  );
}
