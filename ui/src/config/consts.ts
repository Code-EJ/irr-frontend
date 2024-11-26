import { env } from "process";

export const API_HOST: string = env.API_HOST || "localhost:3000";
