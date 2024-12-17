import axios from "axios";
import { API_HOST } from "../config/consts";

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return token;
  } else {
    return null;
    // window.location.href = "/login";
  }
};

export const apiClient = axios.create({
  baseURL: `${API_HOST}`,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});
