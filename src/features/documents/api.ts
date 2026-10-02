/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import type { components } from "../../shared/api/schema";
import { apiClient } from "../../shared/api/client";
import { organizationHeaders } from "../../shared/api/transport";
import { scopedPage } from "../../shared/api/page";
export type Attachment = components["schemas"]["AttachmentResponse"];
/** Uses authenticated requests for file access; never places bearer tokens in download URLs. */
export const documents = {
  list: (page: number) =>
    scopedPage<Attachment>("/documents", page, "createdAt,desc"),
  async get(id: string) {
    return (
      await apiClient.get<Attachment>("/documents/" + id, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async upload(file: File) {
    const form = new FormData();
    form.append("documento", file);
    return (
      await apiClient.post<Attachment>("/documents", form, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async rename(id: string, fileName: string) {
    const payload: components["schemas"]["RenameAttachment"] = { fileName };
    return (
      await apiClient.put<Attachment>("/documents/" + id, payload, {
        headers: organizationHeaders(),
      })
    ).data;
  },
  async remove(id: string) {
    await apiClient.delete("/documents/" + id, {
      headers: organizationHeaders(),
    });
  },
  async download(id: string) {
    return (
      await apiClient.get<Blob>("/documents/" + id + "/download", {
        headers: organizationHeaders(),
        responseType: "blob",
      })
    ).data;
  },
};
