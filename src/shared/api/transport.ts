/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import axios, { AxiosError, CanceledError } from "axios";
import { session } from "./session";
/** Requires an explicit v1 API root; credentials and relative/legacy roots are rejected. */
export function validateBaseUrl(value: string | undefined): string {
  if (!value)
    throw new Error("Set VITE_API_BASE_URL to the backend /api/v1 URL.");
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname.replace(/\/$/, "") !== "/api/v1"
  )
    throw new Error(
      "VITE_API_BASE_URL must be an HTTP(S) origin followed by /api/v1.",
    );
  return url.href.replace(/\/$/, "");
}
/** Builds the single application transport with request-time credentials and stale-response protection. */
export function createClient(baseURL: string) {
  const client = axios.create({
    baseURL: validateBaseUrl(baseURL),
    timeout: 15000,
  });
  client.interceptors.request.use((config) => {
    if (
      !config.url?.startsWith("/") ||
      config.url.startsWith("//") ||
      config.url.includes("://") ||
      config.url.includes("..")
    )
      throw new Error("Only relative v1 resource paths are supported.");
    const token = session.getToken();
    const requestedOrganization = config.headers.get("X-Organization-Id");
    if (
      requestedOrganization &&
      requestedOrganization !== session.getOrganization()
    )
      throw new CanceledError(
        "Organization changed before the request was sent.",
      );
    if (token && config.url !== "/session/authenticate")
      config.headers.set("Authorization", "Bearer " + token);
    else config.headers.delete("Authorization");
    const generation = session.getGeneration();
    Object.assign(config, { requestGeneration: generation });
    config.signal = session.getSignal();
    return config;
  });
  client.interceptors.response.use(
    (response) => {
      const config = response.config as typeof response.config & {
        requestGeneration?: number;
      };
      if (config.requestGeneration !== session.getGeneration())
        throw new CanceledError("Session or organization changed.");
      return response;
    },
    (error: AxiosError) => {
      const config = error.config as typeof error.config & {
        requestGeneration?: number;
      };
      if (config && config.requestGeneration !== session.getGeneration())
        return Promise.reject(
          new CanceledError("Session or organization changed."),
        );
      if (
        error.response?.status === 401 &&
        config?.url !== "/session/authenticate"
      )
        session.clear();
      return Promise.reject(error);
    },
  );
  return client;
}
export function organizationHeaders() {
  const id = session.getOrganization();
  if (!id) throw new Error("Select an organization first.");
  return { "X-Organization-Id": id };
}
export function errorMessage(error: unknown): string {
  if (axios.isCancel(error)) return "";
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const messages: Record<number, string> = {
      400: "Confira os dados informados e a organização selecionada.",
      401: "Sua sessão expirou. Entre novamente.",
      403: "Você não tem permissão para realizar esta ação.",
      404: "O registro ou a organização não está mais disponível.",
      409: "O registro foi alterado ou está em uso em outra operação. Recarregue antes de tentar novamente.",
      413: "O arquivo excede o tamanho permitido.",
    };
    return status
      ? (messages[status] ??
          "Não foi possível concluir a solicitação. Tente novamente.")
      : "Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.";
  }
  return "Não foi possível concluir a solicitação. Tente novamente.";
}
