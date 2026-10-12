// @vitest-environment jsdom
/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

afterEach(cleanup);

it("keeps the account destination and sign-out accessible without administrator links", async () => {
  const signOut = vi.fn();
  render(<MemoryRouter><Sidebar name="Pessoa da equipe" role="Membro da organização"
    administrator={false} onSignOut={signOut} /></MemoryRouter>);
  expect(screen.queryByRole("heading", { name: "Administração" })).toBeNull();
  expect(screen.queryByRole("link", { name: "Usuários" })).toBeNull();
  expect(screen.getByRole("link", { name: "Minha conta" }).getAttribute("href")).toBe("/profile");
  await userEvent.click(screen.getByRole("button", { name: "Sair da conta" }));
  expect(signOut).toHaveBeenCalledOnce();
});

it("retains global administration and the active report destination in grouped navigation", () => {
  render(<MemoryRouter initialEntries={["/reports/operations"]}><Sidebar name="Administrador"
    role="Administrador Geral" administrator onSignOut={() => undefined} /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "Relatório operacional" }).getAttribute("aria-current")).toBe("page");
  expect(screen.getByRole("link", { name: "Usuários" }).getAttribute("href")).toBe("/users");
  expect(screen.getByRole("link", { name: "Organizações" }).getAttribute("href")).toBe("/organizations");
});
