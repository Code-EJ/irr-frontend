/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  createClient,
  errorMessage,
  organizationHeaders,
  validateBaseUrl,
} from "./transport";
import { session } from "./session";

const storage = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
});
beforeEach(() => session.clear());
const client = () => createClient("http://localhost:9191/api/v1");
const response = (config: InternalAxiosRequestConfig, data: unknown = {}) => ({
  config,
  data,
  status: 200,
  statusText: "OK",
  headers: new AxiosHeaders(),
});

describe("final v1 transport", () => {
  it.each([
    undefined,
    "http://localhost:9191",
    "https://example.com/api",
    "https://user:password@example.com/api/v1",
    "file:///api/v1",
    "https://example.com/api/v1?secret=value",
  ])("rejects invalid configuration %s", (value) => {
    expect(() => validateBaseUrl(value)).toThrow();
  });
  it("normalizes a final API root", () =>
    expect(validateBaseUrl("http://localhost:9191/api/v1/")).toBe(
      "http://localhost:9191/api/v1",
    ));
  it("reads the current token on each request and removes it on logout", async () => {
    const api = client();
    const headers: unknown[] = [];
    api.defaults.adapter = async (config) => {
      headers.push(config.headers.get("Authorization"));
      return response(config);
    };
    await api.get("/users/me");
    session.setToken("first");
    await api.get("/users/me");
    session.setToken("second");
    await api.get("/users/me");
    session.clear();
    await api.get("/users/me");
    expect(headers).toEqual([
      undefined,
      "Bearer first",
      "Bearer second",
      undefined,
    ]);
  });
  it("requires explicit organization selection and does not infer it from login", () => {
    session.setToken("administrator");
    expect(() => organizationHeaders()).toThrow("Select an organization");
    session.selectOrganization("organization-a");
    expect(organizationHeaders()).toEqual({
      "X-Organization-Id": "organization-a",
    });
    session.clear();
    expect(() => organizationHeaders()).toThrow();
  });
  it("never attaches bearer authorization to login", async () => {
    session.setToken("old");
    const api = client();
    api.defaults.adapter = async (config) => {
      expect(config.headers.has("Authorization")).toBe(false);
      return response(config);
    };
    await api.post("/session/authenticate", {
      email: "test@example.invalid",
      password: "test",
    });
  });
  it("rejects absolute and traversal resource URLs", async () => {
    const api = client();
    const adapter = vi.fn();
    api.defaults.adapter = adapter;
    for (const url of [
      "https://foreign.example/api/v1/users",
      "//foreign.example",
      "/../auth/login",
    ])
      await expect(api.get(url)).rejects.toThrow();
    expect(adapter).not.toHaveBeenCalled();
  });
  it("aborts in-flight requests when organization changes", async () => {
    session.setToken("first");
    session.selectOrganization("a");
    const api = client();
    let complete: (() => void) | undefined;
    const started = new Promise<void>((resolve) => {
      api.defaults.adapter = (config) =>
        new Promise((done) => {
          complete = () => done(response(config, { private: "a" }));
          resolve();
        });
    });
    const pending = api.get("/vehicles", { headers: organizationHeaders() });
    await started;
    session.selectOrganization("b");
    complete?.();
    await expect(pending).rejects.toMatchObject({ code: "ERR_CANCELED" });
  });
  it("rejects a queued request if its captured organization has already changed", async () => {
    session.setToken("token");
    session.selectOrganization("a");
    const api = client();
    const adapter = vi.fn();
    api.defaults.adapter = adapter;
    const pending = api.get("/vehicles", { headers: organizationHeaders() });
    session.selectOrganization("b");
    await expect(pending).rejects.toMatchObject({ code: "ERR_CANCELED" });
    expect(adapter).not.toHaveBeenCalled();
  });
  it("clears the session on protected 401, but not on login failure", async () => {
    session.setToken("expired");
    const api = client();
    api.defaults.adapter = async (config) => {
      throw new AxiosError(
        "Unauthorized",
        "ERR_BAD_REQUEST",
        config,
        undefined,
        { ...response(config), status: 401 },
      );
    };
    await expect(api.post("/session/authenticate")).rejects.toThrow();
    expect(session.getToken()).toBe("expired");
    await expect(api.get("/users/me")).rejects.toThrow();
    expect(session.getToken()).toBeNull();
  });
  it("preserves authorization state on conflicts and shows a useful message", async () => {
    session.setToken("valid");
    const api = client();
    api.defaults.adapter = async (config) => {
      throw new AxiosError("Conflict", "ERR_BAD_REQUEST", config, undefined, {
        ...response(config),
        status: 409,
      });
    };
    try {
      await api.put("/vehicles/id", {});
    } catch (error) {
      expect(errorMessage(error)).toContain("Recarregue");
    }
    expect(session.getToken()).toBe("valid");
  });
});
