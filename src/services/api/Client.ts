import axios from "axios";
import { API_HOST } from "../../config/consts";

let token;

const getToken = () => token;
const setToken = (t: string) => {
  token = t;
  apiClient.defaults.headers.Authorization = `Bearer ${t}`;
};
const deleteToken = () => token = null;

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
