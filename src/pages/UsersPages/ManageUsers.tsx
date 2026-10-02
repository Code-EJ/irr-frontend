import { useEffect, useState } from "react";
import Card from "../../components/Card";
import InputText from "../../components/InputText";
import Button from "../../components/Button";
import SimpleForm from "../../components/SimpleForm";
import { toast } from "react-toastify";
import BackButton from "../../components/BackButton";
import { UserService } from "../../services";

const ManageUsers = () => {
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
  const [users, setUsers] = useState<import("../../models/Entities").User[]>([]);

  const filters = ["Todos", "Administrador", "Organizacao", "Prefeitura", "Representante"];

  const fetchData = async () => {
    try {
      const response = await UserService.getAll();
      const usuarios = response?.data || [];
      setUsers(usuarios);
    } catch (error) {
      toast.error("Erro ao carregar usuários.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (selectedFilter === "Todos") return true;
    return user.tipo.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleDeactivateById = async (id: string) => {
    try {
      await UserService.delete(id);
      toast.success("Usuário desativado com sucesso!");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao desativar o usuário. Por favor, tente novamente.");
    }
  };

  const handleDeactivate = async (values: {email:string}) => {
    try {
      const userToDeactivate = users.find(
        (user) => user.email.toLowerCase() === values.email.toLowerCase()
      );

      if (!userToDeactivate) {
        toast.error("Usuário não encontrado.");
        return;
      }

      await UserService.delete(userToDeactivate.id);
      toast.success(`Usuário ${values.email} foi desativado com sucesso!`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(
        `Erro ao desativar o usuário ${values.email}. Por favor, tente novamente.`
      );
    }
  };

  return (
    <Card className="max-w-6xl w-full bg-white/95 p-8 rounded-[50px] shadow-lg flex flex-col gap-8">
      <h1 className="text-center text-3xl text-gray-800 font-bold">
        Gerenciamento de Usuários
      </h1>

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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserIndex(index)}
                  className={`flex justify-between items-center p-4 my-2 rounded-lg cursor-pointer border ${selectedUserIndex === index
                    ? "bg-gray-200 border-gray-400"
                    : "bg-white border-gray-300"
                    } transition`}
                >
                  <div>
                    <strong>{user.nome || user.email}</strong>
                    <div className="text-sm text-gray-600">{user.tipo}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <Button
                    titulo="🔒"
                    className="bg-transparent shadow-none"
                    onClick={() => {
                      const confirm = window.confirm(`Tem certeza que deseja desativar ${user.email}?`);
                      if (confirm) {
                        handleDeactivateById(user.id);
                      }
                    }}
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Nenhum usuário encontrado.
              </p>
            )}
          </div>
        </Card>

        <Card className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
          <h3 className="text-gray-700 text-center font-medium text-xl">
            Desativar Usuário
          </h3>
          <SimpleForm initialValues={{ email: "" }} onSubmit={handleDeactivate}>
            {(formik) => (
              <>
                <InputText
                  titulo="E-mail do usuário"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <div className="mt-2">
                  <Button
                    titulo="Desativar"
                    type="submit"
                    className="bg-green-800 text-white rounded-lg px-6 py-2 text-sm"
                    disabled={formik.isSubmitting}
                  />
                </div>
              </>
            )}
          </SimpleForm>
        </Card>
      </div>

      <div className="flex gap-16 justify-between">
        <BackButton path={"/users-menu"} />
      </div>
    </Card>
  );
};

export default ManageUsers;
