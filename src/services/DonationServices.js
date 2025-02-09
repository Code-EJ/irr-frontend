import { apiClient } from "./ApiClient";

export const createDonation = async (data) => {
    const res = await apiClient.post("/nova-doacao", data)
    return res
};

export const deleteDonation = async (id) => {
    const res = await apiClient.delete(`/delete-doacao/${id}`)
    return res
};

export const retrieveDonation = async (id) => {
    const res = await apiClient.get(`/doecoes/${id}`)
    return res
};

export const listDonations = async () => {
    const res = await apiClient.get("/doacoes")
    return res
};
