/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { createClient } from "./transport";
export const apiClient = createClient(import.meta.env.VITE_API_BASE_URL);
