/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { loadEnvFile } from "node:process";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, expect, it, vi } from "vitest";
import { isAxiosError } from "axios";
import { apiClient } from "../../src/shared/api/client";
import { session } from "../../src/shared/api/session";
import { organizationHeaders } from "../../src/shared/api/transport";
import { authenticate, currentAccount } from "../../src/features/identity/api";
import { donors, team } from "../../src/features/parties/api";
import { documents } from "../../src/features/documents/api";
import {
  donations,
  collections,
  type DonationCreate,
  type CollectionRequest,
} from "../../src/features/intake/api";
import { driverChoices } from "../../src/features/intake/choices";
import { catalog } from "../../src/features/materials/api";
import { fleet } from "../../src/features/fleet/api";
const envFile = process.env.IRR_BACKEND_ENV;
if (!envFile)
  throw new Error("Set IRR_BACKEND_ENV to the private local backend .env.");
loadEnvFile(envFile);
if (
  !["localhost", "127.0.0.1"].includes(
    new URL(apiClient.defaults.baseURL!).hostname,
  )
)
  throw new Error("Contract fixtures require a local development backend.");
const storage = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
});
const suffix = randomUUID().slice(0, 8);
const orgs: string[] = [];
const users: string[] = [];
const intake: {
  kind: "donation" | "collection";
  id: string;
  processed?: boolean;
}[] = [];
const uploads: string[] = [];
const sortings: string[] = [];
let admin = "",
  member = "",
  adminId = "",
  donorId = "",
  driverId = "",
  helperId = "",
  vehicleId = "",
  subtypeId = "",
  proofId = "";
/** Sanitizes transport failures before reporting; Axios configurations contain credentials. */
async function safe<T>(operation: Promise<T>): Promise<T> {
  try {
    return await operation;
  } catch (error) {
    throw new Error(
      isAxiosError(error)
        ? "Backend status " + (error.response?.status ?? "network")
        : "Contract operation failed",
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
function scope(token = admin, org = orgs[0]) {
  session.setToken(token);
  session.selectOrganization(org);
}
const pdf = () =>
  new File(
    [
      "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF",
    ],
    "verification.pdf",
    { type: "application/pdf" },
  );
const donation = (): DonationCreate => ({
  donorId,
  donationDate: "2026-09-28T12:00:00Z",
  totalWeightKg: "0.3000",
  proofAttachmentId: proofId,
  inputItems: [
    { materialSubtypeId: subtypeId, weightKg: "0.1000", volumeM3: "0.0100" },
    { materialSubtypeId: subtypeId, weightKg: "0.2000", volumeM3: "0.0200" },
  ],
});
const collection = (): CollectionRequest => ({
  realizationDate: "2026-09-28T12:00:00Z",
  totalWeightKg: "1.2345",
  vehicleId,
  driverId,
  teamMemberIds: [helperId],
  inputItems: [
    { materialSubtypeId: subtypeId, weightKg: "1.2345", volumeM3: "0.1234" },
  ],
  mtrGeneratorId: proofId,
  routeDescription: "Contract route",
  departureAt: "2026-09-28T10:00:00Z",
  arrivalAt: "2026-09-28T11:00:00Z",
  distanceKm: "12.345",
});
beforeAll(async () => {
  admin = await safe(
    authenticate(process.env.DEV_ADMIN_EMAIL!, process.env.DEV_ADMIN_PASSWORD!),
  );
  session.setToken(admin);
  adminId = (await safe(currentAccount())).id!;
  for (const label of ["A", "B"]) {
    const response = await safe(
      apiClient.post("/organizations", {
        name: "FE intake " + suffix + " " + label,
        organizationType: "COOPERATIVE",
      }),
    );
    orgs.push(response.data.id);
    await safe(
      apiClient.put(
        "/organizations/" + response.data.id + "/members/" + adminId,
        { role: "MANAGER" },
      ),
    );
  }
  const email = "fe-intake-" + suffix + "@example.invalid",
    password = randomUUID() + "aA1!";
  const user = await safe(
    apiClient.post("/users", {
      fullName: "Intake contract member",
      email,
      password,
      userRole: "ORGANIZATION",
    }),
  );
  users.push(user.data.id);
  await safe(
    apiClient.put("/organizations/" + orgs[0] + "/members/" + user.data.id, {
      role: "MEMBER",
    }),
  );
  member = await safe(authenticate(email, password));
  scope();
});
it("maintains donors with full address and manager-only reference writes", async () => {
  scope();
  const donor = await safe(
    donors.create({
      name: "Donor " + suffix,
      document: "12345678901",
      donorType: "PF",
      address: {
        line1: "Rua de teste, 1",
        city: "Curitiba",
        region: "PR",
        postalCode: "80000000",
        countryCode: "BR",
      },
    }),
  );
  donorId = donor.id!;
  const edited = await safe(
    donors.update(donorId, {
      name: "Updated donor",
      document: "12345678901",
      address: donor.address,
    }),
  );
  expect(edited.address?.city).toBe("Curitiba");
  scope(member);
  expect((await safe(donors.list(0))).total).toBe(1);
  expect(
    await status(
      donors.create({
        name: "Denied",
        document: "12345678902",
        donorType: "PF",
      }),
    ),
  ).toBe(403);
  expect(await status(team.create({ name: "Denied", role: "DRIVER" }))).toBe(
    403,
  );
});
it("paginates staff choices and preserves driver role filtering across pages", async () => {
  scope();
  for (let i = 0; i < 11; i++) {
    const helper = await safe(
      team.create({ name: "A helper " + i, role: "HELPER" }),
    );
    helperId = helper.id!;
  }
  driverId = (await safe(team.create({ name: "Z driver", role: "DRIVER" })))
    .id!;
  expect((await safe(driverChoices(0))).items).toHaveLength(0);
  expect((await safe(driverChoices(1))).items.map((item) => item.id)).toEqual([
    driverId,
  ]);
  expect(
    (
      await safe(
        team.update(helperId, { name: "Updated helper", role: "HELPER" }),
      )
    ).name,
  ).toBe("Updated helper");
  const unused = await safe(team.create({ name: "Unused", role: "OPERATOR" }));
  await safe(team.deactivate(unused.id!));
  expect(await status(team.get(unused.id!))).toBe(404);
});
it("uploads, reads, downloads, renames and removes protected documents", async () => {
  scope();
  const proof = await safe(documents.upload(pdf()));
  proofId = proof.id!;
  uploads.push(proofId);
  expect((await safe(documents.get(proofId))).contentType).toBe(
    "application/pdf",
  );
  await safe(documents.rename(proofId, "Comprovante de doação.pdf"));
  expect((await safe(documents.list(0))).items[0].fileName).toBe(
    "Comprovante de doação.pdf",
  );
  const downloaded = await safe(documents.download(proofId));
  expect(String(downloaded).startsWith("%PDF-")).toBe(true);
  scope(member);
  expect(await status(documents.rename(proofId, "denied.pdf"))).toBe(403);
  expect(await status(documents.remove(proofId))).toBe(403);
  const own = await safe(documents.upload(pdf()));
  await safe(documents.remove(own.id!));
  expect(await status(documents.get(own.id!))).toBe(404);
});
it("creates and edits donations as a member with exact quantities and retained donor identity", async () => {
  scope();
  const category = await safe(catalog.create("categories", "Intake " + suffix));
  const type = await safe(catalog.create("types", "Type", category.id));
  subtypeId = (await safe(catalog.create("subtypes", "Subtype", type.id))).id;
  vehicleId = (
    await safe(
      fleet.create({ licensePlate: "IN-" + suffix, model: "Contract truck" }),
    )
  ).id;
  scope(member);
  const record = await safe(donations.create(donation()));
  intake.push({ kind: "donation", id: record.id! });
  expect(record.totalWeightKg).toBe("0.3000");
  const updated = await safe(
    donations.update(record.id!, {
      donationDate: "2026-09-28T13:00:00Z",
      totalWeightKg: "0.4000",
      proofAttachmentId: proofId,
      inputItems: [
        {
          materialSubtypeId: subtypeId,
          weightKg: "0.4000",
          volumeM3: "0.0400",
        },
      ],
    }),
  );
  expect(updated.donorId).toBe(donorId);
  expect(updated.totalWeightKg).toBe("0.4000");
  expect(
    (await safe(donations.get(record.id!))).inputItems?.filter(
      (item) => item.isActive !== false,
    ),
  ).toHaveLength(1);
  expect(
    await status(donations.create({ ...donation(), totalWeightKg: "99.0000" })),
  ).toBe(400);
});
it("creates and edits collections with scoped fleet, driver, crew and evidence", async () => {
  scope(member);
  const record = await safe(collections.create(collection()));
  intake.push({ kind: "collection", id: record.id! });
  expect(record.totalWeightKg).toBe("1.2345");
  expect(record.distanceKm).toBe("12.345");
  expect(record.teamMemberIds).toEqual([helperId]);
  const updated = await safe(
    collections.update(record.id!, {
      ...collection(),
      routeDescription: "Updated route",
    }),
  );
  expect(updated.routeDescription).toBe("Updated route");
  expect((await safe(collections.list(0))).total).toBe(1);
  expect(
    await status(
      collections.create({
        ...collection(),
        driverId: helperId,
        teamMemberIds: [],
      }),
    ),
  ).toBe(400);
  expect(
    await status(
      collections.create({
        ...collection(),
        arrivalAt: "2026-09-28T09:00:00Z",
      }),
    ),
  ).toBe(400);
});
it("blocks foreign organization access and deletion of referenced evidence and parties", async () => {
  scope(admin, orgs[1]);
  expect(await status(donations.get(intake[0].id))).toBe(404);
  expect(await status(collections.get(intake[1].id))).toBe(404);
  expect(await status(documents.get(proofId))).toBe(404);
  expect(await status(donors.get(donorId))).toBe(404);
  expect(await status(donations.create(donation()))).toBe(404);
  scope();
  expect(await status(documents.remove(proofId))).toBe(409);
  expect(await status(donors.deactivate(donorId))).toBe(409);
  expect(await status(team.deactivate(driverId))).toBe(409);
  expect(
    await status(
      team.update(driverId, { name: "Changed role", role: "HELPER" }),
    ),
  ).toBe(409);
});
it("refuses updates and deactivation after sorting has consumed a donation", async () => {
  scope();
  const source = await safe(donations.get(intake[0].id));
  const item = source.inputItems!.find((line) => line.isActive !== false)!;
  const sorted = await safe(
    apiClient.post(
      "/sortings",
      {
        sortingType: "PRIMARY",
        sortedItems: [
          {
            inputItemId: item.id,
            materialSubtypeId: subtypeId,
            weightKg: "0.4000",
            volumeM3: "0.0400",
            rejectWeightKg: "0",
            rejectVolumeM3: "0",
            destinationType: "STOCK",
          },
        ],
      },
      {
        headers: { ...organizationHeaders(), "Idempotency-Key": randomUUID() },
      },
    ),
  );
  sortings.push(sorted.data.id);
  intake[0].processed = true;
  expect(
    await status(
      donations.update(source.id!, {
        totalWeightKg: "0.3000",
        inputItems: donation().inputItems!,
      }),
    ),
  ).toBe(409);
  expect(await status(donations.deactivate(source.id!))).toBe(409);
});
it("deactivates unprocessed collections and independent donors", async () => {
  scope(member);
  await safe(collections.deactivate(intake[1].id));
  expect(await status(collections.get(intake[1].id))).toBe(404);
  intake.splice(1, 1);
  scope();
  const donor = await safe(
    donors.create({
      name: "Unused donor",
      document: "12345678000199",
      donorType: "PJ",
    }),
  );
  await safe(donors.deactivate(donor.id!));
  expect(await status(donors.get(donor.id!))).toBe(404);
});
afterAll(async () => {
  if (!admin) return;
  scope();
  const failures: string[] = [];
  const clean = async (label: string, action: () => Promise<unknown>) => {
    try {
      await safe(action());
    } catch {
      failures.push(label);
    }
  };
  for (const id of sortings)
    await clean("reverse sorting", () =>
      apiClient.post("/sortings/" + id + "/reverse", null, {
        headers: { ...organizationHeaders(), "Idempotency-Key": randomUUID() },
      }),
    );
  for (const item of intake)
    if (!item.processed)
      await clean("deactivate intake", () =>
        item.kind === "donation"
          ? donations.deactivate(item.id)
          : collections.deactivate(item.id),
      );
  for (const id of uploads) {
    const code = await status(documents.remove(id));
    if (![200, 404, 409].includes(code ?? 0))
      failures.push("attachment cleanup");
  }
  for (const id of users)
    await clean("deactivate member", () => apiClient.delete("/users/" + id));
  for (const id of orgs)
    await clean("deactivate organization", () =>
      apiClient.delete("/organizations/" + id),
    );
  session.clear();
  if (failures.length)
    throw new Error("Cleanup needs review: " + failures.join(", "));
});
