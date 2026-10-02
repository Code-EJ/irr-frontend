/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { apiClient } from "../../shared/api/client";
import { organizationHeaders } from "../../shared/api/transport";
import type { components } from "../../shared/api/schema";

export type CatalogLevel = "categories" | "types" | "subtypes";
type Schema = components["schemas"];
type Response =
  | Schema["MaterialCategoryResponseDTO"]
  | Schema["MaterialTypeResponseDTO"]
  | Schema["MaterialSubtypeResponseDTO"];
export type CatalogEntry = Response & {
  id: string;
  name: string;
  version: number;
};
type Page = Schema["PageMaterialCategoryResponseDTO"];
function entry(data: Response): CatalogEntry {
  if (!data.id || !data.name || !Number.isSafeInteger(data.version))
    throw new Error("The catalog response is missing its identity or version.");
  return { ...data, id: data.id, name: data.name, version: data.version! };
}
const resource = (level: CatalogLevel) => "/materials/" + level;
/** Catalog-specific adapter: parent ownership and optimistic versions stay server-authoritative. */
export const catalog = {
  async list(
    level: CatalogLevel,
    page: number,
    name: string,
    parentId?: string,
  ) {
    const { data } = await apiClient.get<Page>(resource(level), {
      headers: organizationHeaders(),
      params: {
        page,
        size: 10,
        sort: "name,asc",
        name: name || undefined,
        ...(level === "types"
          ? { categoryId: parentId }
          : level === "subtypes"
            ? { typeId: parentId }
            : {}),
      },
    });
    if (
      !data.content ||
      data.totalPages === undefined ||
      data.totalElements === undefined
    )
      throw new Error("Invalid catalog page.");
    return {
      items: data.content.map(entry),
      pages: data.totalPages,
      total: data.totalElements,
    };
  },
  async get(level: CatalogLevel, id: string) {
    return entry(
      (
        await apiClient.get<Response>(resource(level) + "/" + id, {
          headers: organizationHeaders(),
        })
      ).data,
    );
  },
  async create(level: CatalogLevel, name: string, parentId?: string) {
    if (level !== "categories" && !parentId)
      throw new Error("Select the parent before creating a material.");
    const payload:
      | Schema["MaterialCategoryCreateRequestDTO"]
      | Schema["MaterialTypeCreateRequestDTO"]
      | Schema["MaterialSubtypeCreateRequestDTO"] =
      level === "categories"
        ? { name }
        : level === "types"
          ? { name, categoryId: parentId! }
          : { name, typeId: parentId! };
    return entry(
      (
        await apiClient.post<Response>(resource(level), payload, {
          headers: organizationHeaders(),
        })
      ).data,
    );
  },
  async update(level: CatalogLevel, id: string, name: string, version: number) {
    const payload: Schema["MaterialCategoryUpdateRequestDTO"] = {
      name,
      version,
    };
    return entry(
      (
        await apiClient.put<Response>(resource(level) + "/" + id, payload, {
          headers: organizationHeaders(),
        })
      ).data,
    );
  },
  async deactivate(level: CatalogLevel, id: string) {
    await apiClient.delete(resource(level) + "/" + id, {
      headers: organizationHeaders(),
    });
  },
};
