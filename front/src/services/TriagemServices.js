import { apiClient } from "./ApiClient";

export const handleNewTriagem = async (data) => {
  const res = await apiClient.post("/nova-triagem", data);

  if (res.status === 201) {
    return res.data;
  } else {
    throw Error;
  }
};
