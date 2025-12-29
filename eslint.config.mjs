import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import unusedImports from "eslint-plugin-unused-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "*.config.js",
    "*.config.mjs",
    ".eslintrc.js",
    "next.config.js",
    "tailwind.config.js",
    "postcss.config.js",
    "public/**",
    ".git/**",
    "coverage/**",
    ".nyc_output/**",
    "*.min.js",
    "*.bundle.js",
    "next-env.d.ts",
  ]),
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    plugins: {
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      // Remove unused imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      // Sort imports
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // Disable default import sorting rules to avoid conflicts
      "import/order": "off",
      "sort-imports": "off",
    },
  },
]);

export default eslintConfig;
