/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { components } from "../../shared/api/schema";
import { apiClient } from "../../shared/api/client";
import { organizationHeaders } from "../../shared/api/transport";
import { scopedPage } from "../../shared/api/page";
type Schema = components["schemas"];
export type Donor = Schema["DonorResponseDTO"];
export type DonorCreate = Schema["DonorCreateRequestDTO"];
export type DonorUpdate = Schema["DonorUpdateRequestDTO"];
export type TeamMember = Schema["TeamMemberResponse"];
export type TeamRequest = Schema["TeamMemberRequest"];
export const teamRoles = {
  DRIVER: "Motorista",
  HELPER: "Ajudante",
  OPERATOR: "Operador",
};
/** Explicit scoped reference-data endpoints; membership is checked by the server. */
export const donors = {
  list: (page: number) => scopedPage<Donor>("/donors", page, "name,asc"),
  async get(id: string) {
    return (
      await apiClient.get<Donor>("/donors/" + id, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async create(payload: DonorCreate) {
    return (
      await apiClient.post<Donor>("/donors", payload, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async update(id: string, payload: DonorUpdate) {
    return (
      await apiClient.put<Donor>("/donors/" + id, payload, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async deactivate(id: string) {
    await apiClient.delete("/donors/" + id, { headers: organizationHeaders() });
  },
};
export const team = {
  list: (page: number) =>
    scopedPage<TeamMember>("/team-members", page, "name,asc"),
  async get(id: string) {
    return (
      await apiClient.get<TeamMember>("/team-members/" + id, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async create(payload: TeamRequest) {
    return (
      await apiClient.post<TeamMember>("/team-members", payload, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async update(id: string, payload: TeamRequest) {
    return (
      await apiClient.put<TeamMember>("/team-members/" + id, payload, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async deactivate(id: string) {
    await apiClient.delete("/team-members/" + id, {
      headers: organizationHeaders(),
    });
  },
};
