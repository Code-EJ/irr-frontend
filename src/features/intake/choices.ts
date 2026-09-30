/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { Choice } from "../../shared/ui/ResourcePicker";
import type { Page } from "../../shared/api/page";
import { donors, team, teamRoles, type TeamMember } from "../parties/api";
import { documents } from "../documents/api";
import { fleet } from "../fleet/api";
import { catalog } from "../materials/api";
function choice(id: string | undefined, label: string | undefined): Choice {
  if (!id || !label) throw new Error("Invalid reference response.");
  return { id, label };
}
function mapPage<T>(page: Page<T>, map: (item: T) => Choice): Page<Choice> {
  return { ...page, items: page.items.map(map) };
}
const staff = (item: TeamMember) =>
  choice(
    item.id,
    (item.name ?? "") +
      " · " +
      (teamRoles[item.role as keyof typeof teamRoles] ?? item.role),
  );
export const donorChoices = async (page: number) =>
  mapPage(await donors.list(page), (item) => choice(item.id, item.name));
export const donorChoice = async (id: string) => {
  const item = await donors.get(id);
  return choice(item.id, item.name);
};
export const teamChoices = async (page: number) =>
  mapPage(await team.list(page), staff);
export const teamChoice = async (id: string) => staff(await team.get(id));
// The contract has no role filter. Preserve page navigation even when a page has no drivers.
export const driverChoices = async (page: number) => {
  const result = await team.list(page);
  return mapPage(
    { ...result, items: result.items.filter((item) => item.role === "DRIVER") },
    staff,
  );
};
export const vehicleChoices = async (page: number) =>
  mapPage(await fleet.list(page, "", ""), (item) =>
    choice(item.id, item.licensePlate + " · " + item.model),
  );
export const vehicleChoice = async (id: string) => {
  const item = await fleet.get(id);
  return choice(item.id, item.licensePlate + " · " + item.model);
};
export const documentChoices = async (page: number) =>
  mapPage(await documents.list(page), (item) => choice(item.id, item.fileName));
export const documentChoice = async (id: string) => {
  const item = await documents.get(id);
  return choice(item.id, item.fileName);
};
export const subtypeChoices = async (page: number) =>
  mapPage(await catalog.list("subtypes", page, ""), (item) =>
    choice(item.id, item.name + " · " + item.id.slice(0, 8)),
  );
export const subtypeChoice = async (id: string) => {
  const item = await catalog.get("subtypes", id);
  return choice(item.id, item.name + " · " + item.id.slice(0, 8));
};
