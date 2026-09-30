/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { beforeEach, expect, it, vi } from "vitest";
import { AxiosHeaders } from "axios";
import { apiClient } from "../../shared/api/client";
import { session } from "../../shared/api/session";
import { donations, collections } from "./api";
import { documents } from "../documents/api";
const storage = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
});
beforeEach(() => {
  session.setToken("synthetic");
  session.selectOrganization("scope");
});
it("preserves decimal strings, uses PUT and excludes donor changes from the update contract", async () => {
  apiClient.defaults.adapter = async (config) => {
    expect(config.url).toBe("/donations/entry");
    expect(config.method).toBe("put");
    expect(config.headers.get("X-Organization-Id")).toBe("scope");
    expect(JSON.parse(config.data)).toEqual({
      totalWeightKg: "0.3000",
      inputItems: [
        {
          materialSubtypeId: "material",
          weightKg: "0.3000",
          volumeM3: "0.0001",
        },
      ],
    });
    return {
      config,
      data: { id: "entry" },
      status: 200,
      statusText: "OK",
      headers: new AxiosHeaders(),
    };
  };
  await donations.update("entry", {
    totalWeightKg: "0.3000",
    inputItems: [
      { materialSubtypeId: "material", weightKg: "0.3000", volumeM3: "0.0001" },
    ],
  });
});
it("uses scoped zero-based collection pagination without legacy search fields", async () => {
  apiClient.defaults.adapter = async (config) => {
    expect(config.url).toBe("/collections");
    expect(config.params).toEqual({
      page: 2,
      size: 10,
      sort: "realizationDate,desc",
    });
    return {
      config,
      data: { content: [], totalElements: 20, totalPages: 2 },
      status: 200,
      statusText: "OK",
      headers: new AxiosHeaders(),
    };
  };
  expect((await collections.list(2)).total).toBe(20);
});
it("uploads the documented multipart field and accepts empty attachment deletion", async () => {
  apiClient.defaults.adapter = async (config) => {
    if (config.method === "post") {
      expect(config.url).toBe("/documents");
      expect(config.data).toBeInstanceOf(FormData);
      expect(config.data.get("documento").name).toBe("proof.pdf");
    } else {
      expect(config.method).toBe("delete");
      expect(config.url).toBe("/documents/proof");
    }
    return {
      config,
      data: config.method === "post" ? { id: "proof" } : "",
      status: config.method === "post" ? 201 : 202,
      statusText: "OK",
      headers: new AxiosHeaders(),
    };
  };
  await documents.upload(
    new File(["%PDF-1.4\n"], "proof.pdf", { type: "application/pdf" }),
  );
  await documents.remove("proof");
});
