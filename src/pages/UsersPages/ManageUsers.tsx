import { useState } from "react";
import Card from "../components/Card";
import InputText from "../components/InputText";
import InputList from "../components/InputList";
import Button from "../components/Button";
import SimpleForm from "../components/SimpleForm";
import { apiClient } from "../config/security/ApiClient";
import { logout } from "../config/security/AuthServices";
import BackButton from "../components/BackButton";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);

  const userTypes = [
    {name: "Admin", value: 1 },
    {name: "Organização", value: 2 },
    {name: "Prefeitura", value: 3 },
    {name: "Catadores", value: 4 },
    {name: "Admin", value: 5 },
  ];

  const users = [
    { name: "João Silva", role: "Admin" },
    { name: "Maria Oliveira", role: "Organização" },
    { name: "Carlos Pereira", role: "Prefeitura" },
    { name: "Ana Costa", role: "Catadores" },
    { name: "Pedro Souza", role: "Admin" },
  ]

  const filters = ["Todos", "Admins", "Organização", "Prefeitura", "Catadores"];

  const handleDeactivate = async (values) => {
    try {
      const res = await apiClient.post("/users/deactivate", {
        name: values.name,
        userType: values.userType,
      });

      if (res.status === 200) {
        toast.success(`Usuário ${values.name} foi desativado com sucesso!`);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        `Erro ao desativar o usuário ${values.name}. Por favor, tente novamente.`,
      );
    }
  };

  return (
    <Card className="max-w-6xl w-full bg-white/95 p-8 rounded-[50px] shadow-lg flex flex-col gap-8">
      <h1 className="text-center text-3xl text-gray-800 font-bold">
        Gerenciamento de Usuários
      </h1>

      {/* Card Principal */}
      <div className="flex flex-wrap lg:flex-nowrap gap-8">
        <Card className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="bg-yellow-600 p-4 rounded-3xl min-w-52">
            <div className="flex flex-wrap justify-center gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`text-sm px-4 py-2 rounded-lg transition ${selectedFilter === filter
                    ? "bg-green-700 text-white font-bold"
                    : "bg-white text-black"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 max-h-[400px]">
            {users.map((user, index) => (
              <div
                key={index}
                onClick={() => setSelectedUserIndex(index)}
                className={`flex justify-between items-center p-4 my-2 rounded-lg cursor-pointer border ${selectedUserIndex === index
                  ? "bg-gray-200 border-gray-400"
                  : "bg-white border-gray-300"
                  } transition`}
              >
                <div>
                  <strong>{user.name}</strong>
                  <div className="text-sm text-gray-600">{user.role}</div>
                </div>
                <Button titulo="🔒" className="bg-transparent shadow-none" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
          <h3 className="text-gray-700 text-center font-medium text-xl">
            Desativar Usuário
          </h3>
          <SimpleForm
            initialValues={{ name: "", userType: "1" }}
            onSubmit={handleDeactivate}
          >
            {(formik) => (
              <>
                <InputText
                  titulo="Nome ou E-mail do usuário"
                  name="name"
                  onChange={formik.handleChange}
                />
                <InputList
                  titulo="Tipo de Usuário"
                  name="userType"
                  onChange={formik.handleChange}
                  options={userTypes}
                />
                <div className="mt-2">
                  <Button
                    titulo="Desativar"
                    type="submit"
                    className="bg-green-800 text-white rounded-lg px-6 py-2 text-sm"
                  />
                </div>
              </>
            )}
          </SimpleForm>
        </Card>
      </div>
      <div className="flex gap-16 justify-between">
        <BackButton path={"/users-menu"}  />
      </div>
    </Card>
  );
};

export default ManageUsers;
