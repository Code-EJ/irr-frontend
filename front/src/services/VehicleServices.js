import { apiClient } from "./ApiClient";

export const createVehicle = async (data) => {
  const res = await apiClient.post("/novo-veiculo", data);
  return res;
};

export const deleteVehicle = async (id) => {
  const res = await apiClient.delete(`/delete-veiculo/${id}`);
  return res;
};

export const retrieveVehicle = async (id) => {
  const res = await apiClient.get(`/veiculos/${id}`);
  return res;
};

export const listVehicles = async () => {
  const res = await apiClient.get("/veiculos");
  return res;
};
