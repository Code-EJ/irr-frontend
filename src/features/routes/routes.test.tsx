// @vitest-environment jsdom
/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { apiClient } from "../../shared/api/client";
import { session } from "../../shared/api/session";
import RoutesPage from "./RoutesPage";
import RouteForm from "./RouteForm";
import ExecutionPage from "./ExecutionPage";
import ExecutionForm from "./ExecutionForm";
import IntakeForm from "../intake/IntakeForm";
import { routes, executions } from "./api";
let manager = true;
vi.mock("../identity/SessionProvider", () => ({
  useSession: () => ({
    canManage: manager,
    account: { userRole: "ADMINISTRATOR" },
  }),
}));
const plan = {
  id: "route",
  organizationId: "scope",
  municipalityId: "city",
  municipalityName: "Belo Horizonte",
  municipalityIbgeCode: "3106200",
  municipalityStateCode: "MG",
  name: "Rota central",
  status: "ACTIVE",
  isActive: true,
  version: 3,
  plannedDistanceKm: "8.125",
  plannedDurationMinutes: 90,
  areas: [
    {
      id: "area",
      neighborhoodId: "district",
      neighborhoodName: "Centro",
      sequence: 1,
      street: "Rua A",
    },
  ],
  createdBy: "actor",
  updatedBy: "actor",
  createdAt: "2026-10-04T10:00:00Z",
  updatedAt: "2026-10-04T10:00:00Z",
};
const execution = {
  ...plan,
  id: "execution",
  routeId: "route",
  routeVersion: 3,
  routeName: "Rota central",
  version: 2,
  status: "IN_PROGRESS",
  plannedStartAt: "2026-10-04T10:00:00Z",
  vehicleId: "vehicle",
  vehicleLicensePlate: "ABC1D23",
  driverId: "driver",
  driverName: "Motorista",
  startedAt: "2026-10-04T10:00:00.123456Z",
  finishedAt: "2026-10-04T11:00:00.654321Z",
  distanceKm: "8.125",
  areas: [{ ...plan.areas[0], sourceAreaId: "area", covered: false }],
  team: [{ teamMemberId: "helper", name: "Ajudante", role: "HELPER" }],
};
function response(
  config: InternalAxiosRequestConfig,
  data: unknown = null,
  status = 200,
) {
  return {
    config,
    data,
    status,
    statusText: "Fixture",
    headers: new AxiosHeaders(),
  };
}
function reject(config: InternalAxiosRequestConfig, status: number) {
  return new AxiosError(
    "Fixture",
    String(status),
    config,
    undefined,
    response(config, {}, status),
  );
}
const page = (items: unknown[], totalPages = 1) => ({
  content: items,
  totalElements: items.length,
  totalPages,
});
function references(config: InternalAxiosRequestConfig) {
  const path = config.url!.split("?")[0];
  if (path === "/municipalities")
    return page([
      {
        id: "city",
        name: "Belo Horizonte",
        stateCode: "MG",
        ibgeCode: "3106200",
      },
    ]);
  if (path === "/municipalities/city")
    return {
      id: "city",
      name: "Belo Horizonte",
      stateCode: "MG",
      ibgeCode: "3106200",
    };
  if (path === "/neighborhoods")
    return page([{ id: "district", name: "Centro", municipalityId: "city" }]);
  if (path === "/neighborhoods/district")
    return { id: "district", name: "Centro", municipalityId: "city" };
  if (path === "/vehicles")
    return page([
      { id: "vehicle", licensePlate: "ABC1D23", model: "Caminhão" },
    ]);
  if (path === "/vehicles/vehicle")
    return { id: "vehicle", licensePlate: "ABC1D23", model: "Caminhão" };
  if (path === "/team-members")
    return page([
      { id: "driver", name: "Motorista", role: "DRIVER" },
      { id: "helper", name: "Ajudante", role: "HELPER" },
    ]);
  if (path.startsWith("/team-members/"))
    return {
      id: path.split("/").pop(),
      name: path.endsWith("driver") ? "Motorista" : "Ajudante",
      role: path.endsWith("driver") ? "DRIVER" : "HELPER",
    };
  if (path === "/route-executions")
    return page([{ ...execution, status: "COMPLETED" }]);
  if (path === "/route-executions/execution")
    return { ...execution, status: "COMPLETED" };
  if (path === "/routes") return page([plan]);
  if (path === "/routes/route") return plan;
  if (path === "/materials/subtypes")
    return page([{ id: "material", name: "PET", version: 0 }]);
  return page([]);
}
beforeEach(() => {
  manager = true;
  localStorage.clear();
  session.setToken("fixture-session");
  session.selectOrganization("scope");
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    },
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  session.clear();
});

it("shows loading, scoped paginated plans and member read-only management", async () => {
  manager = false;
  let release!: () => void;
  apiClient.defaults.adapter = (config) =>
    new Promise((done) => {
      expect(config.headers.get("X-Organization-Id")).toBe("scope");
      release = () => done(response(config, page([plan], 2)));
    });
  render(
    <MemoryRouter>
      <RoutesPage />
    </MemoryRouter>,
  );
  expect(screen.getByRole("status").textContent).toContain("Carregando");
  await waitFor(() => expect(release).toBeTypeOf("function"));
  release();
  await screen.findByText("Rota central");
  expect(screen.queryByRole("link", { name: /Nova rota/ })).toBeNull();
  expect(screen.queryByRole("button", { name: "Inativar" })).toBeNull();
  expect(screen.getByRole("button", { name: /Próxima/ })).toBeTruthy();
  let nextPage: number | undefined;
  apiClient.defaults.adapter = async (config) => {
    nextPage = config.params.page;
    return response(config, page([plan], 2));
  };
  await userEvent.click(screen.getByRole("button", { name: "Próxima" }));
  await waitFor(() => expect(nextPage).toBe(1));
  expect(screen.getByText("Página 2 de 2")).toBeTruthy();
});

it("shows empty/error/retry states without exposing backend diagnostics", async () => {
  let fail = true;
  apiClient.defaults.adapter = async (config) => {
    if (fail) throw reject(config, 403);
    return response(config, page([]));
  };
  render(
    <MemoryRouter>
      <RoutesPage />
    </MemoryRouter>,
  );
  expect((await screen.findByRole("alert")).textContent).toContain("permissão");
  fail = false;
  await userEvent.click(screen.getByRole("button", { name: "Recarregar" }));
  await screen.findByText("Nenhuma rota nesta página");
});

it("confirms soft inactivation with the displayed version and preserves conflict context", async () => {
  let removed: unknown;
  apiClient.defaults.adapter = async (config) => {
    if (config.method === "delete") {
      removed = config.params;
      throw reject(config, 409);
    }
    return response(config, page([plan]));
  };
  render(
    <MemoryRouter>
      <RoutesPage />
    </MemoryRouter>,
  );
  await screen.findByText("Rota central");
  await userEvent.click(screen.getByRole("button", { name: "Inativar" }));
  await userEvent.click(screen.getByRole("button", { name: "Inativar rota" }));
  await waitFor(() => expect(removed).toEqual({ version: 3 }));
  expect((await screen.findByRole("alert")).textContent).toContain(
    "Recarregue",
  );
  expect(screen.getByRole("dialog").textContent).toContain("Rota central");
});

it("schedules selected active plan and existing fleet/driver through the executable contract", async () => {
  let saved: unknown;
  apiClient.defaults.adapter = async (config) => {
    if (config.method === "post" && config.url === "/route-executions") {
      saved = JSON.parse(config.data);
      return response(config, execution, 201);
    }
    return response(config, references(config));
  };
  render(
    <MemoryRouter initialEntries={["/route-executions/new?routeId=route"]}>
      <Routes>
        <Route path="/route-executions/new" element={<ExecutionForm />} />
        <Route path="/route-executions/:id" element={<p>Execução salva</p>} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByRole("option", { name: /ABC1D23/ });
  await userEvent.selectOptions(screen.getByLabelText("Veículo"), "vehicle");
  await screen.findByRole("option", { name: /Motorista/ });
  await userEvent.selectOptions(screen.getByLabelText("Motorista"), "driver");
  await userEvent.click(
    screen.getByRole("button", { name: "Planejar execução" }),
  );
  await screen.findByText("Execução salva");
  expect(saved).toMatchObject({
    routeId: "route",
    vehicleId: "vehicle",
    driverId: "driver",
    teamMemberIds: [],
  });
});

it.each([400, 401, 403, 404, 409])(
  "preserves documented HTTP %s failures and session semantics",
  async (status) => {
    apiClient.defaults.adapter = async (config) => {
      throw reject(config, status);
    };
    await expect(routes.get("route")).rejects.toHaveProperty(
      "response.status",
      status,
    );
    expect(session.getToken()).toBe(status === 401 ? null : "fixture-session");
  },
);

it("sends current versions for lifecycle/deactivation and preserves exact distance strings", async () => {
  const commands: { path: string; body: unknown; params: unknown }[] = [];
  apiClient.defaults.adapter = async (config) => {
    expect(config.headers.get("X-Organization-Id")).toBe("scope");
    commands.push({
      path: config.url!,
      body: config.data ? JSON.parse(config.data) : null,
      params: config.params,
    });
    return response(config, execution);
  };
  const current = await executions.get("execution");
  await executions.complete(current, "0.001");
  await routes.deactivate("route", 3);
  expect(commands[1].body).toEqual({ version: 2, distanceKm: "0.001" });
  expect(commands[2].params).toEqual({ version: 3 });
});

it("creates a complete territorial plan through generated contract fields", async () => {
  let saved: unknown;
  apiClient.defaults.adapter = async (config) => {
    if (config.method === "post" && config.url === "/routes") {
      saved = JSON.parse(config.data);
      return response(config, plan, 201);
    }
    return response(config, references(config));
  };
  render(
    <MemoryRouter initialEntries={["/routes/new"]}>
      <Routes>
        <Route path="/routes/new" element={<RouteForm />} />
        <Route path="/routes/:id" element={<p>Plano salvo</p>} />
      </Routes>
    </MemoryRouter>,
  );
  await userEvent.type(screen.getByLabelText("Nome da rota"), "Rota central");
  await screen.findByRole("option", { name: /Belo Horizonte/ });
  await userEvent.selectOptions(screen.getByLabelText("Município"), "city");
  await screen.findByRole("option", { name: "Centro" });
  await userEvent.selectOptions(
    screen.getByLabelText("Bairro da área 1"),
    "district",
  );
  await userEvent.type(
    screen.getByLabelText("Distância planejada (km)"),
    "8,125",
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Salvar planejamento" }),
  );
  await screen.findByText("Plano salvo");
  expect(saved).toMatchObject({
    name: "Rota central",
    municipalityId: "city",
    status: "DRAFT",
    plannedDistanceKm: "8.125",
    areas: [{ neighborhoodId: "district" }],
  });
});

it("edits the loaded version and retains a visible conflict until explicit reload", async () => {
  let submitted: unknown;
  apiClient.defaults.adapter = async (config) => {
    if (config.method === "put") {
      submitted = JSON.parse(config.data);
      throw reject(config, 409);
    }
    return response(config, references(config));
  };
  render(
    <MemoryRouter initialEntries={["/routes/route"]}>
      <Routes>
        <Route path="/routes/:id" element={<RouteForm />} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByDisplayValue("Rota central");
  await userEvent.click(
    screen.getByRole("button", { name: "Salvar planejamento" }),
  );
  await waitFor(() =>
    expect(submitted).toMatchObject({ version: 3, municipalityId: "city" }),
  );
  expect((await screen.findByRole("alert")).textContent).toContain(
    "Recarregue",
  );
  expect(
    (screen.getByLabelText("Município") as HTMLSelectElement).disabled,
  ).toBe(true);
});

it("requires explicit cancellation and versioned coverage during operation", async () => {
  let cancelled: unknown;
  let coverage: unknown;
  apiClient.defaults.adapter = async (config) => {
    if (config.url?.endsWith("/cancel")) {
      cancelled = JSON.parse(config.data);
      return response(config, {
        ...execution,
        status: "CANCELLED",
        version: 4,
        cancellationReason: "Chuva",
      });
    }
    if (config.method === "put") {
      coverage = JSON.parse(config.data);
      return response(config, {
        ...execution,
        version: 3,
        areas: [{ ...execution.areas[0], covered: true }],
      });
    }
    return response(config, execution);
  };
  render(
    <MemoryRouter initialEntries={["/route-executions/execution"]}>
      <Routes>
        <Route path="/route-executions/:id" element={<ExecutionPage />} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByText("Cobertura desta execução");
  await userEvent.click(
    screen.getByRole("checkbox", { name: "Área atendida: Centro — Rua A" }),
  );
  await waitFor(() => expect(coverage).toEqual({ version: 2, covered: true }));
  await screen.findByText("Execução: versão 3");
  await userEvent.click(
    screen.getByRole("button", { name: "Cancelar execução" }),
  );
  await userEvent.type(
    screen.getByLabelText("Motivo do cancelamento"),
    "Chuva",
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Confirmar cancelamento" }),
  );
  await screen.findByText("Cancelada");
  expect(cancelled).toEqual({ version: 3, reason: "Chuva" });
});

it("denies local member scheduling and exposes terminal history without operation controls", async () => {
  manager = false;
  render(
    <MemoryRouter>
      <ExecutionForm />
    </MemoryRouter>,
  );
  expect(screen.getByRole("alert").textContent).toContain(
    "Somente a administração",
  );
  cleanup();
  apiClient.defaults.adapter = async (config) =>
    response(config, { ...execution, status: "COMPLETED" });
  render(
    <MemoryRouter initialEntries={["/route-executions/execution"]}>
      <Routes>
        <Route path="/route-executions/:id" element={<ExecutionPage />} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByText("Concluída");
  expect(screen.getAllByText("8,125 km").length).toBeGreaterThan(0);
  expect(
    screen.queryByRole("button", { name: "Concluir execução" }),
  ).toBeNull();
  expect(
    screen.getByRole("link", { name: "Registrar coleta desta execução" }),
  ).toBeTruthy();
});

it("populates collection assignments from completed execution without rounding actual timestamps", async () => {
  let saved: Record<string, unknown> | undefined;
  apiClient.defaults.adapter = async (config) => {
    if (config.method === "post" && config.url === "/collections") {
      saved = JSON.parse(config.data);
      return response(config, { id: "collection" }, 201);
    }
    return response(config, references(config));
  };
  render(
    <MemoryRouter
      initialEntries={["/intake/collections/new?executionId=execution"]}
    >
      <Routes>
        <Route
          path="/intake/collections/new"
          element={<IntakeForm kind="collections" />}
        />
        <Route path="/intake/collections" element={<p>Coleta salva</p>} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByRole("option", { name: /ABC1D23/ });
  await waitFor(() =>
    expect((screen.getByLabelText("Veículo") as HTMLSelectElement).value).toBe(
      "vehicle",
    ),
  );
  expect((screen.getByLabelText("Veículo") as HTMLSelectElement).disabled).toBe(
    true,
  );
  await screen.findByRole("option", { name: /PET/ });
  await userEvent.selectOptions(
    screen.getByLabelText("Material do item 1"),
    "material",
  );
  await userEvent.type(screen.getByLabelText("Peso (kg)"), "10");
  await userEvent.type(screen.getByLabelText("Volume (m³)"), "1");
  await userEvent.click(screen.getByRole("button", { name: "Salvar entrada" }));
  await screen.findByText("Coleta salva");
  expect(saved).toMatchObject({
    routeExecutionId: "execution",
    vehicleId: "vehicle",
    driverId: "driver",
    teamMemberIds: ["helper"],
  });
  expect(saved).not.toHaveProperty("departureAt");
  expect(saved).not.toHaveProperty("arrivalAt");
  expect(saved).not.toHaveProperty("distanceKm");
});
