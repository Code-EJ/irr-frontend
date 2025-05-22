import { apiClient, deleteToken, setToken } from "../config/security/Client";

type loginResponse = {
  token: string | null;
  error: string | null;
  status: number;
}

const login = async (data: Login): Promise<loginResponse> => {
  const res = await apiClient.post("/auth/login", data);
  
  if (res.status === 200) {
    const data: LoginResponse = res.data;
    setToken(data.access_token);
    return {token: data.access_token, error: null, status: 200};
  } else {
    return {token: null, error: "Usuário inválido", status: res.status};
  }
};

const logout = () => {
  deleteToken();
  window.location.href = "/login";
};

export default {
  login,
  logout,
}

interface Login {
  email: string;
  senha: string;
}

interface LoginResponse {
  "access_token": string;
}