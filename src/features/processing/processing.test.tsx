// @vitest-environment jsdom
/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { apiClient } from "../../shared/api/client";
import { session } from "../../shared/api/session";
import { commandIdentity } from "./api";
import ProcessingForm from "./ProcessingForm";
import InventoryPage from "./InventoryPage";
import ProcessingPage from "./ProcessingPage";
const response = (config: InternalAxiosRequestConfig, data: unknown, status = 200) => ({ config, data, status, statusText: "OK", headers: new AxiosHeaders() });
beforeEach(() => { session.setToken("synthetic"); session.selectOrganization("org");
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value: function(this: HTMLDialogElement) { this.setAttribute("open", ""); } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: function(this: HTMLDialogElement) { this.removeAttribute("open"); } });
});
afterEach(() => { cleanup(); session.clear(); vi.restoreAllMocks(); });
it("retains retry identity for unchanged commands and replaces it after edits", () => {
  const key = commandIdentity();
  const first = key({ weightKg: "0.0001" });
  expect(key({ weightKg: "0.0001" })).toBe(first);
  expect(key({ weightKg: "0.0002" })).not.toBe(first);
});
it("preserves decimal input and retry identity after uncertain pressing delivery", async () => {
  const requests: InternalAxiosRequestConfig[] = [];
  apiClient.defaults.adapter = async config => {
    if (config.method === "post") { requests.push(config); throw new AxiosError("network", "ERR_NETWORK", config); }
    return response(config, { content: [{ id: "lot", sortedItemId: "sorted", materialSubtypeId: "subtype", materialName: "Papel", availableWeightKg: "1.0000", availableVolumeM3: "1.0000" }], totalElements: 1, totalPages: 1 });
  };
  render(<MemoryRouter><ProcessingForm kind="pressings" /></MemoryRouter>);
  await screen.findByRole("option", { name: /Papel/ });
  await userEvent.selectOptions(screen.getByLabelText("Lote de triagem"), "lot");
  const date = screen.getByLabelText("Data e hora da operação (opcional)");
  await userEvent.type(date, "2026-10-01T10:30");
  await userEvent.type(screen.getByLabelText("Peso do fardo (kg)"), "0,0001");
  await userEvent.type(screen.getByLabelText("Volume inicial (m³)"), "0,0200");
  await userEvent.type(screen.getByLabelText("Volume final (m³)"), "0,0100");
  await userEvent.click(screen.getByRole("button", { name: "Registrar prensagem" }));
  await screen.findByRole("alert");
  await userEvent.click(screen.getByRole("button", { name: "Registrar prensagem" }));
  await waitFor(() => expect(requests).toHaveLength(2));
  expect(requests[0].headers.get("Idempotency-Key")).toBe(requests[1].headers.get("Idempotency-Key"));
  expect(requests[0].headers.get("X-Organization-Id")).toBe("org");
  expect(JSON.parse(requests[0].data).pressingDate).toBe(new Date("2026-10-01T10:30").toISOString());
  expect(JSON.parse(requests[1].data)).toEqual(JSON.parse(requests[0].data));
  expect(JSON.parse(requests[0].data).pressedBales[0]).toMatchObject({ weightKg: "0.0001", initialVolumeM3: "0.0200", finalVolumeM3: "0.0100", destinationType: "STOCK" });
});
it("displays authoritative signed movements without rounding or mutation controls", async () => {
  apiClient.defaults.adapter = async config => response(config, { content: config.url === "/inventory/movements" ? [{ id: "movement", kind: "PRESSING", weightDeltaKg: "0.0000", volumeDeltaM3: "-0.0001" }] : [], totalElements: 1, totalPages: 1 });
  render(<InventoryPage />);
  await userEvent.click(screen.getByRole("button", { name: "Movimentações" }));
  expect(await screen.findByText("-0,0001")).toBeTruthy();
  expect(screen.queryByRole("button", { name: /Excluir|Editar/ })).toBeNull();
});

it("keeps a labelled reversal confirmation and its retry identity after a stock conflict", async () => {
  const requests: InternalAxiosRequestConfig[] = [];
  apiClient.defaults.adapter = async config => {
    if (config.method === "post") { requests.push(config); throw new AxiosError("conflict", "ERR_BAD_REQUEST", config, undefined, response(config, { message: "Estoque consumido" }, 409)); }
    return response(config, { content: [{ id: "sorting", status: "POSTED", sortingDate: "2026-10-01T10:30:00Z" }], totalElements: 1, totalPages: 1 });
  };
  render(<MemoryRouter><ProcessingPage kind="sortings" /></MemoryRouter>);
  await userEvent.click(await screen.findByRole("button", { name: /^Reverter$/ }));
  expect(screen.getByRole("heading", { name: "Reverter triagem?" })).toBeTruthy();
  await userEvent.click(screen.getByRole("button", { name: "Confirmar reversão" }));
  await waitFor(() => expect(requests).toHaveLength(1));
  await userEvent.click(screen.getByRole("button", { name: "Confirmar reversão" }));
  await waitFor(() => expect(requests).toHaveLength(2));
  expect(requests[0].headers.get("Idempotency-Key")).toBe(requests[1].headers.get("Idempotency-Key"));
  expect(screen.getByRole("heading", { name: "Reverter triagem?" })).toBeTruthy();
});

it("posts all queued pressing lines together and refuses to silently discard an unfinished line", async () => {
  const requests: InternalAxiosRequestConfig[] = [];
  apiClient.defaults.adapter = async config => {
    if (config.method === "post") { requests.push(config); throw new AxiosError("network", "ERR_NETWORK", config); }
    return response(config, { content: [{ id: "lot", sortedItemId: "sorted", materialSubtypeId: "subtype", materialName: "Papel", availableWeightKg: "1.0000", availableVolumeM3: "1.0000" }], totalElements: 1, totalPages: 1 });
  };
  render(<MemoryRouter><ProcessingForm kind="pressings" /></MemoryRouter>);
  await screen.findByRole("option", { name: /Papel/ });
  await userEvent.selectOptions(screen.getByLabelText("Lote de triagem"), "lot");
  for (const weight of ["0,1000", "0,2000"]) {
    await userEvent.type(screen.getByLabelText("Peso do fardo (kg)"), weight);
    await userEvent.type(screen.getByLabelText("Volume inicial (m³)"), "0,0200");
    await userEvent.type(screen.getByLabelText("Volume final (m³)"), "0,0100");
    await userEvent.click(screen.getByRole("button", { name: "Adicionar item ao lote" }));
  }
  expect(screen.getByRole("heading", { name: "Itens do lote (2)" })).toBeTruthy();
  await userEvent.type(screen.getByLabelText("Peso do fardo (kg)"), "0,3000");
  await userEvent.click(screen.getByRole("button", { name: "Registrar prensagem" }));
  expect(await screen.findByText(/Adicione o item em edição/)).toBeTruthy();
  expect(requests).toHaveLength(0);
  await userEvent.clear(screen.getByLabelText("Peso do fardo (kg)"));
  await userEvent.click(screen.getByRole("button", { name: "Registrar prensagem" }));
  await waitFor(() => expect(requests).toHaveLength(1));
  expect(JSON.parse(requests[0].data)).toEqual({ pressedBales: ["0.1000", "0.2000"].map(weightKg => ({ sortedItemId: "sorted", materialSubtypeId: "subtype", weightKg, initialVolumeM3: "0.0200", finalVolumeM3: "0.0100", destinationType: "STOCK" })) });
  await userEvent.click(screen.getByRole("button", { name: "Registrar prensagem" }));
  await waitFor(() => expect(requests).toHaveLength(2));
  expect(requests[1].headers.get("Idempotency-Key")).toBe(requests[0].headers.get("Idempotency-Key"));
  await userEvent.click(screen.getByRole("button", { name: "Remover item 1" }));
  await userEvent.click(screen.getByRole("button", { name: "Registrar prensagem" }));
  await waitFor(() => expect(requests).toHaveLength(3));
  expect(JSON.parse(requests[2].data).pressedBales).toHaveLength(1);
  expect(requests[2].headers.get("Idempotency-Key")).not.toBe(requests[0].headers.get("Idempotency-Key"));
});
