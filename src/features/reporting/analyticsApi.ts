/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { components } from "../../shared/api/schema";
import { apiClient } from "../../shared/api/client";
import { organizationHeaders } from "../../shared/api/transport";
import type { ReportFilters } from "./api";

export type AnalyticsComparison = Required<components["schemas"]["AnalyticsComparison"]>;
export type AnalyticsProductivity = Required<components["schemas"]["AnalyticsProductivity"]>;
export type AnalyticsReport = Omit<Required<components["schemas"]["AnalyticsReport"]>,
  "distanceComparison" | "durationComparison" | "coverage" | "hourlyProductivity" | "distanceProductivity" | "revenue"> & {
  distanceComparison: AnalyticsComparison;
  durationComparison: AnalyticsComparison;
  coverage: Required<components["schemas"]["AnalyticsCoverage"]>;
  hourlyProductivity: AnalyticsProductivity;
  distanceProductivity: AnalyticsProductivity;
  revenue: Required<components["schemas"]["AnalyticsRevenue"]>;
};

/** Uses server formulas and exact decimal strings; no browser-side aggregate is computed. */
export async function analyticsReport(filters: ReportFilters): Promise<AnalyticsReport> {
  return (await apiClient.get<AnalyticsReport>("/reports/analytics", {
    headers: organizationHeaders(), params: filters,
  })).data;
}
