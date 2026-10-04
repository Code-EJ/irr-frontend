/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { apiClient } from "../../shared/api/client";
import type { components } from "../../shared/api/schema";
export type Account = components["schemas"]["UserResponse"];
export type Organization = components["schemas"]["Organization"];
export type Membership = components["schemas"]["Membership"];
export type ProfileInput = components["schemas"]["UpdateProfileRequest"];
export type PartnerInput = components["schemas"]["UpdatePartnerRequest"];
export type PartnerCreate = components["schemas"]["CreatePartnerRequest"];
/** Changes only the authenticated account's public profile fields. */
export async function updateProfile(input: ProfileInput) {
  return (await apiClient.put<Account>("/users/me", input)).data;
}
/** Success revokes this session; the caller must clear it and return to login. */
export async function changePassword(input: components["schemas"]["ChangePasswordRequest"]) {
  await apiClient.put("/users/me/password", input);
}
/** Platform administration never sends organization scope or grants implicit membership. */
export const accounts = {
  async list(page: number) {
    const {data} = await apiClient.get<components["schemas"]["PageUserResponse"]>("/users", {params:{page,size:10,sort:"fullName,asc"}});
    if (!data.content || data.totalPages === undefined || data.totalElements === undefined) throw new Error("Invalid account page.");
    return {items:data.content, pages:data.totalPages, total:data.totalElements};
  },
  async get(id: string) { return (await apiClient.get<Account>(`/users/${id}`)).data; },
  async create(input: PartnerCreate) { return (await apiClient.post<Account>("/users",input)).data; },
  async update(id: string, input: PartnerInput) { return (await apiClient.put<Account>(`/users/${id}`,input)).data; },
  async deactivate(id: string) { await apiClient.delete(`/users/${id}`); },
  async reset(id: string, temporaryPassword: string) {
    const input: components["schemas"]["ResetPasswordRequest"] = {temporaryPassword};
    await apiClient.put(`/users/${id}/password`,input);
  },
};
export const organizationAdministration = {
  async list(page: number) {
    const {data} = await apiClient.get<components["schemas"]["OrganizationPage"]>("/organizations/admin",{params:{page,size:10}});
    if (!data.content || data.totalElements === undefined) throw new Error("Invalid organization page.");
    return {items:data.content, pages:Math.ceil(data.totalElements/10), total:data.totalElements};
  },
  async membership(organizationId: string, userId: string) {
    return (await apiClient.get<Membership>(`/organizations/${organizationId}/members/${userId}`)).data;
  },
  async grant(organizationId: string, userId: string, role: "MEMBER"|"MANAGER") {
    const input: components["schemas"]["GrantMembership"] = {role};
    return (await apiClient.put<Membership>(`/organizations/${organizationId}/members/${userId}`,input)).data;
  },
  async revoke(organizationId: string, userId: string) { await apiClient.delete(`/organizations/${organizationId}/members/${userId}`); },
};
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
