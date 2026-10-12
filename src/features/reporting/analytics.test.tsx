// @vitest-environment jsdom
/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { apiClient } from "../../shared/api/client";
import { session } from "../../shared/api/session";
import AnalyticsPage from "./AnalyticsPage";
import { analyticsReport, type AnalyticsReport } from "./analyticsApi";

const comparison = { unit: "km", consideredExecutions: 2, excludedExecutions: 1,
  planned: "30", actual: "40", signedDeviation: "10", absoluteDeviation: "10", percentageDeviation: "33.333333" };
const productivity = { unit: "kg/h", consideredExecutions: 2, collectionCount: 3, excludedExecutions: 1,
  withoutLinkedCollections: 1, missingDenominatorExecutions: 0, zeroDenominatorExecutions: 0,
  collectedWeightKg: "120", denominator: "10800", value: "40" };
const result: AnalyticsReport = { organizationId: "org", from: "2026-10-08", to: "2026-10-08",
  timezone: "America/Sao_Paulo", startInclusive: "2026-10-08T00:00:00-03:00", endExclusive: "2026-10-09T00:00:00-03:00",
  definitionVersion: "analytics-1", generatedAt: "2026-10-10T12:00:00Z", municipalityId: null, routeId: null, vehicleId: null,
  completedExecutions: 3, unlinkedCollectionsInPeriod: 1, distanceComparison: comparison,
  durationComparison: { ...comparison, unit: "s" },
  coverage: { consideredExecutions: 2, excludedExecutions: 1, declaredSections: 2, coveredSections: 1, duplicateRows: 1, conflictingSections: 0, percentage: "50" },
  hourlyProductivity: productivity, distanceProductivity: { ...productivity, unit: "kg/km", denominator: "40", value: "3" },
  revenue: { currency: "BRL", available: true, availabilityReason: "AVAILABLE", consideredSales: 1, excludedDraftSales: 1, excludedReversedSales: 2, amount: "12.34" } };
function response(config: InternalAxiosRequestConfig, data: unknown, status = 200) {
  return { config, data, status, statusText: "Fixture", headers: new AxiosHeaders() };
}
function renderPage() { render(<MemoryRouter><AnalyticsPage/></MemoryRouter>); }
beforeEach(() => {
  session.setToken("fixture"); session.selectOrganization("org");
  apiClient.defaults.adapter = async config => response(config, config.url === "/reports/analytics" ? result : { content: [], totalElements: 0, totalPages: 0 });
});
afterEach(() => { cleanup(); session.clear(); vi.restoreAllMocks(); });

it("displays server ratios, definitions and exact matched populations", async () => {
  renderPage();
  expect(screen.getByText("Carregando indicadores…").getAttribute("role")).toBe("status");
  expect(await screen.findByText("40 kg/h")).toBeTruthy();
  expect(screen.getByText("3 kg/km")).toBeTruthy();
  expect(screen.getAllByText("33,333333 %")).toHaveLength(2);
  expect(screen.getByText(/Representa quantidade de trechos/)).toBeTruthy();
  expect(screen.getByText(/1 rascunhos excluídos · 2 vendas revertidas/)).toBeTruthy();
  await userEvent.click(screen.getAllByText("Ver cálculo e qualidade dos dados")[0]);
  expect(screen.getByText("Denominador: 10800 s dessas mesmas execuções.")).toBeTruthy();
  expect(screen.getByText(/Definição analytics-1/)).toBeTruthy();
});

it("preserves unavailable metrics and unsupported geographic revenue without fabricating zero", async () => {
  apiClient.defaults.adapter = async config => response(config, config.url === "/reports/analytics" ? {
    ...result, completedExecutions: 0,
    distanceComparison: { ...comparison, planned: null, actual: null, signedDeviation: null, absoluteDeviation: null, percentageDeviation: null },
    coverage: { ...result.coverage, percentage: null, conflictingSections: 1 },
    hourlyProductivity: { ...productivity, value: null }, revenue: { ...result.revenue, available: false, amount: null },
  } : { content: [], totalElements: 0, totalPages: 0 });
  renderPage();
  expect(await screen.findByText(/Nenhuma execução concluída/)).toBeTruthy();
  expect(screen.getByText(/Receita indisponível com filtros/)).toBeTruthy();
  expect(screen.queryByText("0 BRL")).toBeNull();
  expect(screen.getAllByText("Indisponível").length).toBeGreaterThan(5);
});

it("displays authoritative precision rather than recomputing a ratio in the browser", async () => {
  apiClient.defaults.adapter = async config => response(config, config.url === "/reports/analytics" ? {
    ...result, hourlyProductivity: { ...productivity, value: "123456789.123456" },
  } : { content: [], totalElements: 0, totalPages: 0 });
  renderPage();
  expect(await screen.findByText("123456789,123456 kg/h")).toBeTruthy();
});

it("updates historical revenue when the live backend result changes", async () => {
  let amount = "12.34";
  apiClient.defaults.adapter = async config => response(config, config.url === "/reports/analytics" ? { ...result, revenue: { ...result.revenue, amount } } : { content: [], totalElements: 0, totalPages: 0 });
  renderPage(); await screen.findByText("12,34 BRL"); amount = "0";
  await userEvent.click(screen.getByRole("button", { name: "Atualizar indicadores" }));
  expect(await screen.findByText("0 BRL")).toBeTruthy();
});

it("applies dates explicitly, sanitizes failures and retries", async () => {
  let failing = true; let parameters: unknown;
  apiClient.defaults.adapter = async config => {
    if (config.url === "/reports/analytics") {
      parameters = config.params;
      if (failing) throw new AxiosError("Private details", "500", config, undefined, response(config, {}, 500));
    }
    return response(config, config.url === "/reports/analytics" ? result : { content: [], totalElements: 0, totalPages: 0 });
  };
  renderPage(); expect((await screen.findByRole("alert")).textContent).not.toContain("Private"); failing = false;
  await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" })); await screen.findByText("40 kg/h");
  await userEvent.clear(screen.getByLabelText("Data inicial"));
  await userEvent.type(screen.getByLabelText("Data inicial"), "2026-10-02");
  await userEvent.click(screen.getByRole("button", { name: "Aplicar filtros" }));
  await waitFor(() => expect(parameters).toMatchObject({ from: "2026-10-02" }));
});

it("sends only selected organization scope and explicit versioned analytics parameters", async () => {
  let received: InternalAxiosRequestConfig | undefined;
  apiClient.defaults.adapter = async config => { received = config; return response(config, result); };
  await analyticsReport({ from: "2026-10-08", to: "2026-10-08", routeId: "route" });
  expect(received?.url).toBe("/reports/analytics");
  expect(received?.headers.get("X-Organization-Id")).toBe("org");
  expect(received?.params).toEqual({ from: "2026-10-08", to: "2026-10-08", routeId: "route" });
  session.selectOrganization(null);
  await expect(analyticsReport({ from: "2026-10-08", to: "2026-10-08" })).rejects.toThrow("Select an organization");
});
