import { apiClient, deleteToken, setToken } from "../config/security/Client";

const login = async (data: Login): Promise<boolean> => {
  const res = await apiClient.post("/auth/login", data);

  if (res.status === 200) {
    const data: LoginResponse = res.data;
    setToken(data.access_token);
    return true;
  } else {
    return false;
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