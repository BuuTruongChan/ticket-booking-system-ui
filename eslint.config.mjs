import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const SCHEMA_CONTEXTS = [
  "catalog",
  "common",
  "event",
  "identity",
  "operations",
  "payment",
  "sales",
  "ticket",
  "user-history",
  "waitroom",
];

function restrictSchemaSelfAlias(context) {
  return {
    files: [`schemas/${context}/**/*.ts`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [`@schemas/${context}`, `@schemas/${context}/*`],
              message: `Use relative imports within schemas/${context} internals.`,
            },
          ],
        },
      ],
    },
  };
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["schemas/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/schemas",
              message:
                "Avoid root schema barrels inside schema internals. Use relative imports or explicit @schemas/<context> imports.",
            },
            {
              name: "@schemas",
              message:
                "Avoid root schema barrels inside schema internals. Use relative imports or explicit @schemas/<context> imports.",
            },
          ],
          patterns: [
            {
              group: ["@/schemas/*"],
              message:
                "Use @schemas/<context> for cross-context imports and relative paths for same-context imports.",
            },
          ],
        },
      ],
    },
  },
  ...SCHEMA_CONTEXTS.map(restrictSchemaSelfAlias),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
