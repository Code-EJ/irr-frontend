/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { loadEnvFile } from "node:process";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, expect, it, vi } from "vitest";
import { isAxiosError } from "axios";
import { apiClient } from "../../src/shared/api/client";
import { session } from "../../src/shared/api/session";
import { authenticate } from "../../src/features/identity/api";
import {
  geography,
  routes,
  executions,
  type Route,
  type Execution,
} from "../../src/features/routes/api";
import { fleet } from "../../src/features/fleet/api";
import { team } from "../../src/features/parties/api";
import { catalog } from "../../src/features/materials/api";
import { collections } from "../../src/features/intake/api";
const envFile = process.env.IRR_BACKEND_ENV;
if (!envFile)
  throw new Error(
    "Set IRR_BACKEND_ENV to the ignored local development credentials.",
  );
loadEnvFile(envFile);
if (
  !["localhost", "127.0.0.1"].includes(
    new URL(apiClient.defaults.baseURL!).hostname,
  )
)
  throw new Error(
    "Routes contract fixtures require a local development backend.",
  );
const storage = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
});
const suffix = randomUUID().slice(0, 8);
let admin = "",
  organization = "",
  otherOrganization = "",
  municipality = "",
  neighborhood = "",
  vehicle = "",
  driver = "",
  helper = "",
  material = "";
let plan: Route, execution: Execution;

/** Redacts Axios request configuration so assertion failures never expose authorization secrets. */
async function safe<T>(operation: Promise<T>): Promise<T> {
  try {
    return await operation;
  } catch (error) {
    throw new Error(
      isAxiosError(error)
        ? "Backend status " + (error.response?.status ?? "network")
        : "Routes contract operation failed",
    );
  }
}
async function status(operation: Promise<unknown>) {
  try {
    await operation;
    return 200;
  } catch (error) {
    return isAxiosError(error) ? error.response?.status : 0;
  }
}
function scope(id = organization) {
  session.setToken(admin);
  session.selectOrganization(id);
}

beforeAll(async () => {
  admin = await safe(
    authenticate(process.env.DEV_ADMIN_EMAIL!, process.env.DEV_ADMIN_PASSWORD!),
  );
  session.setToken(admin);
  organization = (
    await safe(
      apiClient.post("/organizations", {
        name: "Routes contract " + suffix,
        organizationType: "COOPERATIVE",
      }),
    )
  ).data.id;
  otherOrganization = (
    await safe(
      apiClient.post("/organizations", {
        name: "Routes isolation " + suffix,
        organizationType: "COOPERATIVE",
      }),
    )
  ).data.id;
  scope();
  // Explicitly named disposable local reference fixtures are not certified geographic data.
  const code =
    "31" +
    (10000 + (parseInt(suffix.slice(0, 4), 16) % 89999))
      .toString()
      .padStart(5, "0");
  municipality = (
    await safe(
      geography.createMunicipality({
        name: "Contract municipality " + suffix,
        stateCode: "MG",
        ibgeCode: code,
      }),
    )
  ).id;
  neighborhood = (
    await safe(
      geography.createNeighborhood({
        municipalityId: municipality,
        name: "Contract area " + suffix,
      }),
    )
  ).id;
  vehicle = (
    await safe(
      fleet.create({
        licensePlate: "RT" + suffix.slice(0, 5).toUpperCase(),
        model: "Contract vehicle",
      }),
    )
  ).id!;
  driver = (
    await safe(
      team.create({ name: "Routes contract driver " + suffix, role: "DRIVER" }),
    )
  ).id!;
  helper = (
    await safe(
      team.create({ name: "Routes contract helper " + suffix, role: "HELPER" }),
    )
  ).id!;
  const category = await safe(
    catalog.create("categories", "Routes material " + suffix),
  );
  const type = await safe(catalog.create("types", "Routes type", category.id));
  material = (await safe(catalog.create("subtypes", "Routes subtype", type.id)))
    .id!;
}, 60000);
afterAll(async () => {
  session.setToken(admin);
  for (const id of [organization, otherOrganization])
    if (id) await safe(apiClient.delete("/organizations/" + id));
  session.clear();
}, 30000);

it("uses actual v1 planning, preserved execution snapshots and versioned coverage/lifecycle", async () => {
  scope();
  plan = await safe(
    routes.create({
      name: "Contract plan " + suffix,
      municipalityId: municipality,
      status: "ACTIVE",
      plannedDistanceKm: "10.125",
      plannedDurationMinutes: 90,
      areas: [{ neighborhoodId: neighborhood, street: "Contract street" }],
    }),
  );
  expect(plan.municipalityId).toBe(municipality);
  expect(
    (await safe(routes.list(0))).items.some((item) => item.id === plan.id),
  ).toBe(true);
  execution = await safe(
    executions.create({
      routeId: plan.id,
      plannedStartAt: new Date().toISOString(),
      vehicleId: vehicle,
      driverId: driver,
      teamMemberIds: [helper],
    }),
  );
  expect(await status(routes.deactivate(plan.id, plan.version))).toBe(409);
  plan = await safe(
    routes.update(plan.id, {
      name: "Changed contract plan " + suffix,
      municipalityId: municipality,
      status: "ACTIVE",
      version: plan.version,
      plannedDistanceKm: "12.000",
      areas: [{ neighborhoodId: neighborhood }],
    }),
  );
  expect((await safe(executions.get(execution.id))).routeName).toBe(
    "Contract plan " + suffix,
  );
  execution = await safe(executions.start(execution));
  expect(await status(executions.start({ ...execution, version: 0 }))).toBe(
    409,
  );
  execution = await safe(
    executions.coverage(execution, execution.areas[0].id!, true),
  );
  execution = await safe(executions.complete(execution, "0.001"));
  expect(execution.status).toBe("COMPLETED");
  expect(execution.distanceKm).toBe("0.001");
  expect(execution.areas[0].covered).toBe(true);
  scope(otherOrganization);
  expect(await status(routes.get(plan.id))).toBe(404);
  expect(await status(executions.get(execution.id))).toBe(404);
  scope();
}, 30000);

it("records actual completed execution collection facts and keeps history after plan inactivation", async () => {
  scope();
  const payload = {
    realizationDate: new Date().toISOString(),
    totalWeightKg: "1.2345",
    vehicleId: vehicle,
    driverId: driver,
    teamMemberIds: [helper],
    routeExecutionId: execution.id,
    inputItems: [
      { materialSubtypeId: material, weightKg: "1.2345", volumeM3: "0.1234" },
    ],
  };
  const intake = await safe(collections.create(payload));
  expect(intake.routeExecutionId).toBe(execution.id);
  expect(intake.departureAt).toBe(execution.startedAt);
  expect(intake.arrivalAt).toBe(execution.finishedAt);
  expect(intake.distanceKm).toBe("0.001");
  expect(
    await status(
      collections.update(intake.id!, {
        ...payload,
        routeExecutionId: undefined,
      }),
    ),
  ).toBe(409);
  expect(await status(executions.cancel(execution, "Terminal history"))).toBe(
    409,
  );
  await safe(routes.deactivate(plan.id, plan.version));
  expect((await safe(routes.get(plan.id))).isActive).toBe(false);
  expect((await safe(executions.get(execution.id))).routeName).toBe(
    "Contract plan " + suffix,
  );
}, 30000);
