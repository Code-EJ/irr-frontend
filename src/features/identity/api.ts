/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { apiClient } from "../../shared/api/client";
import type { components } from "../../shared/api/schema";
export type Account = components["schemas"]["UserResponse"];
export type Organization = components["schemas"]["Organization"];
export type Membership = components["schemas"]["Membership"];
export async function authenticate(email: string, password: string) {
  const input: components["schemas"]["LoginRequestDTO"] = { email, password };
  const { data } = await apiClient.post<
    components["schemas"]["LoginResponseDTO"]
  >("/session/authenticate", input);
  if (!data.token) throw new Error("Invalid authentication response.");
  return data.token;
}
export async function currentAccount() {
  const { data } = await apiClient.get<Account>("/users/me");
  if (!data.id) throw new Error("Invalid account response.");
  return data;
}
export async function organizations() {
  const result: Organization[] = [];
  let page = 0;
  while (true) {
    const { data } = await apiClient.get<
      components["schemas"]["OrganizationPage"]
    >("/organizations", { params: { page, size: 100 } });
    if (
      !data.content ||
      data.totalElements === undefined ||
      data.content.some((org) => !org.id)
    )
      throw new Error("Invalid organization page.");
    result.push(...data.content);
    if (result.length >= data.totalElements || data.content.length === 0)
      return result;
    page++;
  }
}
export async function membership(id: string) {
  const data = (
    await apiClient.get<Membership>("/organizations/" + id + "/membership")
  ).data;
  if (
    data.organizationId !== id ||
    !data.active ||
    !["MEMBER", "MANAGER"].includes(data.role ?? "")
  )
    throw new Error("The organization membership is no longer available.");
  return data;
}
