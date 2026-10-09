// @vitest-environment jsdom
/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { afterEach, beforeEach, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { apiClient } from "../../shared/api/client";
import { session } from "../../shared/api/session";
import { commandIdentity } from "./api";
import ProcessingForm from "./ProcessingForm";
import InventoryPage from "./InventoryPage";
const response = (config: InternalAxiosRequestConfig, data: unknown, status = 200) => ({ config, data, status, statusText: "OK", headers: new AxiosHeaders() });
beforeEach(() => { session.setToken("synthetic"); session.selectOrganization("org"); });
afterEach(() => { cleanup(); session.clear(); });
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
  await userEvent.type(screen.getByLabelText("Peso do fardo (kg)"), "0,0001");
  await userEvent.type(screen.getByLabelText("Volume inicial (m³)"), "0,0200");
  await userEvent.type(screen.getByLabelText("Volume final (m³)"), "0,0100");
  await userEvent.click(screen.getByRole("button", { name: "Registrar prensagem" }));
  await screen.findByRole("alert");
  await userEvent.click(screen.getByRole("button", { name: "Registrar prensagem" }));
  await waitFor(() => expect(requests).toHaveLength(2));
  expect(requests[0].headers.get("Idempotency-Key")).toBe(requests[1].headers.get("Idempotency-Key"));
  expect(requests[0].headers.get("X-Organization-Id")).toBe("org");
  expect(JSON.parse(requests[0].data).pressedBales[0]).toMatchObject({ weightKg: "0.0001", initialVolumeM3: "0.0200", finalVolumeM3: "0.0100", destinationType: "STOCK" });
});
it("displays authoritative signed movements without rounding or mutation controls", async () => {
  apiClient.defaults.adapter = async config => response(config, { content: config.url === "/inventory/movements" ? [{ id: "movement", kind: "PRESSING", weightDeltaKg: "0.0000", volumeDeltaM3: "-0.0001" }] : [], totalElements: 1, totalPages: 1 });
  render(<InventoryPage />);
  await userEvent.click(screen.getByRole("button", { name: "Movimentações" }));
  expect(await screen.findByText("-0,0001")).toBeTruthy();
  expect(screen.queryByRole("button", { name: /Excluir|Editar/ })).toBeNull();
});
