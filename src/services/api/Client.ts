import axios from "axios";
import { API_HOST } from "../../config/consts";

const getToken = () => localStorage.getItem("token");
const setToken = (token: string) => {
  localStorage.setItem("token", token);
  apiClient.defaults.headers.Authorization = `Bearer ${token}`;
};
const deleteToken = () => localStorage.removeItem("token");

const apiClient = axios.create({
  baseURL: `${API_HOST}`,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export {
  apiClient,
  getToken,
  setToken,
  deleteToken,
}
