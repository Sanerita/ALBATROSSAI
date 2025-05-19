import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  ...compat.config({
    extends: ["plugin:@typescript-eslint/recommended"],
    rules: {
      // Core ESLint rules
      "no-unused-vars": "off", // Disable base rule in favor of TS version
      "no-console": "warn",
      
      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-empty-object-type": "error",
      // React/Next.js specific
      "react-hooks/exhaustive-deps": "warn",
    },
    overrides: [
      {
        files: ["**/generated/**"],
        rules: {
          "@typescript-eslint/no-explicit-any": "off",
          "@typescript-eslint/no-unused-vars": "off",
          "@typescript-eslint/no-empty-object-type": "off",
          "no-unused-expressions": "off"
        }
      }
    ]
  }),
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      // Add other directories to ignore here
    ]
  }
];