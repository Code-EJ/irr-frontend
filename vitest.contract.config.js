import { defineConfig } from "vitest/config";

/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
export default defineConfig({
  test: {
    include: ["tests/contract/**/*.test.ts"],
    environment: "node",
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false,
  },
});
