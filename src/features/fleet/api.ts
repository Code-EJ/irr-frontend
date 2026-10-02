/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { apiClient } from "../../shared/api/client";
import { organizationHeaders } from "../../shared/api/transport";
import type { components } from "../../shared/api/schema";
export type Vehicle = components["schemas"]["VehicleResponseDTO"] & {
  id: string;
};
export type VehicleCreate = components["schemas"]["VehicleCreateRequestDTO"];
export type VehicleUpdate = components["schemas"]["VehicleUpdateRequestDTO"];
function vehicle(value: components["schemas"]["VehicleResponseDTO"]): Vehicle {
  if (!value.id) throw new Error("Vehicle response is missing its UUID.");
  return { ...value, id: value.id };
}
export const fleet = {
  async list(page: number, licensePlate: string, model: string) {
    const { data } = await apiClient.get<
      components["schemas"]["PageVehicleResponseDTO"]
    >("/vehicles", {
      headers: organizationHeaders(),
      params: {
        page,
        size: 10,
        sort: "licensePlate,asc",
        licensePlate: licensePlate || undefined,
        model: model || undefined,
      },
    });
    if (
      !data.content ||
      data.totalElements === undefined ||
      data.totalPages === undefined
    )
      throw new Error("Invalid vehicle page.");
    return {
      items: data.content.map(vehicle),
      total: data.totalElements,
      pages: data.totalPages,
    };
  },
  async get(id: string) {
    return vehicle(
      (
        await apiClient.get<Vehicle>("/vehicles/" + id, {
          headers: organizationHeaders(),
        })
      ).data,
    );
  },
  async create(input: VehicleCreate) {
    return vehicle(
      (
        await apiClient.post<Vehicle>("/vehicles", input, {
          headers: organizationHeaders(),
        })
      ).data,
    );
  },
  async update(id: string, input: VehicleUpdate) {
    return vehicle(
      (
        await apiClient.put<Vehicle>("/vehicles/" + id, input, {
          headers: organizationHeaders(),
        })
      ).data,
    );
  },
  async deactivate(id: string) {
    await apiClient.delete("/vehicles/" + id, {
      headers: organizationHeaders(),
    });
  },
};
