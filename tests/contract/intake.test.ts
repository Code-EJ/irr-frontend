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
import { sales, buyers, } from "../../src/features/sales/api";
import { processing, inventory } from "../../src/features/processing/api";
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
const pressings: string[] = [];
const saleIds: string[] = [];
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
        sortingDate: "2026-10-01T10:30:00-03:00",
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
  expect(new Date(sorted.data.sortingDate).toISOString()).toBe("2026-10-01T13:30:00.000Z");
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
it("posts and replays pressing, blocks upstream reversal and restores exact inventory", async () => {
  scope(member);
  const sorting = await safe(processing.get("sortings", sortings[0]));
  const line = "sortedItems" in sorting ? sorting.sortedItems![0] : undefined;
  expect(line).toBeDefined();
  const before = (await safe(inventory.balances(0))).items.find(value => value.materialSubtypeId === subtypeId)!;
  const payload = { pressingDate: "2026-10-02T10:30:00-03:00", pressedBales: [{ sortedItemId: line!.id!, materialSubtypeId: subtypeId, weightKg: "0.2000", initialVolumeM3: "0.0200", finalVolumeM3: "0.0100", destinationType: "STOCK" as const }] };
  const key = randomUUID();
  const posted = await safe(processing.create("pressings", payload, key));
  pressings.push(posted.id!);
  expect(new Date("pressingDate" in posted ? posted.pressingDate! : "").toISOString()).toBe("2026-10-02T13:30:00.000Z");
  expect((await safe(processing.create("pressings", payload, key))).id).toBe(posted.id);
  const after = (await safe(inventory.balances(0))).items.find(value => value.materialSubtypeId === subtypeId)!;
  expect(after.weightKg).toBe(before.weightKg);
  expect(after.volumeM3).toBe("0.0300");
  expect((await safe(inventory.lots(0))).items.some(value => value.pressedBaleId)).toBe(true);
  expect((await safe(inventory.movements(0))).items.some(value => value.kind === "PRESSING")).toBe(true);
  expect(await status(processing.reverse("sortings", sortings[0], randomUUID()))).toBe(409);
  scope(admin, orgs[1]);
  expect(await status(processing.get("pressings", posted.id!))).toBe(404);
  scope(member);
  const reversalKey = randomUUID();
  const reversed = await safe(processing.reverse("pressings", posted.id!, reversalKey));
  expect((await safe(processing.reverse("pressings", posted.id!, reversalKey))).reversalOperationId).toBe(reversed.reversalOperationId);
  pressings.pop();
  const restored = (await safe(inventory.balances(0))).items.find(value => value.materialSubtypeId === subtypeId)!;
  expect(restored.weightKg).toBe(before.weightKg);
  expect(restored.volumeM3).toBe(before.volumeM3);
});
it("completes invoice-gated versioned sales with replay and exact stock restoration", async () => {
  scope();
  const buyer = await safe(buyers.create({ name: "Sales contract buyer", document: "12345678000199" }));
  await safe(buyers.update(buyer.id!, { name: "Updated sales buyer", document: "12345678000199" }));
  expect((await safe(buyers.get(buyer.id!))).name).toBe("Updated sales buyer");
  scope(member);
  expect(await status(buyers.create({ name: "Forbidden member buyer" }))).toBe(403);
  expect(await status(buyers.update(buyer.id!, { name: "Forbidden edit" }))).toBe(403);
  const sortedLot = (await safe(inventory.lots(0))).items.find(value => value.sortedItemId)!;
  const pressing = await safe(processing.create("pressings", { pressedBales: [{ sortedItemId: sortedLot.sortedItemId!, materialSubtypeId: subtypeId, weightKg: "0.2000", initialVolumeM3: "0.0200", finalVolumeM3: "0.0100", destinationType: "STOCK" }] }, randomUUID()));
  pressings.push(pressing.id!);
  const lot = (await safe(inventory.lots(0))).items.find(value => value.pressedBaleId)!;
  const before = (await safe(inventory.balances(0))).items.find(value => value.materialSubtypeId === subtypeId)!;
  const payload = { saleDate: "2026-10-09T12:00:00Z", buyerId: buyer.id!, items: [{ stockLotId: lot.id!, materialSubtypeId: subtypeId, weightKg: "0.0500", volumeM3: "0.0050", unitPrice: "1.2345" }] };
  let sale = await safe(sales.create(payload)); saleIds.push(sale.id);
  expect(sale.status).toBe("DRAFT"); expect(sale.totalValue).toBe("0.06");
  expect((await safe(inventory.balances(0))).items.find(value => value.materialSubtypeId === subtypeId)!.weightKg).toBe(before.weightKg);
  expect(await status(sales.transition(sale.id, "post", sale.version, randomUUID()))).toBe(400);
  const oldVersion = sale.version;
  sale = await safe(sales.update(sale.id, { ...payload, nfeAttachmentId: proofId, version: sale.version }));
  expect(await status(sales.update(sale.id, { ...payload, version: oldVersion }))).toBe(409);
  const postVersion = sale.version, postKey = randomUUID();
  sale = await safe(sales.transition(sale.id, "post", postVersion, postKey));
  expect(sale.status).toBe("POSTED");
  expect((await safe(sales.transition(sale.id, "post", postVersion, postKey))).version).toBe(sale.version);
  expect(await status(sales.update(sale.id, { ...payload, version: sale.version }))).toBe(409);
  expect(await status(sales.deactivate(sale.id, sale.version))).toBe(409);
  expect(await status(processing.reverse("pressings", pressing.id!, randomUUID()))).toBe(409);
  const after = (await safe(inventory.balances(0))).items.find(value => value.materialSubtypeId === subtypeId)!;
  expect(after.weightKg).toBe("0.3500"); expect(after.volumeM3).toBe("0.0250");
  scope(admin, orgs[1]); expect(await status(sales.get(sale.id))).toBe(404); expect(await status(buyers.get(buyer.id!))).toBe(404);
  scope(); expect(await status(buyers.deactivate(buyer.id!))).toBe(409);
  scope(member);
  const reverseVersion = sale.version, reverseKey = randomUUID();
  sale = await safe(sales.transition(sale.id, "reverse", reverseVersion, reverseKey));
  expect(sale.status).toBe("REVERSED");
  expect((await safe(sales.transition(sale.id, "reverse", reverseVersion, reverseKey))).version).toBe(sale.version);
  const restored = (await safe(inventory.balances(0))).items.find(value => value.materialSubtypeId === subtypeId)!;
  expect(restored.weightKg).toBe(before.weightKg); expect(restored.volumeM3).toBe(before.volumeM3);
  const excess = await safe(sales.create({ ...payload, nfeAttachmentId: proofId, items: [{ ...payload.items[0], weightKg: "99.0000" }] })); saleIds.push(excess.id);
  expect(await status(sales.transition(excess.id, "post", excess.version, randomUUID()))).toBe(409);
  expect(await status(sales.deactivate(excess.id, excess.version + 1))).toBe(409);
  await safe(sales.deactivate(excess.id, excess.version)); expect(await status(sales.get(excess.id))).toBe(404);
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
it("posts a multi-line processing batch atomically and rolls back all lines on stock conflict", async () => {
  scope();
  const source = await safe(donations.create(donation()));
  intake.push({ kind: "donation", id: source.id!, processed: true });
  const input = source.inputItems!.find(line => line.isActive !== false)!;
  const beforeSorting = (await safe(inventory.balances(0))).items.find(value => value.materialSubtypeId === subtypeId)!;
  const sortedLine = { inputItemId: input.id!, materialSubtypeId: subtypeId, weightKg: "0.0500", volumeM3: "0.0050", rejectWeightKg: "0", rejectVolumeM3: "0", destinationType: "STOCK" as const };
  const sortingPayload = { sortingType: "PRIMARY" as const, sortedItems: [sortedLine, { ...sortedLine, inputItemId: source.inputItems![1].id!, weightKg: "0.0600", volumeM3: "0.0060" }] };
  const sortingKey = randomUUID();
  const sorting = await safe(processing.create("sortings", sortingPayload, sortingKey));
  sortings.push(sorting.id!);
  expect("sortedItems" in sorting ? sorting.sortedItems : []).toHaveLength(2);
  expect((await safe(processing.create("sortings", sortingPayload, sortingKey))).id).toBe(sorting.id);
  const sortedItems = "sortedItems" in sorting ? sorting.sortedItems! : [];
  const beforePressing = (await safe(inventory.balances(0))).items.find(value => value.materialSubtypeId === subtypeId)!;
  const bales = sortedItems.map(line => ({ sortedItemId: line.id!, materialSubtypeId: subtypeId, weightKg: line.weightKg!, initialVolumeM3: line.volumeM3!, finalVolumeM3: "0.0010", destinationType: "STOCK" as const }));
  expect(await status(processing.create("pressings", { pressedBales: [bales[0], { ...bales[1], weightKg: "99.0000" }] }, randomUUID()))).toBe(409);
  const afterConflict = (await safe(inventory.balances(0))).items.find(value => value.materialSubtypeId === subtypeId)!;
  expect(afterConflict.weightKg).toBe(beforePressing.weightKg);
  expect(afterConflict.volumeM3).toBe(beforePressing.volumeM3);
  const pressingKey = randomUUID();
  const pressing = await safe(processing.create("pressings", { pressedBales: bales }, pressingKey));
  pressings.push(pressing.id!);
  expect("pressedBales" in pressing ? pressing.pressedBales : []).toHaveLength(2);
  expect((await safe(processing.create("pressings", { pressedBales: bales }, pressingKey))).id).toBe(pressing.id);
  expect(await status(processing.reverse("sortings", sorting.id!, randomUUID()))).toBe(409);
  await safe(processing.reverse("pressings", pressing.id!, randomUUID()));
  await safe(processing.reverse("sortings", sorting.id!, randomUUID()));
  const restored = (await safe(inventory.balances(0))).items.find(value => value.materialSubtypeId === subtypeId)!;
  expect(restored.weightKg).toBe(beforeSorting.weightKg);
  expect(restored.volumeM3).toBe(beforeSorting.volumeM3);
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
  for (const id of saleIds) {
    const code = await status(sales.get(id));
    if (code === 404) continue;
    await clean("restore sale", async () => {
      const sale = await sales.get(id);
      if (sale.status === "POSTED") await sales.transition(id, "reverse", sale.version, randomUUID());
      else if (sale.status === "DRAFT") await sales.deactivate(id, sale.version);
    });
  }
  for (const id of pressings)
    await clean("reverse pressing", async () => {
      const record = await processing.get("pressings", id);
      if (record.status === "POSTED") await processing.reverse("pressings", id, randomUUID());
    });
  for (const id of sortings)
    await clean("reverse sorting", async () => {
      const record = await processing.get("sortings", id);
      if (record.status === "POSTED") await processing.reverse("sortings", id, randomUUID());
    });
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
