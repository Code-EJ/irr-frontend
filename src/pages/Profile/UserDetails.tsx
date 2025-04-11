import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../services';
import { jwtDecode } from 'jwt-decode';
import BackButton from '../../components/BackButton';
import { getToken } from '../../config/security/Client';

interface User {
  id: string;
  nome: string;
  tipo: string;
  email: string;
}

const UserDetails = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return null;
    }

    try {
      const decoded: any = jwtDecode(token);
      localStorage.setItem("User_info:", JSON.stringify(decoded));
      return decoded.id;
    } catch (error) {
      navigate('/login');
      return null;
    }
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      const fetchUser = async () => {
        try {
          const data = await UserService.get(userId);
          if (data) {
            setUser({
              id: data.id || '',
              nome: data.nome || 'N/A',
              tipo: data.tipo || 'N/A',
              email: data.email || 'N/A',
            });
          }
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
          navigate('/erro');
        }
      };
      fetchUser();
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-screen py-6 px-2">

      <div
        className="w-full max-w-xl bg-cover bg-center rounded-t-2xl"
        style={{ backgroundImage: "url('/img/folhas.jpg')" }}
      >
        <div className="flex items-center gap-4 p-8">
          <div className="w-40 h-40 bg-white rounded-full border-4 border-white flex items-center justify-center">
          </div>
          <div>
            <h2 className="text-white text-5xl font-bold leading-tight">
              {user?.nome || "Nome Sobrenome"}
            </h2>
            <p className="text-gray-200 text-base">{user?.tipo || "Cargo"}</p>
          </div>
        </div>
      </div>

      <div className="w-screen bg-[#133D1A] flex flex-col items-center justify-center py-6 px-2">
        <div className="w-[40%] bg-gradient-to-b from-[#A5BD79] via-[#1F5A2B] to-[#1F5A2B] rounded-3xl mt-6 p-20 text-white shadow-md">
          {user ? (
            <>
              <div className="space-y-6 font-bold text-2xl">
                <p>
                  <span className="font-bold">📧 E-mail:</span> {user.email}
                </p>
                <p>
                  <span className="font-bold">🧾 CPF/CNPJ:</span> xxxxxxxxxx
                </p>
                <p>
                  <span className="font-bold">🗓️ Data de cadastro:</span> xx/xx/xxxx
                </p>
              </div>

              <div className="mt-8 flex justify-end text-xl gap-4">
                {user.tipo === 'ADMINISTRADOR' && (
                  <button
                    onClick={() => navigate(`/edit/${user.id}`)}
                    className="text-[#CBC07C] font-bold py-2 px-9 rounded-lg hover:bg-white hover:text-green-900 transition-all duration-300"
                  >
                    Editar
                  </button>
                )}
                <BackButton
                  path="/menu"
                  className="text-[#CBC07C] text-lg font-bold hover:underline"
                />
              </div>
            </>
          ) : (
            <p className="text-center text-gray-300 text-xl">
              Carregando informações...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
