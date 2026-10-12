/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { components, paths } from "../../shared/api/schema";
import { apiClient } from "../../shared/api/client";
import { organizationHeaders } from "../../shared/api/transport";
import { routes, routeChoice } from "../routes/api";
import { fleet } from "../fleet/api";
export type OperationalReport = Required<components["schemas"]["OperationalReport"]>;
export type ReportFilters = NonNullable<paths["/api/v1/reports/operations"]["get"]["parameters"]["query"]>;
/** Preserves exact decimal strings and delegates all aggregation to the scoped backend. */
export async function operationalReport(filters: ReportFilters): Promise<OperationalReport> {
  return (await apiClient.get<OperationalReport>("/reports/operations", {
    headers: organizationHeaders(), params: filters,
  })).data;
}
export const reportRouteChoices = async (page: number) => {
  const result = await routes.list(page, true);
  return {...result, items: result.items.map(item => ({id: item.id,
    label: `${item.name} · ${item.municipalityName}${item.isActive ? "" : " (inativa)"}`}))};
};
export { routeChoice as reportRouteChoice };
export const reportVehicleChoices = async (page: number) => {
  const result = await fleet.list(page, "", "");
  return {...result, items: result.items.map(item => ({id: item.id,
    label: `${item.licensePlate}${item.isActive ? "" : " (inativo)"}`}))};
};
export const reportVehicleChoice = async (id: string) => {
  const item = await fleet.get(id);
  return {id: item.id, label: `${item.licensePlate}${item.isActive ? "" : " (inativo)"}`};
};
