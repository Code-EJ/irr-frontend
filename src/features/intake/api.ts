/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { components } from "../../shared/api/schema";
import { apiClient } from "../../shared/api/client";
import { organizationHeaders } from "../../shared/api/transport";
import { scopedPage } from "../../shared/api/page";
type Schema = components["schemas"];
export type Donation = Schema["DonationResponseDTO"];
export type Collection = Schema["CollectionResponseDTO"];
export type InputLine = Schema["InputItemRequestDTO"];
export type DonationCreate = Schema["DonationCreateRequestDTO"];
export type DonationUpdate = Schema["DonationUpdateRequestDTO"];
export type CollectionRequest = Schema["CollectionCreateRequestDTO"];
/** Raw intake is distinct from posted processing and never directly changes saleable stock. */
export const donations = {
  list: (page: number) =>
    scopedPage<Donation>("/donations", page, "donationDate,desc"),
  async get(id: string) {
    return (
      await apiClient.get<Donation>("/donations/" + id, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async create(payload: DonationCreate) {
    return (
      await apiClient.post<Donation>("/donations", payload, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async update(id: string, payload: DonationUpdate) {
    return (
      await apiClient.put<Donation>("/donations/" + id, payload, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async deactivate(id: string) {
    await apiClient.delete("/donations/" + id, {
      headers: organizationHeaders(),
    });
  },
};
export const collections = {
  list: (page: number) =>
    scopedPage<Collection>("/collections", page, "realizationDate,desc"),
  async get(id: string) {
    return (
      await apiClient.get<Collection>("/collections/" + id, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async create(payload: CollectionRequest) {
    return (
      await apiClient.post<Collection>("/collections", payload, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async update(id: string, payload: CollectionRequest) {
    return (
      await apiClient.put<Collection>("/collections/" + id, payload, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async deactivate(id: string) {
    await apiClient.delete("/collections/" + id, {
      headers: organizationHeaders(),
    });
  },
};
