/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
type Listener = () => void;
const listeners = new Set<Listener>();
let organizationId: string | null = null;
let generation = 0;
let controller = new AbortController();
/** Invalidates requests and private views whenever the identity or scope changes. */
function invalidate() {
  generation++;
  controller.abort();
  controller = new AbortController();
  listeners.forEach((listener) => listener());
}
export const session = {
  getToken: () => localStorage.getItem("token"),
  getOrganization: () => organizationId,
  getGeneration: () => generation,
  getSignal: () => controller.signal,
  setToken(token: string) {
    localStorage.setItem("token", token);
    organizationId = null;
    invalidate();
  },
  selectOrganization(id: string | null) {
    organizationId = id;
    invalidate();
  },
  clear() {
    localStorage.removeItem("token");
    organizationId = null;
    invalidate();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
