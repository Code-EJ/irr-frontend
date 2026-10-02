/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { beforeEach, expect, it, vi } from "vitest";
import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { session } from "../../shared/api/session";
import { apiClient } from "../../shared/api/client";
import { fleet } from "./api";

const storage = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
});
beforeEach(() => {
  session.setToken("test");
  session.selectOrganization("organization");
});
const response = (
  config: InternalAxiosRequestConfig,
  data: unknown,
  status = 200,
) => ({ config, data, status, statusText: "OK", headers: new AxiosHeaders() });
it("uses backend pagination and retains UUID identity", async () => {
  apiClient.defaults.adapter = async (config) => {
    expect(config.url).toBe("/vehicles");
    expect(config.params).toMatchObject({
      page: 0,
      size: 10,
      licensePlate: "ABC",
    });
    expect(config.headers.get("X-Organization-Id")).toBe("organization");
    return response(config, {
      content: [{ id: "uuid", licensePlate: "ABC" }],
      totalElements: 11,
      totalPages: 2,
    });
  };
  expect(await fleet.list(0, "ABC", "")).toEqual({
    items: [{ id: "uuid", licensePlate: "ABC" }],
    total: 11,
    pages: 2,
  });
});
it("updates with PUT and accepts an empty successful delete", async () => {
  apiClient.defaults.adapter = async (config) => {
    expect(config.url).toBe("/vehicles/uuid");
    if (config.method === "delete") return response(config, "", 204);
    expect(config.method).toBe("put");
    expect(JSON.parse(config.data)).toMatchObject({
      licensePlate: "ABC",
      model: "Truck",
      isActive: true,
    });
    return response(config, { id: "uuid" });
  };
  await fleet.update("uuid", {
    licensePlate: "ABC",
    model: "Truck",
    isActive: true,
  });
  await expect(fleet.deactivate("uuid")).resolves.toBeUndefined();
});
it("rejects a legacy response envelope rather than rendering a false empty list", async () => {
  apiClient.defaults.adapter = async (config) =>
    response(config, { data: [], total: 0 });
  await expect(fleet.list(0, "", "")).rejects.toThrow("Invalid vehicle page");
});
