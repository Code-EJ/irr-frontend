import { defineConfig } from "vitest/config";

/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
export default defineConfig({
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
