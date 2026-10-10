// @vitest-environment jsdom
/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { afterEach, beforeEach, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosHeaders } from "axios";
import AppRouter from "./Router";
import { apiClient } from "../shared/api/client";
import { session } from "../shared/api/session";

const originalAdapter = apiClient.defaults.adapter;
let paths: string[];
let mandatory: boolean;
let memberRole: "MEMBER" | "MANAGER";
beforeEach(() => {
  localStorage.clear();
  session.setToken("route-fixture");
  paths = [];
  mandatory = false;
  memberRole = "MEMBER";
  apiClient.defaults.adapter = async config => {
    paths.push(config.url!);
    const data = config.url === "/users/me"
      ? { id: "actor", fullName: "Operador", userRole: "REPRESENTATIVE", mustChangePassword: mandatory }
      : config.url === "/organizations"
        ? { content: [{ id: "org", name: "Organização de teste" }], totalElements: 1 }
        : config.url === "/organizations/org/membership"
          ? { organizationId: "org", role: memberRole, active: true }
          : (() => { throw new Error(`Unexpected protected request: ${config.url}`); })();
    return { config, data, status: 200, statusText: "OK", headers: new AxiosHeaders() };
  };
});
afterEach(() => {
  cleanup();
  session.clear();
  apiClient.defaults.adapter = originalAdapter;
});

/** Runs the real route tree so hidden navigation cannot substitute for access control. */
function open(path: string) {
  window.history.replaceState({}, "", path);
  render(<AppRouter />);
}

it.each(["/users", "/organizations/new"])("blocks a direct non-administrator visit to %s without loading its data", async path => {
  open(path);
  await screen.findByRole("heading", { name: "Acesso restrito" });
  expect(paths).toEqual(["/users/me", "/organizations"]);
  expect(screen.queryByRole("link", { name: "Usuários" })).toBeNull();
});

it("requires organization selection before fetching scoped Analytics", async () => {
  open("/reports/analytics");
  await screen.findByRole("heading", { name: "Selecione uma organização" });
  expect(paths).toEqual(["/users/me", "/organizations"]);
});

it("blocks a member's direct vehicle mutation route before loading a vehicle", async () => {
  session.selectOrganization("org");
  open("/vehicle-update/vehicle");
  expect((await screen.findByRole("alert")).textContent).toContain("alterar veículos");
  expect(paths).toEqual(["/users/me", "/organizations", "/organizations/org/membership"]);
});

it("does not grant global administration to an organization manager", async () => {
  memberRole = "MANAGER";
  session.selectOrganization("org");
  open("/users/new");
  await screen.findByRole("heading", { name: "Acesso restrito" });
  expect(paths).toEqual(["/users/me", "/organizations", "/organizations/org/membership"]);
});

it("keeps mandatory credential changes ahead of administration and organization loading", async () => {
  mandatory = true;
  open("/users");
  await screen.findByLabelText("Senha atual");
  expect(window.location.pathname).toBe("/profile/password");
  expect(paths).toEqual(["/users/me"]);
});

it("focuses the main landmark from the skip link and after client-side navigation", async () => {
  open("/menu");
  await screen.findByRole("heading", { name: "Olá, Operador." });
  const user = userEvent.setup();
  const main = screen.getByRole("main", { name: "Conteúdo principal" });
  expect(main.tabIndex).toBe(-1);
  await user.click(screen.getByRole("link", { name: "Pular para o conteúdo" }));
  expect(document.activeElement).toBe(main);
  await user.click(screen.getByRole("link", { name: "Analytics" }));
  await screen.findByRole("heading", { name: "Selecione uma organização" });
  await waitFor(() => expect(document.activeElement).toBe(main));
});

it("returns to login and clears the selected organization after sign-out", async () => {
  session.selectOrganization("org");
  open("/menu");
  await screen.findByRole("heading", { name: "Olá, Operador." });
  await userEvent.click(screen.getByRole("button", { name: "Sair da conta" }));
  await waitFor(() => expect(window.location.pathname).toBe("/login"));
  expect(session.getToken()).toBeNull();
  expect(session.getOrganization()).toBeNull();
});

it("keeps a failed account load recoverable without mounting private content", async () => {
  const successfulAdapter = apiClient.defaults.adapter;
  apiClient.defaults.adapter = async () => { throw new Error("Private diagnostic fixture"); };
  open("/menu");
  const alert = await screen.findByRole("alert");
  expect(alert.textContent).not.toContain("Private diagnostic fixture");
  expect(screen.queryByRole("navigation")).toBeNull();
  apiClient.defaults.adapter = successfulAdapter;
  await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
  await screen.findByRole("heading", { name: "Olá, Operador." });
  expect(session.getToken()).toBe("route-fixture");
});
