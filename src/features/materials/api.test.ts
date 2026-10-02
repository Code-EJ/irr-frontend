/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { beforeEach, expect, it, vi } from "vitest";
import { AxiosHeaders } from "axios";
import { catalog, type CatalogLevel } from "./api";
import { apiClient } from "../../shared/api/client";
import { session } from "../../shared/api/session";
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
it.each(["categories", "types", "subtypes"] as CatalogLevel[])(
  "uses the scoped %s contract and preserves the optimistic version",
  async (level) => {
    apiClient.defaults.adapter = async (config) => {
      expect(config.url).toBe("/materials/" + level + "/uuid");
      expect(config.method).toBe("put");
      expect(config.headers.get("X-Organization-Id")).toBe("organization");
      expect(JSON.parse(config.data)).toEqual({ name: "Updated", version: 3 });
      return {
        config,
        data: { id: "uuid", name: "Updated", version: 4 },
        status: 200,
        statusText: "OK",
        headers: new AxiosHeaders(),
      };
    };
    expect((await catalog.update(level, "uuid", "Updated", 3)).version).toBe(4);
  },
);
it("filters children by the documented parent field", async () => {
  apiClient.defaults.adapter = async (config) => {
    expect(config.params).toMatchObject({
      categoryId: "parent",
      name: "Plastic",
      page: 1,
      size: 10,
    });
    return {
      config,
      data: { content: [], totalElements: 0, totalPages: 0 },
      status: 200,
      statusText: "OK",
      headers: new AxiosHeaders(),
    };
  };
  await catalog.list("types", 1, "Plastic", "parent");
});
it("refuses to create an orphaned subtype before sending a request", async () => {
  const adapter = vi.fn();
  apiClient.defaults.adapter = adapter;
  await expect(catalog.create("subtypes", "PET")).rejects.toThrow(
    "Select the parent",
  );
  expect(adapter).not.toHaveBeenCalled();
});
