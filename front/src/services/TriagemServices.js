import { apiClient } from "./ApiClient";

export const createTriagem = async (data) => {
  const res = await apiClient.post("/nova-triagem", data);
  return res;
};

export const deleteTriagem = async (id) => {
  const res = await apiClient.delete(`/delete-triagem/${id}`);
  return res;
};

export const retrieveTriagem = async (id) => {
  const res = await apiClient.get(`/triagens/${id}`);
  return res;
};

export const listTriagens = async () => {
  const res = await apiClient.get("/triagens");
  return res;
};
