import { apiClient } from "./ApiClient";

export const deleteToken = () => {
  localStorage.removeItem("token");
};

export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const handleAuth = async (data) => {
  const res = await apiClient.post("/login", data);

  if (res.status === 200) {
    saveToken(res.data.token);
    return true;
  } else {
    throw Error;
  }
};

export const logout = () => {
  deleteToken();
  window.location.href = "/login";
};
