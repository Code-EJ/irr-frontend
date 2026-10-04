import { defineConfig } from "vitest/config";

/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
    // Keep local Windows runs bounded when PostgreSQL and Docker are running too.
    pool: "threads",
    maxWorkers: 2,
  },
});
