/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { apiClient } from "./client";
import { organizationHeaders } from "./transport";
export type Page<T> = { items: T[]; total: number; pages: number };
/** Validates the shared Spring page envelope without hiding resource-specific contracts. */
export async function scopedPage<T>(
  path: string,
  page: number,
  sort: string,
): Promise<Page<T>> {
  const { data } = await apiClient.get<{
    content?: T[];
    totalElements?: number;
    totalPages?: number;
  }>(path, {
    headers: organizationHeaders(),
    params: { page, size: 10, sort },
  });
  if (
    !Array.isArray(data.content) ||
    !Number.isSafeInteger(data.totalPages) ||
    !Number.isSafeInteger(data.totalElements)
  )
    throw new Error("Invalid page envelope.");
  return {
    items: data.content,
    total: data.totalElements!,
    pages: data.totalPages!,
  };
}
