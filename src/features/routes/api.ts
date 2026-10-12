/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { components } from "../../shared/api/schema";
import { apiClient } from "../../shared/api/client";
import { scopedPage, type Page } from "../../shared/api/page";
import { organizationHeaders } from "../../shared/api/transport";
type Schema = components["schemas"];
export type Route = Required<Schema["RouteResponse"]>;
export type RouteRequest = Schema["RouteRequest"];
export type Execution = Required<Schema["RouteExecutionResponse"]>;
export type ExecutionRequest = Schema["RouteExecutionRequest"];
export type Municipality = Required<Schema["MunicipalityResponse"]>;
export type Neighborhood = Required<Schema["NeighborhoodResponse"]>;
export type RouteEvent = Required<Schema["RouteEventResponse"]>;
export type ExecutionStatus = Execution["status"];
export const routeStatuses = { DRAFT: "Rascunho", ACTIVE: "Ativa" };
export const executionStatuses = {
  PLANNED: "Planejada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
};

/** Uses one scoped transport for the additive executable Routes contract. */
async function get<T>(path: string): Promise<T> {
  return (await apiClient.get<T>(path, { headers: organizationHeaders() }))
    .data;
}
async function post<T>(path: string, payload: unknown): Promise<T> {
  return (
    await apiClient.post<T>(path, payload, { headers: organizationHeaders() })
  ).data;
}
export const geography = {
  municipalities: (page: number) =>
    scopedPage<Municipality>("/municipalities", page, "name,asc"),
  municipality: (id: string) => get<Municipality>("/municipalities/" + id),
  neighborhoods: (municipality: string, page: number) =>
    scopedPage<Neighborhood>(
      "/neighborhoods?municipalityId=" + encodeURIComponent(municipality),
      page,
      "name,asc",
    ),
  neighborhood: (id: string) => get<Neighborhood>("/neighborhoods/" + id),
  createMunicipality: (payload: Schema["MunicipalityRequest"]) =>
    post<Municipality>("/municipalities", payload),
  createNeighborhood: (payload: Schema["NeighborhoodRequest"]) =>
    post<Neighborhood>("/neighborhoods", payload),
};
export const routes = {
  list: (page: number, includeInactive = false) =>
    scopedPage<Route>(
      "/routes?includeInactive=" + includeInactive,
      page,
      "name,asc",
    ),
  get: (id: string) => get<Route>("/routes/" + id),
  create: (payload: RouteRequest) => post<Route>("/routes", payload),
  async update(id: string, payload: RouteRequest): Promise<Route> {
    return (
      await apiClient.put<Route>("/routes/" + id, payload, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async deactivate(id: string, version: number) {
    await apiClient.delete("/routes/" + id, {
      headers: organizationHeaders(),
      params: { version },
    });
  },
  events: (id: string, page: number) =>
    scopedPage<RouteEvent>("/routes/" + id + "/events", page, "recordedAt,asc"),
};
export const executions = {
  list: (page: number, routeId = "", status: ExecutionStatus | "" = "") =>
    scopedPage<Execution>(
      "/route-executions?" +
        new URLSearchParams({
          ...(routeId ? { routeId } : {}),
          ...(status ? { status } : {}),
        }),
      page,
      "plannedStartAt,desc",
    ),
  get: (id: string) => get<Execution>("/route-executions/" + id),
  create: (payload: ExecutionRequest) =>
    post<Execution>("/route-executions", payload),
  start: (record: Execution) =>
    post<Execution>("/route-executions/" + record.id + "/start", {
      version: record.version,
    } satisfies Schema["RouteExecutionVersionCommand"]),
  complete: (record: Execution, distanceKm?: string) =>
    post<Execution>("/route-executions/" + record.id + "/complete", {
      version: record.version,
      distanceKm,
    } satisfies Schema["RouteExecutionCompletionCommand"]),
  cancel: (record: Execution, reason: string) =>
    post<Execution>("/route-executions/" + record.id + "/cancel", {
      version: record.version,
      reason,
    } satisfies Schema["RouteExecutionCancellationCommand"]),
  async coverage(
    record: Execution,
    areaId: string,
    covered: boolean,
  ): Promise<Execution> {
    return (
      await apiClient.put<Execution>(
        "/route-executions/" + record.id + "/areas/" + areaId,
        {
          version: record.version,
          covered,
        } satisfies Schema["RouteExecutionCoverageCommand"],
        { headers: organizationHeaders() },
      )
    ).data;
  },
};

/** Reference choices remain bounded and resolve saved identities without fetching whole catalogs. */
function choices<T>(
  page: Page<T>,
  map: (item: T) => { id: string; label: string },
) {
  return { ...page, items: page.items.map(map) };
}
const municipalityLabel = (item: Municipality) => ({
  id: item.id,
  label: `${item.name} / ${item.stateCode} · IBGE ${item.ibgeCode}`,
});
export const municipalityChoices = async (page: number) =>
  choices(await geography.municipalities(page), municipalityLabel);
export const municipalityChoice = async (id: string) =>
  municipalityLabel(await geography.municipality(id));
export const neighborhoodChoice = async (id: string) => {
  const item = await geography.neighborhood(id);
  return { id: item.id, label: item.name };
};
export const routeChoices = async (page: number) => {
  const result = await routes.list(page);
  return choices(
    {
      ...result,
      items: result.items.filter((item) => item.status === "ACTIVE"),
    },
    (item) => ({
      id: item.id,
      label: `${item.name} · ${item.municipalityName} / ${item.municipalityStateCode}`,
    }),
  );
};
export const routeChoice = async (id: string) => {
  const item = await routes.get(id);
  return { id: item.id, label: `${item.name} · ${item.municipalityName}` };
};
export const completedExecutionChoices = async (page: number) =>
  choices(await executions.list(page, "", "COMPLETED"), (item) => ({
    id: item.id,
    label: `${item.routeName} · ${new Date(item.plannedStartAt).toLocaleString("pt-BR")}`,
  }));
export const executionChoice = async (id: string) => {
  const item = await executions.get(id);
  return {
    id: item.id,
    label: `${item.routeName} · ${new Date(item.plannedStartAt).toLocaleString("pt-BR")}`,
  };
};
