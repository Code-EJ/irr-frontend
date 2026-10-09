/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { components } from "../../shared/api/schema";
import { apiClient } from "../../shared/api/client";
import { organizationHeaders } from "../../shared/api/transport";
import { scopedPage } from "../../shared/api/page";
type Schema = components["schemas"];
export type Sorting = Schema["SortingResponseDTO"];
export type Pressing = Schema["PressingResponseDTO"];
export type Lot = Schema["Lot"];
export type Balance = Schema["Balance"];
export type Movement = Schema["Movement"];
export type ProcessingKind = "sortings" | "pressings";
export type ProcessingPayload = Schema["SortingCreateRequestDTO"] | Schema["PressingCreateRequestDTO"];
/** Reuses a command key after uncertain delivery; an edited payload receives a new key. */
export function commandIdentity() {
  let fingerprint = "";
  let key = "";
  return (payload: unknown) => {
    const next = JSON.stringify(payload);
    if (next !== fingerprint) { fingerprint = next; key = crypto.randomUUID(); }
    return key;
  };
}
export const processing = {
  sortings: (page: number) => scopedPage<Sorting>("/sortings", page, "sortingDate,desc"),
  pressings: (page: number) => scopedPage<Pressing>("/pressings", page, "pressingDate,desc"),
  async get(kind: ProcessingKind, id: string) {
    return (await apiClient.get<Sorting | Pressing>(`/${kind}/${id}`, { headers: organizationHeaders() })).data;
  },
  async create(kind: ProcessingKind, payload: ProcessingPayload, key: string) {
    return (await apiClient.post<Sorting | Pressing>(`/${kind}`, payload, { headers: { ...organizationHeaders(), "Idempotency-Key": key } })).data;
  },
  async reverse(kind: ProcessingKind, id: string, key: string) {
    return (await apiClient.post<Schema["Result"]>(`/${kind}/${id}/reverse`, null, { headers: { ...organizationHeaders(), "Idempotency-Key": key } })).data;
  },
};
export const inventory = {
  balances: (page: number) => scopedPage<Balance>("/inventory/balances", page, "materialName,asc"),
  lots: (page: number) => scopedPage<Lot>("/inventory/lots", page, "createdAt,desc"),
  movements: (page: number) => scopedPage<Movement>("/inventory/movements", page, "occurredAt,desc"),
};
