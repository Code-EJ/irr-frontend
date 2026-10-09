/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { components } from "../../shared/api/schema";
import { apiClient } from "../../shared/api/client";
import { organizationHeaders } from "../../shared/api/transport";
import { scopedPage } from "../../shared/api/page";
type Schema = components["schemas"];
export type Buyer = Schema["BuyerResponse"];
export type BuyerRequest = Schema["BuyerRequest"];
export type Sale = Schema["SaleResponse"];
export type Draft = Schema["SaleDraftRequest"];
export type SaleLine = Schema["SaleLineRequest"];
export const buyers = {
  list: (page: number) => scopedPage<Buyer>("/buyers", page, "name,asc"),
  async get(id: string) { return (await apiClient.get<Buyer>(`/buyers/${id}`, { headers: organizationHeaders() })).data; },
  async create(payload: BuyerRequest) { return (await apiClient.post<Buyer>("/buyers", payload, { headers: organizationHeaders() })).data; },
  async update(id: string, payload: BuyerRequest) { return (await apiClient.put<Buyer>(`/buyers/${id}`, payload, { headers: organizationHeaders() })).data; },
  async deactivate(id: string) { await apiClient.delete(`/buyers/${id}`, { headers: organizationHeaders() }); },
};
/** Validates identity/version before a browser can offer a state-changing action. */
export function checkedSale(sale: Sale): Sale & { id: string; version: number } {
  if (!sale.id || !Number.isSafeInteger(sale.version) || sale.version! < 0 || !["DRAFT", "POSTED", "REVERSED"].includes(sale.status ?? "")) throw new Error("Invalid sale response.");
  return sale as Sale & { id: string; version: number };
}
export const sales = {
  list: (page: number) => scopedPage<Sale>("/sales", page, "saleDate,desc"),
  async get(id: string) { return checkedSale((await apiClient.get<Sale>(`/sales/${id}`, { headers: organizationHeaders() })).data); },
  async create(payload: Draft) { return checkedSale((await apiClient.post<Sale>("/sales", payload, { headers: organizationHeaders() })).data); },
  async update(id: string, payload: Draft) { return checkedSale((await apiClient.put<Sale>(`/sales/${id}`, payload, { headers: organizationHeaders() })).data); },
  async deactivate(id: string, version: number) { await apiClient.delete(`/sales/${id}`, { headers: organizationHeaders(), params: { version } }); },
  async transition(id: string, action: "post" | "reverse", version: number, key: string) {
    return checkedSale((await apiClient.post<Sale>(`/sales/${id}/${action}`, { version }, { headers: { ...organizationHeaders(), "Idempotency-Key": key } })).data);
  },
};
export async function buyerChoices(page: number) {
  const result = await buyers.list(page);
  return { ...result, items: result.items.map(item => { if (!item.id || !item.name) throw new Error("Invalid buyer response."); return { id: item.id, label: item.name }; }) };
}
export async function buyerChoice(id: string) {
  const item = await buyers.get(id);
  if (!item.id || !item.name) throw new Error("Invalid buyer response.");
  return { id: item.id, label: item.name };
}
export const saleStatus: Record<string, string> = { DRAFT: "Rascunho", POSTED: "Registrada", REVERSED: "Revertida" };
