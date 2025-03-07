import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../services';
import { jwtDecode } from 'jwt-decode';
import BackButton from '../components/BackButton';

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
    const token = localStorage.getItem('token');
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
    <div className="p-8">
      <div className="max-w-xl mx-auto p-6 shadow-lg rounded-2xl bg-white">
        <h1 className="text-2xl font-bold mb-4">Detalhes do Usuário</h1>
        {user && (
          <>
            <p><strong>Nome:</strong> {user.nome}</p>
            <p><strong>Cargo:</strong> {user.tipo}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <div className="mt-6 flex gap-4">
              {user.tipo === 'ADMINISTRADOR' && (
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate(`/edit/${user.id}`)}>Editar</button>
              )}
              <BackButton path={'/menu'} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetails;