/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { loadEnvFile } from "node:process";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, expect, it, vi } from "vitest";
import { isAxiosError } from "axios";
import { apiClient } from "../../src/shared/api/client";
import { session } from "../../src/shared/api/session";
import { fleet } from "../../src/features/fleet/api";
import { catalog, type CatalogLevel } from "../../src/features/materials/api";
import { authenticate, currentAccount } from "../../src/features/identity/api";

const envFile = process.env.IRR_BACKEND_ENV;
if (!envFile)
  throw new Error(
    "Set IRR_BACKEND_ENV to the private local backend .env before running contract tests.",
  );
loadEnvFile(envFile);
if (
  !["localhost", "127.0.0.1"].includes(
    new URL(apiClient.defaults.baseURL!).hostname,
  )
)
  throw new Error(
    "Contract fixtures may only run against a local development backend.",
  );
const storage = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
});
const suffix = randomUUID().slice(0, 8);
const organizationIds: string[] = [];
const vehicles: string[] = [];
const materials: { level: CatalogLevel; id: string }[] = [];
let adminToken = "";
let adminId = "";
let memberId = "";
let memberToken = "";

/** Removes Axios request configuration from failures so credentials cannot enter test logs. */
async function safe<T>(operation: Promise<T>): Promise<T> {
  try {
    return await operation;
  } catch (error) {
    throw new Error(
      isAxiosError(error)
        ? `Backend request failed with status ${error.response?.status ?? "network error"}`
        : "Backend contract operation failed.",
    );
  }
}
async function status(operation: Promise<unknown>): Promise<number> {
  try {
    await operation;
    return 200;
  } catch (error) {
    return isAxiosError(error) ? (error.response?.status ?? 0) : 0;
  }
}
function manager(scope = organizationIds[0]) {
  session.setToken(adminToken);
  session.selectOrganization(scope);
}

beforeAll(async () => {
  adminToken = await safe(
    authenticate(process.env.DEV_ADMIN_EMAIL!, process.env.DEV_ADMIN_PASSWORD!),
  );
  session.setToken(adminToken);
  adminId = (await safe(currentAccount())).id!;
  for (const name of ["A", "B"]) {
    const { data } = await safe(
      apiClient.post("/organizations", {
        name: `FE contract ${suffix} ${name}`,
        organizationType: "COOPERATIVE",
      }),
    );
    organizationIds.push(data.id);
    await safe(
      apiClient.put(`/organizations/${data.id}/members/${adminId}`, {
        role: "MANAGER",
      }),
    );
  }
  const password = randomUUID() + "aA1!";
  const email = `fe-contract-${suffix}@example.invalid`;
  const { data } = await safe(
    apiClient.post("/users", {
      fullName: "Frontend contract member",
      email,
      password,
      userRole: "ORGANIZATION",
    }),
  );
  memberId = data.id;
  await safe(
    apiClient.put(`/organizations/${organizationIds[0]}/members/${memberId}`, {
      role: "MEMBER",
    }),
  );
  memberToken = await safe(authenticate(email, password));
  manager();
});

it("creates, filters, paginates and updates real vehicles through the frontend API adapter", async () => {
  manager();
  for (let index = 0; index < 11; index++) {
    const vehicle = await safe(
      fleet.create({
        licensePlate: `FE-${suffix}-${String(index).padStart(2, "0")}`,
        model: "Contract truck",
      }),
    );
    vehicles.push(vehicle.id);
  }
  const first = await safe(fleet.list(0, `FE-${suffix}`, "Contract"));
  const second = await safe(fleet.list(1, `FE-${suffix}`, "Contract"));
  expect(first.total).toBe(11);
  expect(first.pages).toBe(2);
  expect(first.items).toHaveLength(10);
  expect(second.items).toHaveLength(1);
  const updated = await safe(
    fleet.update(vehicles[0], {
      licensePlate: `FE-${suffix}-00`,
      model: "Updated truck",
      isActive: true,
    }),
  );
  expect(updated.model).toBe("Updated truck");
  expect(
    (await safe(fleet.list(0, "", "Updated truck"))).items.map(
      (item) => item.id,
    ),
  ).toEqual([vehicles[0]]);
});
it("requires a scope and denies cross-organization identity access", async () => {
  manager(organizationIds[1]);
  expect(await status(fleet.get(vehicles[0]))).toBe(404);
  expect((await safe(fleet.list(0, "", ""))).items).toEqual([]);
  expect(await status(apiClient.get("/vehicles"))).toBe(400);
});
it("allows member reads but rejects manager writes and immediate revoked access", async () => {
  session.setToken(memberToken);
  session.selectOrganization(organizationIds[0]);
  expect((await safe(fleet.list(0, "", ""))).total).toBe(11);
  expect(
    await status(
      fleet.create({ licensePlate: `DENIED-${suffix}`, model: "Denied" }),
    ),
  ).toBe(403);
  manager();
  await safe(
    apiClient.delete(
      `/organizations/${organizationIds[0]}/members/${memberId}`,
    ),
  );
  session.setToken(memberToken);
  session.selectOrganization(organizationIds[0]);
  expect(await status(fleet.list(0, "", ""))).toBe(404);
});
it("deactivates a real vehicle without expecting a response body", async () => {
  manager();
  await safe(fleet.deactivate(vehicles[0]));
  expect(await status(fleet.get(vehicles[0]))).toBe(404);
  expect((await safe(fleet.list(0, `FE-${suffix}`, ""))).total).toBe(10);
  vehicles.shift();
});

it("integrates the complete hierarchy, parent filters and stale-version refusal", async () => {
  manager();
  const category = await safe(
    catalog.create("categories", "Category " + suffix),
  );
  materials.push({ level: "categories", id: category.id });
  const type = await safe(
    catalog.create("types", "Type " + suffix, category.id),
  );
  materials.push({ level: "types", id: type.id });
  const subtype = await safe(
    catalog.create("subtypes", "Subtype " + suffix, type.id),
  );
  materials.push({ level: "subtypes", id: subtype.id });
  expect(
    (await safe(catalog.list("types", 0, suffix, category.id))).items.map(
      (item) => item.id,
    ),
  ).toEqual([type.id]);
  expect(
    (await safe(catalog.list("subtypes", 0, suffix, type.id))).items.map(
      (item) => item.id,
    ),
  ).toEqual([subtype.id]);
  const updated = await safe(
    catalog.update(
      "subtypes",
      subtype.id,
      "Renamed " + suffix,
      subtype.version,
    ),
  );
  expect(updated.version).toBeGreaterThan(subtype.version);
  expect(
    await status(
      catalog.update("subtypes", subtype.id, "Stale write", subtype.version),
    ),
  ).toBe(409);
  expect((await safe(catalog.get("subtypes", subtype.id))).name).toBe(
    "Renamed " + suffix,
  );
});

it("isolates the catalog and rejects member catalog writes", async () => {
  manager(organizationIds[1]);
  expect(await status(catalog.get("categories", materials[0].id))).toBe(404);
  expect((await safe(catalog.list("categories", 0, ""))).items).toEqual([]);
  await safe(
    apiClient.put(`/organizations/${organizationIds[0]}/members/${memberId}`, {
      role: "MEMBER",
    }),
  );
  session.setToken(memberToken);
  session.selectOrganization(organizationIds[0]);
  expect((await safe(catalog.list("categories", 0, suffix))).total).toBe(1);
  expect(await status(catalog.create("categories", "Denied"))).toBe(403);
});

it("deactivates an unused hierarchy with the backend descendant cascade", async () => {
  manager();
  await safe(catalog.deactivate("categories", materials[0].id));
  for (const item of materials)
    expect(await status(catalog.get(item.level, item.id))).toBe(404);
  materials.length = 0;
});

afterAll(async () => {
  if (!adminToken) return;
  manager();
  for (const id of vehicles) await safe(fleet.deactivate(id));
  for (const item of [...materials].reverse())
    await safe(catalog.deactivate(item.level, item.id));
  if (memberId) await safe(apiClient.delete(`/users/${memberId}`));
  for (const id of organizationIds)
    await safe(apiClient.delete(`/organizations/${id}`));
  session.clear();
});
