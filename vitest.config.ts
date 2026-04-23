import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: [
      "hooks/**/*.test.ts",
      "schemas/**/*.test.ts",
      "lib/**/*.test.ts",
      "components/**/*.test.tsx",
    ],
    exclude: ["specs/**", "node_modules/**"],
    setupFiles: ["./vitest.setup.ts"],
    clearMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@lib": path.resolve(__dirname, "lib"),
      "@hooks": path.resolve(__dirname, "hooks"),
      "@schemas": path.resolve(__dirname, "schemas"),
    },
  },
});
