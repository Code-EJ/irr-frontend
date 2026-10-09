// @vitest-environment jsdom
/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { apiClient } from "../../shared/api/client";
import { session } from "../../shared/api/session";
import SalePage from "./SalePage";
import BuyersPage from "./BuyersPage";
import { sales, type Sale } from "./api";
let manager = false;
vi.mock("../identity/SessionProvider", () => ({ useSession: () => ({ canManage: manager }) }));
const original: Sale = { id: "sale", status: "DRAFT", version: 0, saleDate: "2026-10-09T12:00:00Z", buyerId: "buyer", nfeAttachmentId: "invoice", currency: "BRL", totalValue: "0.06", items: [{ stockLotId: "lot", materialSubtypeId: "material", weightKg: "0.0500", volumeM3: "0.0050", unitPrice: "1.2345", lineTotal: "0.06" }] };
let current: Sale;
const response = (config: InternalAxiosRequestConfig, data: unknown, status = 200) => ({ config, data, status, statusText: "Fixture", headers: new AxiosHeaders() });
beforeEach(() => {
  session.setToken("synthetic"); session.selectOrganization("org"); manager = false; current = structuredClone(original);
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value: function(this: HTMLDialogElement) { this.setAttribute("open", ""); } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: function(this: HTMLDialogElement) { this.removeAttribute("open"); } });
  apiClient.defaults.adapter = async config => response(config, config.url === "/sales/sale" ? current : config.url === "/buyers/buyer" ? { id: "buyer", name: "Comprador" } : config.url === "/documents/invoice" ? { id: "invoice", fileName: "Nota.pdf" } : { content: [], totalElements: 0, totalPages: 0 });
});
afterEach(() => { cleanup(); session.clear(); vi.restoreAllMocks(); });
function renderSale(path = "/sales/sale") { render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/sales/new" element={<SalePage />} /><Route path="/sales/:id" element={<SalePage />} /><Route path="/sales" element={<p>Lista de vendas</p>} /></Routes></MemoryRouter>); }
it("requires saving local changes before posting and retains exact versioned line payloads", async () => {
  let sent: InternalAxiosRequestConfig | undefined;
  const adapter = apiClient.defaults.adapter;
  apiClient.defaults.adapter = async config => {
    if (config.method === "put") { sent = config; current = { ...current, version: 1, items: JSON.parse(config.data).items }; return response(config, current); }
    return typeof adapter === "function" ? adapter(config) : response(config, {});
  };
  renderSale(); await screen.findByRole("heading", { name: "Detalhes da venda" });
  expect((screen.getByRole("button", { name: "Registrar venda" }) as HTMLButtonElement).disabled).toBe(false);
  await userEvent.clear(screen.getByLabelText("Preço do item 1 (BRL/kg)"));
  await userEvent.type(screen.getByLabelText("Preço do item 1 (BRL/kg)"), "1,2346");
  expect((screen.getByRole("button", { name: "Registrar venda" }) as HTMLButtonElement).disabled).toBe(true);
  await userEvent.click(screen.getByRole("button", { name: "Salvar rascunho" }));
  await waitFor(() => expect(sent).toBeDefined());
  expect(JSON.parse(sent!.data)).toMatchObject({ version: 0, nfeAttachmentId: "invoice", items: [{ stockLotId: "lot", weightKg: "0.0500", unitPrice: "1.2346" }] });
  expect(sent!.headers.get("X-Organization-Id")).toBe("org");
});
it("reuses the transition key and version after a network failure", async () => {
  const requests: InternalAxiosRequestConfig[] = [];
  const adapter = apiClient.defaults.adapter;
  apiClient.defaults.adapter = async config => {
    if (config.url === "/sales/sale/post") {
      requests.push(config);
      if (requests.length === 1) throw new AxiosError("network", "ERR_NETWORK", config);
      current = { ...current, status: "POSTED", version: 1 }; return response(config, current);
    }
    return typeof adapter === "function" ? adapter(config) : response(config, {});
  };
  renderSale(); await screen.findByRole("heading", { name: "Detalhes da venda" });
  await userEvent.click(screen.getByRole("button", { name: "Registrar venda" }));
  await userEvent.click(screen.getByRole("button", { name: "Confirmar ação" }));
  await screen.findByRole("alert");
  await userEvent.click(screen.getByRole("button", { name: "Confirmar ação" }));
  await screen.findByRole("button", { name: "Reverter venda" });
  expect(requests).toHaveLength(2);
  expect(requests[0].headers.get("Idempotency-Key")).toBe(requests[1].headers.get("Idempotency-Key"));
  expect(JSON.parse(requests[1].data)).toEqual({ version: 0 });
  expect(screen.queryByRole("button", { name: "Salvar rascunho" })).toBeNull();
});
it("does not expose buyer mutations to an organization member", async () => {
  render(<BuyersPage />); await screen.findByText("Nenhum comprador nesta página.");
  expect(screen.queryByRole("button", { name: "Adicionar comprador" })).toBeNull();
});
it("blocks another draft submission after uncertain creation instead of duplicating it", async () => {
  let creations = 0;
  apiClient.defaults.adapter = async config => {
    if (config.url === "/sales" && config.method === "post") { creations++; throw new AxiosError("network", "ERR_NETWORK", config); }
    const data = config.url === "/inventory/lots" ? [{ id: "lot", materialSubtypeId: "material", materialName: "Papel", availableWeightKg: "1.0000" }] : config.url === "/buyers" ? [{ id: "buyer", name: "Comprador" }] : [];
    return response(config, config.url === "/buyers/buyer" ? { id: "buyer", name: "Comprador" } : { content: data, totalElements: data.length, totalPages: 1 });
  };
  renderSale("/sales/new"); await screen.findByRole("option", { name: /Papel/ });
  await userEvent.selectOptions(screen.getByLabelText("Comprador"), "buyer");
  await userEvent.selectOptions(screen.getByLabelText("Lote para adicionar"), "lot");
  await userEvent.click(screen.getByRole("button", { name: "Adicionar lote" }));
  await userEvent.type(screen.getByLabelText("Peso do item 1 (kg)"), "0.0001");
  await userEvent.click(screen.getByRole("button", { name: "Salvar rascunho" }));
  await screen.findByText(/O resultado da criação não pôde ser confirmado/);
  expect((screen.getByRole("button", { name: "Salvar rascunho" }) as HTMLButtonElement).disabled).toBe(true);
  expect(creations).toBe(1);
});
it("sends the draft version on deactivation and rejects incomplete sale identity", async () => {
  apiClient.defaults.adapter = async config => { expect(config.method).toBe("delete"); expect(config.params).toEqual({ version: 7 }); return response(config, undefined, 204); };
  await sales.deactivate("sale", 7);
  apiClient.defaults.adapter = async config => response(config, { status: "DRAFT" });
  await expect(sales.get("sale")).rejects.toThrow("Invalid sale response");
});
